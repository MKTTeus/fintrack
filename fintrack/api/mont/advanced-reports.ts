import { ApiError, errorResponse, jsonResponse, requireMontAccess } from '../../server/mont.js'
import { resolveFinancialRange } from './financial-summary.js'

type Entry = { title: string; amount: number; type: 'income' | 'expense'; category: string; transaction_date: string; wallet_id: string | null }
const money = (cents: number) => Math.round(cents) / 100
const empty = () => ({ income: 0, expenses: 0, count: 0 })
function fillMissingMonths(months: Map<string, ReturnType<typeof empty>>, from: string, to: string) {
  const [startYear, startMonth] = from.slice(0, 7).split('-').map(Number)
  const limit = to.slice(0, 7)
  for (let i = 0; i <= 60; i++) {
    const month = new Date(Date.UTC(startYear, startMonth - 1 + i, 1)).toISOString().slice(0, 7)
    if (month > limit) break
    if (!months.has(month)) months.set(month, empty())
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET') return jsonResponse({ error: 'method_not_allowed' }, 405)
    try {
      const { supabase, userId } = requireMontAccess(request)
      const params = new URL(request.url).searchParams
      const { period, from, to } = resolveFinancialRange(params)
      const walletId = params.get('wallet_id')
      if (walletId && !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(walletId)) {
        throw new ApiError(422, 'invalid_wallet', 'ID de carteira inválido')
      }
      const monthly = new Map<string, ReturnType<typeof empty>>()
      const categories = new Map<string, { cents: number; count: number }>()
      const largest: { title: string; amount: number; date: string; category: string }[] = []
      const totals = empty()
      let completed = false
      for (let page = 0; page < 200; page++) {
        let query = supabase.from('transactions')
          .select('title,amount,type,category,transaction_date,wallet_id,id')
          .eq('user_id', userId).gte('transaction_date', from).lte('transaction_date', to)
          .order('id', { ascending: true }).range(page * 500, (page + 1) * 500 - 1)
        if (walletId) query = query.eq('wallet_id', walletId)
        const { data, error } = await query
        if (error) {
          console.error('Mont report failed:', error.code)
          throw new ApiError(502, 'upstream_error', 'Falha ao consultar as movimentações')
        }
        for (const entry of (data ?? []) as Entry[]) {
          const c = Math.round(Number(entry.amount) * 100)
          if (!Number.isSafeInteger(c) || c < 0) throw new ApiError(502, 'invalid_amount', 'Valor inconsistente no relatório')
          const key = entry.transaction_date.slice(0, 7)
          const row = monthly.get(key) ?? empty()
          const field = entry.type === 'income' ? 'income' : 'expenses'
          row[field] += c
          row.count++
          monthly.set(key, row)
          totals[field] += c
          totals.count++
          if (entry.type === 'expense') {
            const cat = categories.get(entry.category) ?? { cents: 0, count: 0 }
            cat.cents += c
            cat.count++
            categories.set(entry.category, cat)
            largest.push({ title: entry.title, amount: money(c), date: entry.transaction_date, category: entry.category })
          }
        }
        if ((data ?? []).length < 500) { completed = true; break }
      }
      if (!completed) throw new ApiError(413, 'too_many_transactions', 'Relatório muito extenso; reduza o período')
      fillMissingMonths(monthly, from, to)
      const months = [...monthly.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([month, row]) => ({
        month, income: money(row.income), expenses: money(row.expenses),
        net: money(row.income - row.expenses), count: row.count,
      }))
      largest.sort((a, b) => b.amount - a.amount)
      const topCategories = [...categories.entries()].map(([name, row]) => ({
        name, total: money(row.cents), count: row.count,
        share_percent: totals.expenses ? Math.round(row.cents / totals.expenses * 10000) / 100 : 0,
      })).sort((a, b) => b.total - a.total)
      return jsonResponse({
        period, from, to, currency: 'BRL', wallet_id: walletId,
        totals: {
          income: money(totals.income), expenses: money(totals.expenses),
          net: money(totals.income - totals.expenses), count: totals.count,
          savings_rate_percent: totals.income ? Math.round((totals.income - totals.expenses) / totals.income * 10000) / 100 : null,
        },
        months, top_categories: topCategories, largest_expenses: largest.slice(0, 10),
        note: 'Taxa de economia = (receitas - despesas) / receitas. Não inclui saldo inicial das carteiras.',
      })
    } catch (error) { return errorResponse(error) }
  },
}
