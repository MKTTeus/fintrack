import { checkCategory } from '../../server/categories.js'
import { z } from 'zod'

import { ApiError, errorResponse, jsonResponse, requireMontAccess, transactionId } from '../../server/mont.js'

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}, 'Data inválida')

const createTransactionSchema = z.strictObject({
  title: z.string().trim().min(3).max(120),
  amount: z.number().finite().positive().max(1000000).refine(
    (value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
    'Valor deve ter no máximo duas casas decimais',
  ),
  type: z.enum(['expense', 'income']),
  category: z.string().trim().min(2).max(50),
  transaction_date: dateSchema,
  wallet_id: z.uuid(),
  request_id: z.string().min(8).max(128).regex(/^[a-zA-Z0-9_-]+$/),
})

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'method_not_allowed' }, 405)
    }

    try {
      const { supabase, userId, sharedSecret } = requireMontAccess(request)
      if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
        throw new ApiError(415, 'unsupported_media_type', 'Envie JSON')
      }
      const raw = await request.text()
      if (raw.length > 12000) {
        throw new ApiError(413, 'body_too_large', 'Corpo da requisição muito grande')
      }
      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        throw new ApiError(400, 'invalid_json', 'JSON inválido')
      }
      const validated = createTransactionSchema.safeParse(parsed)
      if (!validated.success) {
        throw new ApiError(422, 'invalid_fields', 'Campos inválidos: confira título, valor, categoria, data e carteira')
      }
      const input = validated.data
      input.category = await checkCategory(supabase, userId, input.category)

      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('id')
        .eq('id', input.wallet_id)
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle()
      if (walletError) {
        console.error('Mont wallet validation failed:', walletError.code)
        throw new ApiError(502, 'upstream_error', 'Não foi possível validar a carteira')
      }
      if (!wallet) {
        throw new ApiError(422, 'invalid_wallet', 'Carteira inexistente, inativa ou não pertence ao usuário')
      }

      const id = transactionId(userId, input.request_id, sharedSecret)
      const insert = {
        id,
        user_id: userId,
        wallet_id: input.wallet_id,
        title: input.title,
        amount: Math.round(input.amount * 100) / 100,
        type: input.type,
        category: input.category,
        transaction_date: input.transaction_date,
      }
      const { data, error } = await supabase
        .from('transactions')
        .insert(insert)
        .select('id,title,amount,type,category,transaction_date,wallet_id')
        .single()

      if (!error && data) {
        return jsonResponse({ created: true, transaction: data }, 201)
      }
      if (error?.code !== '23505') {
        console.error('Mont transaction insert failed:', error?.code || 'unknown')
        throw new ApiError(502, 'upstream_error', 'Não foi possível registrar a transação')
      }

      // A retry with the same request ID must not create a second transaction.
      const { data: existing, error: lookupError } = await supabase
        .from('transactions')
        .select('id,title,amount,type,category,transaction_date,wallet_id')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle()
      if (lookupError || !existing) {
        throw new ApiError(409, 'conflict', 'Conflito ao verificar solicitação repetida')
      }
      const same =
        existing.title === insert.title &&
        Number(existing.amount) === insert.amount &&
        existing.type === insert.type &&
        existing.category === insert.category &&
        existing.transaction_date === insert.transaction_date &&
        existing.wallet_id === insert.wallet_id
      if (!same) {
        throw new ApiError(409, 'idempotency_conflict', 'Identificador reutilizado com dados diferentes')
      }
      return jsonResponse({ created: false, transaction: existing }, 200)
    } catch (error) {
      return errorResponse(error)
    }
  },
}
