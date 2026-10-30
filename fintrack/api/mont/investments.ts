/** Mont API for user-scoped, idempotent CDB/RDB operations. */
import { z } from 'zod'
import { ApiError, errorResponse, jsonResponse, requireMontAccess, transactionId } from '../../server/mont.js'

const uuid = z.uuid()
const requestId = z.string().min(8).max(110).regex(/^[a-zA-Z0-9_-]+$/)
const amount = z.number().finite().positive().max(1_000_000).refine(
  v => Math.abs(v * 100 - Math.round(v * 100)) < 0.000001,
)
const dateSchema = z.iso.date()
const createPosition = z.strictObject({
  action: z.literal('create_position'), name: z.string().trim().min(2).max(100),
  kind: z.enum(['cdb', 'rdb', 'fixed_income_other']),
  institution: z.string().trim().max(100).nullable(),
  notes: z.string().trim().max(500).nullable(), request_id: requestId,
})
const createMovement = z.strictObject({
  action: z.literal('create_movement'), position_id: uuid, wallet_id: uuid,
  kind: z.enum(['application', 'redemption', 'yield']),
  amount, movement_date: dateSchema, notes: z.string().trim().max(200).nullable(),
  request_id: requestId,
})
const setOpeningBalance = z.strictObject({
  action: z.literal('set_opening_balance'), position_id: uuid,
  amount, opening_date: dateSchema, request_id: requestId,
})
const inputSchema = z.discriminatedUnion('action', [createPosition, createMovement, setOpeningBalance])
const positionFields = 'id,name,kind,institution,notes,opening_balance,opening_date,created_at'
const movementFields = 'id,position_id,wallet_id,kind,amount,movement_date,notes,created_at'

export default {
  async fetch(request: Request): Promise<Response> {
    if (!['GET', 'POST'].includes(request.method)) {
      return jsonResponse({ error: 'method_not_allowed' }, 405)
    }
    try {
      const { supabase, userId, sharedSecret } = requireMontAccess(request)
      if (request.method === 'GET') {
        const [positions, movements] = await Promise.all([
          supabase.from('investment_positions').select(positionFields)
            .eq('user_id', userId).order('created_at', { ascending: false }).limit(250),
          supabase.from('investment_movements').select(movementFields)
            .eq('user_id', userId).order('movement_date', { ascending: false }).limit(500),
        ])
        if (positions.error || movements.error) {
          throw new ApiError(502, 'upstream_error', 'Falha ao consultar investimentos')
        }
        return jsonResponse({
          positions: positions.data ?? [], movements: movements.data ?? [],
          movements_limited: (movements.data?.length ?? 0) === 500,
        })
      }

      if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
        throw new ApiError(415, 'unsupported_media_type', 'Envie JSON')
      }
      const raw = await request.text()
      if (raw.length > 5000) throw new ApiError(413, 'body_too_large', 'Solicitação muito grande')
      let body: unknown
      try { body = JSON.parse(raw) } catch { throw new ApiError(400, 'invalid_json', 'JSON inválido') }
      const parsed = inputSchema.safeParse(body)
      if (!parsed.success) throw new ApiError(422, 'invalid_fields', 'Dados do investimento inválidos')
      const input = parsed.data
      const id = transactionId(userId, 'investment_' + input.request_id, sharedSecret)

      if (input.action === 'set_opening_balance') {
        const { data: position, error: lookupError } = await supabase.from('investment_positions')
          .select('id,kind,opening_balance,opening_date').eq('id', input.position_id)
          .eq('user_id', userId).maybeSingle()
        if (lookupError || !position) throw new ApiError(422, 'invalid_position', 'Investimento inexistente')
        if (input.opening_date > new Date().toISOString().slice(0, 10)) {
          throw new ApiError(422, 'invalid_date', 'Data do saldo inicial não pode ser futura')
        }
        if (position.opening_date !== null || Number(position.opening_balance) !== 0) {
          if (position.opening_date === input.opening_date && Number(position.opening_balance) === input.amount) {
            return jsonResponse({ created: false, position })
          }
          throw new ApiError(409, 'opening_already_set', 'Esse investimento já possui saldo inicial')
        }
        const { data: earlier, error: movementError } = await supabase.from('investment_movements')
          .select('id').eq('position_id', input.position_id).eq('user_id', userId)
          .lte('movement_date', input.opening_date).limit(1)
        if (movementError) throw new ApiError(502, 'upstream_error', 'Não consegui verificar o histórico do investimento')
        if (earlier?.length) {
          throw new ApiError(409, 'opening_date_overlap', 'Existem movimentações anteriores à data do saldo inicial')
        }
        const { data: updated, error } = await supabase.from('investment_positions')
          .update({ opening_balance: input.amount, opening_date: input.opening_date })
          .eq('id', input.position_id).eq('user_id', userId)
          .eq('opening_balance', 0).is('opening_date', null)
          .select(positionFields).maybeSingle()
        if (error || !updated) throw new ApiError(409, 'opening_conflict', 'Saldo inicial alterado; consulte novamente')
        return jsonResponse({ created: true, position: updated })
      }

      if (input.action === 'create_position') {
        const { data, error } = await supabase.from('investment_positions').insert({
          id, user_id: userId, name: input.name, kind: input.kind,
          institution: input.institution, notes: input.notes,
        }).select(positionFields).single()
        if (!error && data) return jsonResponse({ created: true, position: data }, 201)
        if (error?.code !== '23505') throw new ApiError(502, 'upstream_error', 'Não foi possível criar investimento')
        const { data: existing, error: lookupError } = await supabase.from('investment_positions')
          .select(positionFields).eq('id', id).eq('user_id', userId).maybeSingle()
        if (lookupError || !existing) throw new ApiError(409, 'conflict', 'Investimento já registrado')
        if (existing.name !== input.name || existing.kind !== input.kind ||
            existing.institution !== input.institution || existing.notes !== input.notes) {
          throw new ApiError(409, 'idempotency_conflict', 'Solicitação repetida com dados diferentes')
        }
        return jsonResponse({ created: false, position: existing })
      }

      const [{ data: position, error: positionError }, { data: wallet, error: walletError }] = await Promise.all([
        supabase.from('investment_positions').select('id').eq('id', input.position_id)
          .eq('user_id', userId).maybeSingle(),
        supabase.from('wallets').select('id,type,is_active').eq('id', input.wallet_id)
          .eq('user_id', userId).maybeSingle(),
      ])
      if (positionError || !position) throw new ApiError(422, 'invalid_position', 'Investimento inexistente')
      if (walletError || !wallet || !wallet.is_active || wallet.type === 'credit_card') {
        throw new ApiError(422, 'invalid_wallet', 'Escolha uma carteira ativa que não seja cartão de crédito')
      }
      // Check deterministic identity before insert: an existing redemption must
      // be returned without re-running the database's balance validation.
      const { data: processed, error: processedError } = await supabase.from('investment_movements')
        .select(movementFields).eq('id', id).eq('user_id', userId).maybeSingle()
      if (processedError) throw new ApiError(502, 'upstream_error', 'Não consegui verificar duplicidades')
      if (processed) {
        if (processed.position_id !== input.position_id || processed.wallet_id !== input.wallet_id ||
            processed.kind !== input.kind || Number(processed.amount) !== input.amount ||
            processed.movement_date !== input.movement_date || processed.notes !== input.notes) {
          throw new ApiError(409, 'idempotency_conflict', 'Solicitação repetida com dados diferentes')
        }
        return jsonResponse({ created: false, movement: processed })
      }
      const { data, error } = await supabase.from('investment_movements').insert({
        id, user_id: userId, position_id: input.position_id, wallet_id: input.wallet_id,
        kind: input.kind, amount: Math.round(input.amount * 100) / 100,
        movement_date: input.movement_date, notes: input.notes,
      }).select(movementFields).single()
      if (!error && data) return jsonResponse({ created: true, movement: data }, 201)
      if (error?.code !== '23505') {
        if (error?.code === 'P0001' || error?.code === '23514') {
          throw new ApiError(422, 'invalid_balance', 'Saldo insuficiente ou operação inválida; revise o histórico do investimento')
        }
        throw new ApiError(502, 'upstream_error', 'Não foi possível registrar a operação')
      }
      const { data: existing, error: lookupError } = await supabase.from('investment_movements')
        .select(movementFields).eq('id', id).eq('user_id', userId).maybeSingle()
      if (lookupError || !existing) throw new ApiError(409, 'conflict', 'Operação já registrada')
      if (existing.position_id !== input.position_id || existing.wallet_id !== input.wallet_id ||
          existing.kind !== input.kind || Number(existing.amount) !== input.amount ||
          existing.movement_date !== input.movement_date || existing.notes !== input.notes) {
        throw new ApiError(409, 'idempotency_conflict', 'Solicitação repetida com dados diferentes')
      }
      return jsonResponse({ created: false, movement: existing })
    } catch (error) {
      return errorResponse(error)
    }
  },
}
