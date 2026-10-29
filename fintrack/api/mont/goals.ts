import { z } from 'zod'
import { ApiError, errorResponse, jsonResponse, requireMontAccess, transactionId } from '../../server/mont.js'

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const d = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
})
const amount = z.number().finite().positive().max(1_000_000).refine(
  (value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
)
const requestId = z.string().min(8).max(128).regex(/^[a-zA-Z0-9_-]+$/)
const create = z.strictObject({
  action: z.literal('create'),
  title: z.string().trim().min(3).max(120),
  target_amount: amount,
  target_date: date.nullable().optional(),
  monthly_target: amount.nullable().optional(),
  description: z.string().trim().max(500).nullable().optional(),
  wallet_id: z.uuid().nullable().optional(),
  request_id: requestId,
})
const deposit = z.strictObject({
  action: z.literal('deposit'),
  goal_id: z.uuid(),
  amount,
  deposit_date: date,
  notes: z.string().trim().max(250).nullable().optional(),
  wallet_id: z.uuid().nullable().optional(),
  request_id: requestId,
})
const write = z.discriminatedUnion('action', [create, deposit])

function cents(value: unknown): number {
  const c = Math.round(Number(value) * 100)
  if (!Number.isSafeInteger(c) || c < 0) throw new ApiError(502, 'invalid_amount', 'Valor inconsistente nos aportes')
  return c
}

async function verifyWallet(supabase: ReturnType<typeof requireMontAccess>['supabase'], userId: string, walletId: string | null | undefined) {
  if (!walletId) return
  const { data, error } = await supabase.from('wallets')
    .select('id').eq('id', walletId).eq('user_id', userId).eq('is_active', true).maybeSingle()
  if (error) throw new ApiError(502, 'upstream_error', 'Não foi possível validar a carteira')
  if (!data) throw new ApiError(422, 'invalid_wallet', 'Carteira inexistente ou inativa')
}

async function bodyJson(request: Request): Promise<unknown> {
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
    throw new ApiError(415, 'unsupported_media_type', 'Envie JSON')
  }
  const raw = await request.text()
  if (raw.length > 12_000) throw new ApiError(413, 'body_too_large', 'Requisição muito grande')
  try { return JSON.parse(raw) } catch { throw new ApiError(400, 'invalid_json', 'JSON inválido') }
}

const goalFields = 'id,title,description,target_amount,target_date,monthly_target,wallet_id,status,created_at'
const depositFields = 'id,goal_id,wallet_id,amount,deposit_date,notes'
const limitPages = 100
const pageSize = 500

export default {
  async fetch(request: Request): Promise<Response> {
    if (!['GET', 'POST'].includes(request.method)) return jsonResponse({ error: 'method_not_allowed' }, 405)
    try {
      const { supabase, userId, sharedSecret } = requireMontAccess(request)

      if (request.method === 'GET') {
        const params = new URL(request.url).searchParams
        const id = params.get('goal_id')
        if (id && !z.uuid().safeParse(id).success) throw new ApiError(422, 'invalid_goal', 'ID de meta inválido')

        const goals = []
        let completed = false
        for (let page = 0; page < limitPages; page++) {
          let query = supabase.from('goals').select(goalFields).eq('user_id', userId)
            .neq('status', 'cancelled').order('created_at', { ascending: true })
            .range(page * pageSize, (page + 1) * pageSize - 1)
          if (id) query = query.eq('id', id)
          const { data, error } = await query
          if (error) {
            console.error('Mont goal list failed:', error.code)
            throw new ApiError(502, 'upstream_error', 'Não foi possível consultar as metas')
          }
          goals.push(...(data ?? []))
          if ((data ?? []).length < pageSize) { completed = true; break }
        }
        if (!completed) throw new ApiError(413, 'too_many_goals', 'Há metas demais para a consulta')

        const deposits = new Map<string, { cents: number; count: number }>()
        completed = false
        for (let page = 0; page < limitPages; page++) {
          let query = supabase.from('goal_deposits').select('id,goal_id,amount')
            .eq('user_id', userId).order('id', { ascending: true })
            .range(page * pageSize, (page + 1) * pageSize - 1)
          if (id) query = query.eq('goal_id', id)
          const { data, error } = await query
          if (error) {
            console.error('Mont goal deposit summary failed:', error.code)
            throw new ApiError(502, 'upstream_error', 'Não foi possível consultar os aportes')
          }
          for (const d of data ?? []) {
            const row = deposits.get(d.goal_id) || { cents: 0, count: 0 }
            row.cents += cents(d.amount)
            row.count++
            deposits.set(d.goal_id, row)
          }
          if ((data ?? []).length < pageSize) { completed = true; break }
        }
        if (!completed) throw new ApiError(413, 'too_many_deposits', 'Há aportes demais para a consulta')

        return jsonResponse({ goals: goals.map((goal) => {
          const progress = deposits.get(goal.id) || { cents: 0, count: 0 }
          const target = cents(goal.target_amount)
          return {
            ...goal,
            contributed_amount: progress.cents / 100,
            remaining_amount: Math.max(0, target - progress.cents) / 100,
            progress_percent: target > 0 ? Math.round(progress.cents / target * 10_000) / 100 : 0,
            deposit_count: progress.count,
          }
        }) })
      }

      const validated = write.safeParse(await bodyJson(request))
      if (!validated.success) throw new ApiError(422, 'invalid_fields', 'Dados inválidos para meta ou aporte')
      const input = validated.data
      const id = transactionId(userId, `mont_goal_${input.action}_${input.request_id}`, sharedSecret)
      if (input.action === 'create') {
        await verifyWallet(supabase, userId, input.wallet_id)
        const row = {
          id, user_id: userId,
          title: input.title, target_amount: input.target_amount,
          target_date: input.target_date ?? null,
          monthly_target: input.monthly_target ?? null,
          description: input.description ?? null,
          wallet_id: input.wallet_id ?? null,
          icon: 'target', color: 'blue', status: 'active' as const,
        }
        const { data, error } = await supabase.from('goals').insert(row)
          .select(goalFields).single()
        if (!error && data) return jsonResponse({ created: true, goal: data }, 201)
        if (error?.code !== '23505') {
          console.error('Mont goal creation failed:', error?.code)
          throw new ApiError(502, 'upstream_error', 'Não foi possível criar a meta')
        }
        const existing = await supabase.from('goals').select(goalFields)
          .eq('id', id).eq('user_id', userId).maybeSingle()
        if (existing.error || !existing.data) throw new ApiError(409, 'conflict', 'Conflito ao conferir meta repetida')
        const g = existing.data
        if (g.title !== row.title || Number(g.target_amount) !== row.target_amount ||
          g.target_date !== row.target_date || g.monthly_target !== row.monthly_target ||
          g.description !== row.description || g.wallet_id !== row.wallet_id) {
          throw new ApiError(409, 'idempotency_conflict', 'Solicitação repetida com dados diferentes')
        }
        return jsonResponse({ created: false, goal: g })
      }

      const { data: goal, error: goalError } = await supabase.from('goals')
        .select('id,status').eq('id', input.goal_id).eq('user_id', userId).maybeSingle()
      if (goalError) throw new ApiError(502, 'upstream_error', 'Falha ao validar a meta')
      if (!goal || goal.status !== 'active') throw new ApiError(422, 'inactive_goal', 'Meta não encontrada ou não está ativa')
      await verifyWallet(supabase, userId, input.wallet_id)
      const row = {
        id, user_id: userId, goal_id: input.goal_id,
        amount: input.amount, deposit_date: input.deposit_date,
        notes: input.notes ?? null, wallet_id: input.wallet_id ?? null,
      }
      const { data, error } = await supabase.from('goal_deposits').insert(row)
        .select(depositFields).single()
      if (!error && data) return jsonResponse({ created: true, deposit: data }, 201)
      if (error?.code !== '23505') {
        console.error('Mont goal deposit failed:', error?.code)
        throw new ApiError(502, 'upstream_error', 'Não foi possível registrar o aporte')
      }
      const existing = await supabase.from('goal_deposits').select(depositFields)
        .eq('id', id).eq('user_id', userId).maybeSingle()
      if (existing.error || !existing.data) throw new ApiError(409, 'conflict', 'Conflito ao conferir aporte repetido')
      const d = existing.data
      if (d.goal_id !== row.goal_id || Number(d.amount) !== row.amount ||
        d.deposit_date !== row.deposit_date || d.notes !== row.notes || d.wallet_id !== row.wallet_id) {
        throw new ApiError(409, 'idempotency_conflict', 'Solicitação repetida com dados diferentes')
      }
      return jsonResponse({ created: false, deposit: d })
    } catch (error) {
      return errorResponse(error)
    }
  },
}
