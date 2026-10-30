import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type WalletTransfer = Database['public']['Tables']['wallet_transfers']['Row']
export type CreateWalletTransfer = Pick<
  Database['public']['Tables']['wallet_transfers']['Insert'],
  'source_wallet_id' | 'destination_wallet_id' | 'amount' | 'transfer_date' | 'notes'
>

export async function listWalletTransfers(): Promise<WalletTransfer[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  const results: WalletTransfer[] = []
  const pageSize = 500
  for (let page = 0; page < 200; page++) {
    const { data, error } = await supabase.from('wallet_transfers')
      .select('*').eq('user_id', user.id)
      .order('transfer_date', { ascending: false })
      .order('id', { ascending: true })
      .range(page * pageSize, (page + 1) * pageSize - 1)
    if (error) throw error
    results.push(...(data ?? []))
    if ((data ?? []).length < pageSize) return results
  }
  throw new Error('Limite de transferências alcançado; não foi possível conferir o saldo completo.')
}

export async function createWalletTransfer(input: CreateWalletTransfer): Promise<WalletTransfer> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  if (input.source_wallet_id === input.destination_wallet_id) {
    throw new Error('Origem e destino precisam ser diferentes.')
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('Informe um valor válido maior que zero.')
  }
  const { data, error } = await supabase.from('wallet_transfers')
    .insert({ ...input, user_id: user.id })
    .select('*').single()
  if (error) throw error
  return data
}

export async function deleteWalletTransfer(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  const { error } = await supabase.from('wallet_transfers')
    .delete().eq('id', id).eq('user_id', user.id)
  if (error) throw error
}
