import { z } from 'zod'
import { ApiError, errorResponse, jsonResponse, requireMontAccess } from '../../server/mont.js'

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
})
const periodSchema = z.enum(['this_month', 'last_month', 'this_year', 'last_30_days', 'custom'])

export function dateSaoPaulo(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date())
  const get = (name: string) => parts.find((part) => part.type === name)?.value || ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function resolveFinancialRange(params: URLSearchParams) {
  const parsed = periodSchema.safeParse(params.get('period') || 'this_month')
  if (!parsed.success) throw new ApiError(422, 'invalid_period', 'Período inválido')
  const period = parsed.data
  const today = dateSaoPaulo()
  const [year, month] = today.split('-').map(Number)
  let from = `${today.slice(0, 7)}-01`
  let to = today

  if (period === 'last_month') {
    from = new Date(Date.UTC(year, month - 2, 1)).toISOString().slice(0, 10)
    to = new Date(Date.UTC(year, month - 1, 0)).toISOString().slice(0, 10)
  } else if (period === 'this_year') {
    from = `${year}-01-01`
  } else if (period === 'last_30_days') {
    const start = new Date(`${today}T00:00:00Z`)
    start.setUTCDate(start.getUTCDate() - 29)
    from = start.toISOString().slice(0, 10)
  } else if (period === 'custom') {
    from = params.get('from') || ''
    to = params.get('to') || ''
  }

  if (!dateSchema.safeParse(from).success || !dateSchema.safeParse(to).success || from > to) {
    throw new ApiError(422, 'invalid_dates', 'Datas inválidas; use AAAA-MM-DD')
  }
  if ((Date.parse(to) - Date.parse(from)) > 5 * 366 * 86_400_000) {
    throw new ApiError(422, 'date_range_too_large', 'Período maior que cinco anos')
  }
  return { period, from, to }
}

function amountCents(amount: number): number {
  const cents = Math.round(Number(amount) * 100)
  if (!Number.isSafeInteger(cents) || cents < 0) {
    throw new ApiError(502, 'invalid_amount', 'Valor inconsistente em lançamento')
  }
  return cents
}

type Flow = { income_cents: number; expense_cents: number; transaction_count: number }
function blankFlow(): Flow { return { income_cents: 0, expense_cents: 0, transaction_count: 0 } }
function record(flow: Flow, type: 'income' | 'expense', cents: number) {
  if (type === 'income') flow.income_cents += cents
  else flow.expense_cents += cents
  flow.transaction_count++
}
function present(flow: Flow) {
  return {
    income: flow.income_cents / 100,
    expenses: flow.expense_cents / 100,
    net: (flow.income_cents - flow.expense_cents) / 100,
    transaction_count: flow.transaction_count,
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
      if (walletId && !z.uuid().safeParse(walletId).success) {
        throw new ApiError(422, 'invalid_wallet', 'Identificador de carteira inválido')
      }
      // This is strictly read-only. Show the stored wallet balance separately from the
      // flow derived from transaction history: never call either a live bank balance.
      const { data: wallets, error: walletError } = await supabase.from('wallets')
        .select('id,name,type,current_balance,is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: true })
      if (walletError) {
        console.error('Mont financial wallet read failed:', walletError.code)
        throw new ApiError(502, 'upstream_error', 'Não foi possível consultar as carteiras')
      }
      const active = wallets ?? []
      if (walletId && !active.some((w) => w.id === walletId)) {
        throw new ApiError(404, 'wallet_not_found', 'Carteira não encontrada ou inativa')
      }

      const periodTotal = blankFlow()
      const historicalTotal = blankFlow()
      const periodByWallet = new Map(active.map((w) => [w.id, blankFlow()]))
      const historicalByWallet = new Map(active.map((w) => [w.id, blankFlow()]))
      const unassignedPeriod = blankFlow()
      // Paginate all historical movements, not just the first 1,000, to avoid
      // silently incorrect account flows. A hard cap fails closed instead.
      const pageSize = 500
      let completed = false
      for (let page = 0; page < 200; page++) {
        let query = supabase.from('transactions')
          .select('id,type,amount,transaction_date,wallet_id')
          .eq('user_id', userId)
          .lte('transaction_date', to)
          .order('id', { ascending: true })
          .range(page * pageSize, (page + 1) * pageSize - 1)
        if (walletId) query = query.eq('wallet_id', walletId)
        const { data, error } = await query
        if (error) {
          console.error('Mont financial transaction read failed:', error.code)
          throw new ApiError(502, 'upstream_error', 'Não foi possível calcular as movimentações')
        }
        for (const row of data ?? []) {
          const cents = amountCents(row.amount)
          record(historicalTotal, row.type, cents)
          const historicWallet = row.wallet_id ? historicalByWallet.get(row.wallet_id) : undefined
          if (historicWallet) record(historicWallet, row.type, cents)
          if (row.transaction_date >= from) {
            record(periodTotal, row.type, cents)
            const periodWallet = row.wallet_id ? periodByWallet.get(row.wallet_id) : undefined
            if (periodWallet) record(periodWallet, row.type, cents)
            else record(unassignedPeriod, row.type, cents)
          }
        }
        if ((data ?? []).length < pageSize) { completed = true; break }
      }
      if (!completed) throw new ApiError(413, 'too_many_transactions', 'Limite de lançamentos alcançado; consulte o FinTrack')

      return jsonResponse({
        currency: 'BRL',
        period, from, to, wallet_id: walletId,
        period_totals: present(periodTotal),
        historical_totals_through_end: present(historicalTotal),
        wallets: active.filter((wallet) => !walletId || wallet.id === walletId).map((wallet) => ({
          id: wallet.id, name: wallet.name, type: wallet.type,
          recorded_balance: wallet.current_balance,
          historical_flow_through_end: present(historicalByWallet.get(wallet.id) ?? blankFlow()),
          period_flow: present(periodByWallet.get(wallet.id) ?? blankFlow()),
        })),
        unassigned_or_inactive_wallet_period_flow: present(unassignedPeriod),
        definitions: {
          recorded_balance: 'Valor armazenado na carteira pelo FinTrack; não é saldo bancário em tempo real',
          historical_flow: 'Receitas menos despesas lançadas no FinTrack até a data final, sem incorporar saldo inicial',
          period_net: 'Receitas menos despesas no período informado',
        },
      })
    } catch (error) {
      return errorResponse(error)
    }
  },
}
