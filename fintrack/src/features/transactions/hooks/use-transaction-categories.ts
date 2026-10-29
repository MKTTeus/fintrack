import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/auth-context'
import { supabase } from '@/lib/supabase'
import { transactionCategories } from '@/features/transactions/constants/transaction-categories'
import { queryKeys } from '@/lib/query-keys'

export type CustomCategory = { id: string; name: string; created_at: string }

async function loadCategories(): Promise<CustomCategory[]> {
  const { data, error } = await supabase.from('transaction_categories')
    .select('id,name,created_at').order('name')
  if (error) throw error
  return data || []
}

function validateName(raw: string): string {
  const name = raw.trim().replace(/\s+/g, ' ')
  if (name.length < 2 || name.length > 50) throw new Error('Use entre 2 e 50 caracteres.')
  return name
}

export function useTransactionCategories() {
  const { loading, user } = useAuth()
  const cache = useQueryClient()
  const query = useQuery({
    queryKey: queryKeys.transactionCategories.list,
    queryFn: loadCategories,
    enabled: !loading && !!user,
  })
  const categories = [...transactionCategories, ...(query.data || []).map((item) => item.name)]
  function assertUnique(name: string, exceptId?: string) {
    const existing = [
      ...transactionCategories,
      ...(query.data || []).filter((item) => item.id !== exceptId).map((item) => item.name),
    ]
    if (existing.some((item) => item.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))) {
      throw new Error('Essa categoria já existe.')
    }
  }
  const create = useMutation({
    mutationFn: async (raw: string) => {
      if (!user) throw new Error('Faça login para cadastrar categorias.')
      const name = validateName(raw)
      assertUnique(name)
      const { error } = await supabase.from('transaction_categories').insert({ user_id: user.id, name })
      if (error) throw error
    },
    onSuccess: () => cache.invalidateQueries({ queryKey: queryKeys.transactionCategories.list }),
  })
  const modify = useMutation({
    mutationFn: async ({ id, name: raw }: { id: string; name: string }) => {
      if (!user) throw new Error('Faça login para editar categorias.')
      const name = validateName(raw)
      assertUnique(name, id)
      const existing = query.data?.find((row) => row.id === id)
      if (!existing) throw new Error('Categoria não encontrada.')
      const { count, error: countError } = await supabase.from('transactions')
        .select('id', { count: 'exact', head: true }).eq('category', existing.name)
      if (countError) throw countError
      if (count) throw new Error('Existem transações nesta categoria. Reclassifique-as antes de editar.')
      const { error } = await supabase.from('transaction_categories')
        .update({ name }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => cache.invalidateQueries({ queryKey: queryKeys.transactionCategories.list }),
  })
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const existing = query.data?.find((row) => row.id === id)
      if (!existing) throw new Error('Categoria não encontrada.')
      const { count, error: countError } = await supabase.from('transactions')
        .select('id', { count: 'exact', head: true }).eq('category', existing.name)
      if (countError) throw countError
      if (count) throw new Error('Existem transações nesta categoria. Reclassifique-as antes de excluir.')
      const { error } = await supabase.from('transaction_categories').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => cache.invalidateQueries({ queryKey: queryKeys.transactionCategories.list }),
  })
  return { query, categories, custom: query.data || [], create, modify, remove }
}
