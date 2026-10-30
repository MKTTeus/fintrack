/** Private Mont API for user-scoped FII holdings and idempotent operations. */
import { z } from 'zod'
import { ApiError, errorResponse, jsonResponse, requireMontAccess, transactionId } from '../../server/mont.js'

const uuid = z.uuid()
const requestId = z.string().min(8).max(110).regex(/^[a-zA-Z0-9_-]+$/)
const centAmount = z.number().finite().positive().max(1_000_000)
  .refine(v => Math.abs(v * 100 - Math.round(v * 100)) < 0.000001)
const unitPrice = z.number().finite().positive().max(1_000_000)
  .refine(v => Math.abs(v * 10000 - Math.round(v * 10000)) < 0.00001)
const createMovement = z.strictObject({
  action: z.literal('create_movement'), request_id: requestId,
  position_id: uuid, wallet_id: uuid,
  kind: z.enum(['buy', 'sell', 'dividend']),
  quantity: z.number().int().min(1).max(10_000_000).nullable(),
  unit_price: unitPrice.nullable(),
  fees: z.number().finite().min(0).max(1_000_000).refine(v =>
    Math.abs(v * 100 - Math.round(v * 100)) < 0.000001),
  amount: centAmount,
  movement_date: z.iso.date(),
  notes: z.string().trim().max(200).nullable(),
}).superRefine((value, context) => {
  const trade = value.kind === 'buy' || value.kind === 'sell'
  if (trade !== (value.quantity !== null && value.unit_price !== null)) {
    context.addIssue({ code: 'custom', message: 'Quantidade e preço devem acompanhar somente compra ou venda' })
  }
  if (!trade && value.fees !== 0) {
    context.addIssue({ code: 'custom', message: 'Provento não aceita taxas' })
  }
  if (trade && value.quantity !== null && value.unit_price !== null) {
    const expected = Math.round((value.quantity * value.unit_price + (value.kind === 'buy' ? value.fees : -value.fees)) * 100) / 100
    if (expected <= 0 || Math.abs(expected - value.amount) >= 0.005) {
      context.addIssue({ code: 'custom', message: 'Valor líquido não confere com cotas, preço e taxas' })
    }
  }
})

const positionFields = 'id,ticker,name,opening_quantity,opening_cost,opening_date,market_price,price_updated_at,notes,created_at'
const movementFields = 'id,position_id,wallet_id,kind,quantity,unit_price,fees,amount,movement_date,notes,created_at'

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'POST') return jsonResponse({ error: 'method_not_allowed' }, 405)
    try {
      const { supabase, userId, sharedSecret } = requireMontAccess(request)
      if (request.method === 'GET') {
        const [positions, movements] = await Promise.all([
          supabase.from('fii_positions').select(positionFields).eq('user_id', userId)
            .order('ticker').limit(251),
          supabase.from('fii_movements').select(movementFields).eq('user_id', userId)
            .order('movement_date', { ascending: false }).order('created_at', { ascending: false }).limit(501),
        ])
        if (positions.error || movements.error) {
          throw new ApiError(502, 'upstream_error', 'Não foi possível consultar os FIIs')
        }
        return jsonResponse({
          positions: (positions.data ?? []).slice(0, 250),
          movements: (movements.data ?? []).slice(0, 500),
          positions_limited: (positions.data?.length ?? 0) > 250,
          movements_limited: (movements.data?.length ?? 0) > 500,
        })
      }

      if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
        throw new ApiError(415, 'unsupported_media_type', 'Envie JSON')
      }
      const raw = await request.text()
      if (raw.length > 4096) throw new ApiError(413, 'body_too_large', 'Solicitação muito grande')
      let body: unknown
      try { body = JSON.parse(raw) } catch { throw new ApiError(400, 'invalid_json', 'JSON inválido') }
      const parsed = createMovement.safeParse(body)
      if (!parsed.success) throw new ApiError(422, 'invalid_fields', 'Dados da operação de FII inválidos')
      const input = parsed.data
      const id = transactionId(userId, 'fii_' + input.request_id, sharedSecret)

      // Check a retry BEFORE validating the present position/wallet state, so
      // resubmission after an uncertain HTTP response cannot write twice.
      const { data: previous, error: previousError } = await supabase.from('fii_movements')
        .select(movementFields).eq('id', id).eq('user_id', userId).maybeSingle()
      if (previousError) throw new ApiError(502, 'upstream_error', 'Não foi possível consultar operações anteriores')
      if (previous) {
        if (previous.position_id !== input.position_id || previous.wallet_id !== input.wallet_id ||
            previous.kind !== input.kind || previous.quantity !== input.quantity ||
            (previous.unit_price === null ? null : Number(previous.unit_price)) !== input.unit_price ||
            Number(previous.fees) !== input.fees || Number(previous.amount) !== input.amount ||
            previous.movement_date !== input.movement_date || previous.notes !== input.notes) {
          throw new ApiError(409, 'idempotency_conflict', 'Este identificador já pertence a outra operação')
        }
        return jsonResponse({ created: false, movement: previous })
      }

      const [position, wallet] = await Promise.all([
        supabase.from('fii_positions').select('id').eq('user_id', userId).eq('id', input.position_id).maybeSingle(),
        supabase.from('wallets').select('id,type,is_active').eq('user_id', userId).eq('id', input.wallet_id).maybeSingle(),
      ])
      if (position.error || !position.data) throw new ApiError(422, 'invalid_position', 'FII não encontrado')
      if (wallet.error || !wallet.data || !wallet.data.is_active || wallet.data.type === 'credit_card') {
        throw new ApiError(422, 'invalid_wallet', 'Selecione uma carteira ativa que não seja cartão de crédito')
      }
      const inserted = await supabase.from('fii_movements').insert({
        id, user_id: userId, position_id: input.position_id, wallet_id: input.wallet_id,
        kind: input.kind, quantity: input.quantity, unit_price: input.unit_price,
        fees: input.fees, amount: input.amount, movement_date: input.movement_date, notes: input.notes,
      }).select(movementFields).single()
      if (!inserted.error && inserted.data) return jsonResponse({ created: true, movement: inserted.data }, 201)
      if (inserted.error?.code === '23505') {
        const retry = await supabase.from('fii_movements').select(movementFields)
          .eq('id', id).eq('user_id', userId).maybeSingle()
        if (retry.error || !retry.data) throw new ApiError(409, 'conflict', 'Operação não pôde ser confirmada')
        const m = retry.data
        if (m.position_id !== input.position_id || m.wallet_id !== input.wallet_id || m.kind !== input.kind ||
            m.quantity !== input.quantity || (m.unit_price === null ? null : Number(m.unit_price)) !== input.unit_price ||
            Number(m.fees) !== input.fees || Number(m.amount) !== input.amount ||
            m.movement_date !== input.movement_date || m.notes !== input.notes) {
          throw new ApiError(409, 'idempotency_conflict', 'Este identificador já pertence a outra operação')
        }
        return jsonResponse({ created: false, movement: m })
      }
      if (inserted.error?.code === 'P0001' || inserted.error?.code === '23514' || inserted.error?.code === '23503') {
        throw new ApiError(422, 'invalid_operation', 'Operação inválida, fora de ordem ou cotas insuficientes. Confira o histórico do FII')
      }
      throw new ApiError(502, 'upstream_error', 'Não foi possível registrar a operação do FII')
    } catch (error) {
      return errorResponse(error)
    }
  },
}
