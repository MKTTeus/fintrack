import { ApiError, errorResponse, jsonResponse, requireMontAccess } from '../../server/mont.js'

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'method_not_allowed' }, 405)
    }
    try {
      const { supabase, userId } = requireMontAccess(request)
      let result
      try {
        result = await supabase
          .from('wallets')
          .select('id,name,type,is_active')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('created_at', { ascending: true })
      } catch (failure) {
        // Do not print error messages, URLs, authorization headers or keys.
        console.error(
          'Mont wallet lookup failed before receiving Supabase response:',
          failure instanceof Error ? failure.name : 'unknown',
        )
        throw new ApiError(
          502,
          'supabase_connection_failed',
          'A função do FinTrack não conseguiu se comunicar com o Supabase. Confira a URL e a disponibilidade do banco.',
        )
      }

      if (result.error) {
        console.error('Mont wallet lookup failed:', result.error.code)
        throw new ApiError(
          502,
          'supabase_query_failed',
          'O Supabase recusou a consulta das carteiras. Confira o projeto, a chave secreta e a tabela wallets.',
        )
      }
      return jsonResponse({ wallets: result.data ?? [] })
    } catch (error) {
      return errorResponse(error)
    }
  },
}
