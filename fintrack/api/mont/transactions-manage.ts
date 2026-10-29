import { z } from 'zod'
import { ApiError, errorResponse, jsonResponse, requireMontAccess } from '../../server/mont.js'

const uuid = z.uuid()
const categories = z.enum([
  'Salário', 'Freelance', 'Investimentos', 'Alimentação', 'Transporte',
  'Saúde', 'Lazer', 'Compras', 'Moradia', 'Contas e Serviços',
  'Educação', 'Viagens', 'Presentes', 'Doações', 'Outros',
])
const validDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
})
const amount = z.number().finite().positive().max(1_000_000).refine(
  (value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
)
const snapshot = z.strictObject({
  title: z.string().min(1),
  amount,
  type: z.enum(['expense', 'income']),
  category: z.string().min(1),
  transaction_date: validDate,
  wallet_id: uuid.nullable(),
})
const patch = z.strictObject({
  title: z.string().trim().min(3).max(120).optional(),
  amount: amount.optional(),
  type: z.enum(['expense', 'income']).optional(),
  category: categories.optional(),
  transaction_date: validDate.optional(),
  wallet_id: uuid.optional(),
}).refine((fields) => Object.keys(fields).length > 0)
const modifySchema = z.strictObject({
  id: uuid,
  expected: snapshot,
  changes: patch,
})
const deleteSchema = z.strictObject({
  id: uuid,
  expected: snapshot,
})

const fields = 'id,title,amount,type,category,transaction_date,wallet_id'
type Expected = z.infer<typeof snapshot>

function guardSnapshot(query: any, expected: Expected): any {
  return query
    .eq('title', expected.title)
    .eq('amount', expected.amount)
    .eq('type', expected.type)
    .eq('category', expected.category)
    .eq('transaction_date', expected.transaction_date)
    [expected.wallet_id === null ? 'is' : 'eq']('wallet_id', expected.wallet_id)
}

function parseBody(input: unknown) {
  if (!input || typeof input !== 'object') throw new ApiError(400, 'invalid_body', 'Corpo JSON inválido')
  return input
}

async function jsonBody(request: Request): Promise<unknown> {
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
    throw new ApiError(415, 'unsupported_media_type', 'Envie JSON')
  }
  const raw = await request.text()
  if (raw.length > 12_000) throw new ApiError(413, 'body_too_large', 'Requisição muito grande')
  try {
    return parseBody(JSON.parse(raw))
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(400, 'invalid_json', 'JSON inválido')
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (!['GET', 'PATCH', 'DELETE'].includes(request.method)) {
      return jsonResponse({ error: 'method_not_allowed' }, 405)
    }
    try {
      const { supabase, userId } = requireMontAccess(request)

      if (request.method === 'GET') {
        const params = new URL(request.url).searchParams
        const only = params.get('id')
        const type = params.get('type')
        const category = params.get('category')
        const search = params.get('search')
        const wallet = params.get('wallet_id')
        const from = params.get('from')
        const to = params.get('to')
        const limitText = params.get('limit') || '15'
        if (only !== null && !uuid.safeParse(only).success) {
          throw new ApiError(422, 'invalid_id', 'ID inválido')
        }
        if (type !== null && !['income', 'expense'].includes(type)) {
          throw new ApiError(422, 'invalid_type', 'Tipo inválido')
        }
        if (category !== null && !categories.safeParse(category).success) {
          throw new ApiError(422, 'invalid_category', 'Categoria inválida')
        }
        if (wallet !== null && !uuid.safeParse(wallet).success) {
          throw new ApiError(422, 'invalid_wallet', 'Carteira inválida')
        }
        if ((from !== null && !validDate.safeParse(from).success) ||
            (to !== null && !validDate.safeParse(to).success) ||
            (from !== null && to !== null && from > to)) {
          throw new ApiError(422, 'invalid_dates', 'Datas inválidas')
        }
        if (search !== null && (search.length < 2 || search.length > 80)) {
          throw new ApiError(422, 'invalid_search', 'Busca precisa ter de 2 a 80 caracteres')
        }
        if (!/^\d{1,2}$/.test(limitText) || Number(limitText) < 1 || Number(limitText) > 30) {
          throw new ApiError(422, 'invalid_limit', 'Limite deve ser entre 1 e 30')
        }

        let query = supabase.from('transactions')
          .select(fields)
          .eq('user_id', userId)
          .order('transaction_date', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(Number(limitText))
        if (only) query = query.eq('id', only)
        if (type) query = query.eq('type', type as 'income' | 'expense')
        if (category) query = query.eq('category', category)
        if (wallet) query = query.eq('wallet_id', wallet)
        if (from) query = query.gte('transaction_date', from)
        if (to) query = query.lte('transaction_date', to)
        // Escape wildcard metacharacters so user searches are literal.
        if (search) query = query.ilike('title', `%${search.replace(/[\\%_]/g, '\\$&')}%`)
        const { data, error } = await query
        if (error) {
          console.error('Mont transaction list failed:', error.code)
          throw new ApiError(502, 'upstream_error', 'Não foi possível consultar as transações')
        }
        return jsonResponse({ transactions: data ?? [] })
      }

      const body = await jsonBody(request)
      const parsed = request.method === 'PATCH'
        ? modifySchema.safeParse(body)
        : deleteSchema.safeParse(body)
      if (!parsed.success) throw new ApiError(422, 'invalid_fields', 'Dados da operação inválidos')

      const { id, expected } = parsed.data
      const { data: current, error: readError } = await supabase.from('transactions')
        .select(fields).eq('id', id).eq('user_id', userId).maybeSingle()
      if (readError) throw new ApiError(502, 'upstream_error', 'Falha ao verificar a transação')
      if (!current) throw new ApiError(404, 'not_found', 'Transação não encontrada')

      const unchanged =
        current.title === expected.title &&
        Number(current.amount) === expected.amount &&
        current.type === expected.type &&
        current.category === expected.category &&
        current.transaction_date === expected.transaction_date &&
        current.wallet_id === expected.wallet_id
      if (!unchanged) throw new ApiError(409, 'stale_transaction', 'Transação mudou desde a consulta; revise antes de confirmar')

      if (request.method === 'PATCH') {
        const changes = (parsed.data as z.infer<typeof modifySchema>).changes
        if (changes.wallet_id) {
          const { data: ownedWallet, error: walletError } = await supabase
            .from('wallets').select('id').eq('id', changes.wallet_id)
            .eq('user_id', userId).eq('is_active', true).maybeSingle()
          if (walletError) throw new ApiError(502, 'upstream_error', 'Não foi possível validar a carteira')
          if (!ownedWallet) throw new ApiError(422, 'invalid_wallet', 'Carteira inválida ou inativa')
        }
        let query = supabase.from('transactions')
          .update(changes)
          .eq('id', id).eq('user_id', userId)
        query = guardSnapshot(query, expected)
        const { data: updated, error } = await query.select(fields).maybeSingle()
        if (error) {
          console.error('Mont transaction update failed:', error.code)
          throw new ApiError(502, 'upstream_error', 'Não foi possível atualizar a transação')
        }
        if (!updated) throw new ApiError(409, 'stale_transaction', 'Transação alterada durante a operação; tente novamente')
        return jsonResponse({ updated: true, transaction: updated })
      }

      let query = supabase.from('transactions')
        .delete().eq('id', id).eq('user_id', userId)
      query = guardSnapshot(query, expected)
      const { data: deleted, error } = await query.select('id').maybeSingle()
      if (error) {
        console.error('Mont transaction delete failed:', error.code)
        throw new ApiError(502, 'upstream_error', 'Não foi possível excluir a transação')
      }
      if (!deleted) throw new ApiError(409, 'stale_transaction', 'Transação alterada durante a operação; tente novamente')
      return jsonResponse({ deleted: true, id: deleted.id })
    } catch (error) {
      return errorResponse(error)
    }
  },
}
