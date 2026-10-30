import { checkCategory } from '../../server/categories.js'
import { ApiError, errorResponse, jsonResponse, requireMontAccess } from '../../server/mont.js'

type Period = 'this_month' | 'last_month' | 'this_year' | 'last_30_days' | 'custom'

function dateInSaoPaulo(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const lookup = (name: string) => parts.find((part) => part.type === name)?.value || ''
  return `${lookup('year')}-${lookup('month')}-${lookup('day')}`
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function periodDates(url: URL): { period: Period; from: string; to: string } {
  const rawPeriod = url.searchParams.get('period') || 'this_month'
  if (!['this_month', 'last_month', 'this_year', 'last_30_days', 'custom'].includes(rawPeriod)) {
    throw new ApiError(422, 'invalid_period', 'Período inválido')
  }
  const period = rawPeriod as Period
  const today = dateInSaoPaulo()
  const y = Number(today.slice(0, 4))
  const m = Number(today.slice(5, 7))

  let from: string
  let to = today
  if (period === 'this_month') {
    from = `${today.slice(0, 7)}-01`
  } else if (period === 'last_month') {
    const first = new Date(Date.UTC(y, m - 2, 1))
    const last = new Date(Date.UTC(y, m - 1, 0))
    from = first.toISOString().slice(0, 10)
    to = last.toISOString().slice(0, 10)
  } else if (period === 'this_year') {
    from = `${y}-01-01`
  } else if (period === 'last_30_days') {
    const start = new Date(`${today}T00:00:00Z`)
    start.setUTCDate(start.getUTCDate() - 29)
    from = start.toISOString().slice(0, 10)
  } else {
    from = url.searchParams.get('from') || ''
    to = url.searchParams.get('to') || ''
  }

  if (!validDate(from) || !validDate(to) || from > to) {
    throw new ApiError(422, 'invalid_dates', 'Informe datas válidas (AAAA-MM-DD) em ordem crescente')
  }
  const durationDays = (Date.parse(to) - Date.parse(from)) / 86400000
  if (durationDays > 366 * 5) {
    throw new ApiError(422, 'date_range_too_large', 'O intervalo máximo é de cinco anos')
  }
  return { period, from, to }
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'method_not_allowed' }, 405)
    }
    try {
      const { supabase, userId } = requireMontAccess(request)
      const url = new URL(request.url)
      const { period, from, to } = periodDates(url)
      const category = url.searchParams.get('category')
      if (category !== null) await checkCategory(supabase, userId, category)

      const totals = new Map<string, { cents: number; count: number }>()
      let sumCents = 0
      let totalCount = 0

      // PostgREST defaults to 1,000 rows; paginate explicitly so a busy month
      // does not return silently incomplete financial totals.
      const pageSize = 500
      const maxPages = 100
      for (let page = 0; page < maxPages; page++) {
        let query = supabase
          .from('transactions')
          .select('id,amount,category')
          .eq('user_id', userId)
          .eq('type', 'expense')
          .gte('transaction_date', from)
          .lte('transaction_date', to)
          .order('id', { ascending: true })
          .range(page * pageSize, (page + 1) * pageSize - 1)

        if (category) query = query.eq('category', category)

        const { data, error } = await query
        if (error) {
          console.error('Mont spending lookup failed:', error.code)
          throw new ApiError(502, 'upstream_error', 'Não foi possível consultar os gastos')
        }
        const rows = data || []
        for (const row of rows) {
          const cents = Math.round(Number(row.amount) * 100)
          if (!Number.isFinite(cents) || cents < 0) {
            throw new ApiError(502, 'invalid_amount', 'Foi encontrado um valor inconsistente nas transações')
          }
          sumCents += cents
          totalCount++
          const group = totals.get(row.category) || { cents: 0, count: 0 }
          group.cents += cents
          group.count++
          totals.set(row.category, group)
        }
        if (rows.length < pageSize) {
          return jsonResponse({
            period, from, to, currency: 'BRL', category,
            total: sumCents / 100,
            transaction_count: totalCount,
            categories: [...totals.entries()]
              .map(([name, group]) => ({ name, total: group.cents / 100, count: group.count }))
              .sort((a, b) => b.total - a.total),
          })
        }
      }
      throw new ApiError(413, 'too_many_transactions', 'Muitas transações para esta consulta; reduza o período')
    } catch (error) {
      return errorResponse(error)
    }
  },
}
