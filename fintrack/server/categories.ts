import { ApiError, requireMontAccess } from './mont.js'
type MontSupabase = ReturnType<typeof requireMontAccess>['supabase']

export const DEFAULT_CATEGORIES = [
  'Salário', 'Freelance', 'Investimentos', 'Alimentação', 'Transporte',
  'Saúde', 'Lazer', 'Compras', 'Moradia', 'Contas e Serviços',
  'Educação', 'Viagens', 'Presentes', 'Doações', 'Outros',
] as const

export function cleanCategoryName(value: unknown): string {
  if (typeof value !== 'string') {
    throw new ApiError(422, 'invalid_category', 'Nome de categoria inválido')
  }
  const name = value.trim().replace(/\s+/g, ' ')
  if (name.length < 2 || name.length > 50 || Array.from(name).some((c) => c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127)) {
    throw new ApiError(422, 'invalid_category', 'A categoria deve ter de 2 a 50 caracteres')
  }
  return name
}

export async function allowedCategories(supabase: MontSupabase, userId: string): Promise<string[]> {
  const { data, error } = await supabase.from('transaction_categories')
    .select('name').eq('user_id', userId).order('name')
  if (error) throw new ApiError(502, 'categories_unavailable', 'Não foi possível consultar categorias personalizadas')
  return [...DEFAULT_CATEGORIES, ...(data || []).map((row: { name: string }) => row.name)]
}

export async function checkCategory(supabase: MontSupabase, userId: string, value: unknown): Promise<string> {
  const name = cleanCategoryName(value)
  const categories = await allowedCategories(supabase, userId)
  const found = categories.find((item) => item.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))
  if (!found) throw new ApiError(422, 'unknown_category', 'Categoria não cadastrada; crie-a primeiro em Configurações ou com o Mont')
  return found
}

export function isDefaultCategory(name: string): boolean {
  return DEFAULT_CATEGORIES.some((item) => item.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))
}
