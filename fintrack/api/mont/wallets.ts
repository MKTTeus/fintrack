import { ApiError, errorResponse, jsonResponse, requireMontAccess } from '../../server/mont'

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'method_not_allowed' }, 405)
    }
    try {
      const { supabase, userId } = requireMontAccess(request)
      const { data, error } = await supabase
        .from('wallets')
        .select('id,name,type,is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Mont wallet lookup failed:', error.code)
        throw new ApiError(502, 'upstream_error', 'Não foi possível consultar as carteiras')
      }
      return jsonResponse({ wallets: data ?? [] })
    } catch (error) {
      return errorResponse(error)
    }
  },
}
