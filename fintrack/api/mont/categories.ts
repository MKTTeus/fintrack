import { z } from 'zod'
import { ApiError, errorResponse, jsonResponse, requireMontAccess } from '../../server/mont.js'
import { allowedCategories, checkCategory, cleanCategoryName, isDefaultCategory, DEFAULT_CATEGORIES } from '../../server/categories.js'

const uuid = z.uuid()
const payloadSchema = z.strictObject({
  name: z.string().trim().min(2).max(50),
})
const editSchema = payloadSchema.extend({ id: uuid })

function assertNewName(name: string, names: string[], original?: string): void {
  if (names.some((existing) =>
    existing.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR') &&
    existing.toLocaleLowerCase('pt-BR') !== original?.toLocaleLowerCase('pt-BR')
  )) {
    throw new ApiError(409, 'duplicate_category', 'Essa categoria já existe')
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(request.method)) {
      return jsonResponse({ error: 'method_not_allowed' }, 405)
    }
    try {
      const { supabase, userId } = requireMontAccess(request)
      if (request.method === 'GET') {
        const { data, error } = await supabase.from('transaction_categories')
          .select('id,name,created_at').eq('user_id', userId).order('name')
        if (error) throw new ApiError(502, 'upstream_error', 'Não foi possível listar categorias')
        return jsonResponse({
          defaults: DEFAULT_CATEGORIES, custom: data ?? [],
          categories: [...DEFAULT_CATEGORIES, ...(data ?? []).map((row) => row.name)],
        })
      }
      if (!(request.headers.get('content-type') || '').startsWith('application/json')) {
        throw new ApiError(415, 'unsupported_media_type', 'Envie JSON')
      }
      const raw = await request.text()
      if (raw.length > 4096) throw new ApiError(413, 'body_too_large', 'Requisição grande demais')
      let input: unknown
      try { input = JSON.parse(raw) } catch { throw new ApiError(400, 'invalid_json', 'JSON inválido') }

      if (request.method === 'POST') {
        const parsed = payloadSchema.safeParse(input)
        if (!parsed.success) throw new ApiError(422, 'invalid_fields', 'Informe o nome da categoria')
        const name = cleanCategoryName(parsed.data.name)
        const categories = await allowedCategories(supabase, userId)
        assertNewName(name, categories)
        const { data, error } = await supabase.from('transaction_categories')
          .insert({ name, user_id: userId }).select('id,name,created_at').single()
        if (error?.code === '23505') throw new ApiError(409, 'duplicate_category', 'Categoria já cadastrada')
        if (error || !data) throw new ApiError(502, 'upstream_error', 'Não foi possível cadastrar a categoria')
        return jsonResponse({ created: true, category: data }, 201)
      }

      const parsed = request.method === 'PATCH' ? editSchema.safeParse(input) : z.strictObject({ id: uuid }).safeParse(input)
      if (!parsed.success) throw new ApiError(422, 'invalid_fields', 'Identificador ou nome inválido')
      const { id } = parsed.data
      const { data: current, error: readError } = await supabase.from('transaction_categories')
        .select('id,name').eq('id', id).eq('user_id', userId).maybeSingle()
      if (readError) throw new ApiError(502, 'upstream_error', 'Não foi possível verificar a categoria')
      if (!current) throw new ApiError(404, 'not_found', 'Categoria não encontrada')

      // Do not change a category currently referenced by transactions; the user
      // can reclassify those transactions explicitly, without silent historical changes.
      const { count, error: countError } = await supabase.from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId).eq('category', current.name)
      if (countError) throw new ApiError(502, 'upstream_error', 'Não foi possível verificar lançamentos vinculados')
      if ((count ?? 0) > 0) throw new ApiError(409, 'category_in_use', 'Esta categoria possui transações. Reclassifique os lançamentos antes de editar ou excluir.')

      if (request.method === 'DELETE') {
        const { error } = await supabase.from('transaction_categories').delete().eq('id', id).eq('user_id', userId)
        if (error) throw new ApiError(502, 'upstream_error', 'Não foi possível excluir a categoria')
        return jsonResponse({ deleted: true, id })
      }

      const name = cleanCategoryName((parsed.data as z.infer<typeof editSchema>).name)
      if (isDefaultCategory(name)) throw new ApiError(409, 'duplicate_category', 'Esse nome já pertence a uma categoria padrão')
      assertNewName(name, await allowedCategories(supabase, userId), current.name)
      const { data, error } = await supabase.from('transaction_categories')
        .update({ name }).eq('id', id).eq('user_id', userId).select('id,name,created_at').single()
      if (error?.code === '23505') throw new ApiError(409, 'duplicate_category', 'Categoria já cadastrada')
      if (error || !data) throw new ApiError(502, 'upstream_error', 'Não foi possível atualizar a categoria')
      return jsonResponse({ updated: true, category: data })
    } catch (error) {
      return errorResponse(error)
    }
  },
}
