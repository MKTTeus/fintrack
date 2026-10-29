import { z } from 'zod'
import { ApiError, errorResponse, jsonResponse, requireMontAccess } from '../../server/mont.js'

const confirmSchema = z.strictObject({
  snapshot_hash: z.string().regex(/^[a-f0-9]{32}$/),
})

export default {
  async fetch(request: Request): Promise<Response> {
    if (!['GET', 'POST'].includes(request.method)) {
      return jsonResponse({ error: 'method_not_allowed' }, 405)
    }
    try {
      const { supabase, userId } = requireMontAccess(request)
      if (request.method === 'GET') {
        const { data, error } = await supabase.rpc('mont_preview_transaction_reset', {
          p_user_id: userId,
        })
        if (error || !data) {
          throw new ApiError(502, 'preview_unavailable', 'Não foi possível conferir as transações antes da exclusão')
        }
        return jsonResponse({ preview: data })
      }

      if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
        throw new ApiError(415, 'unsupported_media_type', 'Envie JSON')
      }
      const raw = await request.text()
      if (raw.length > 1000) throw new ApiError(413, 'body_too_large', 'Requisição grande demais')
      let parsed: unknown
      try { parsed = JSON.parse(raw) } catch {
        throw new ApiError(400, 'invalid_json', 'JSON inválido')
      }
      const verified = confirmSchema.safeParse(parsed)
      if (!verified.success) throw new ApiError(422, 'invalid_fields', 'Confirmação da exclusão inválida')

      // A single SQL transaction archives ALL rows and deletes them atomically.
      // If any rows changed since the preview, nothing is deleted.
      const { data, error } = await supabase.rpc('mont_execute_transaction_reset', {
        p_user_id: userId,
        p_expected_hash: verified.data.snapshot_hash,
      })
      if (error) {
        if (error.code === 'P0001') {
          throw new ApiError(409, 'snapshot_changed', 'As transações mudaram desde a revisão. Faça uma nova conferência antes de excluir.')
        }
        console.error('Mont transaction reset failed:', error.code)
        throw new ApiError(502, 'reset_failed', 'Não foi possível concluir a exclusão; o banco manteve os dados')
      }
      if (!data || typeof data.deleted !== 'number') {
        throw new ApiError(502, 'invalid_response', 'Resultado inesperado da exclusão; confira no FinTrack')
      }
      return jsonResponse({ deleted: data.deleted, backup_id: data.backup_id })
    } catch (error) {
      return errorResponse(error)
    }
  },
}
