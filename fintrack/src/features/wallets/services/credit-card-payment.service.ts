import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type CreditCardPayment = Database['public']['Tables']['credit_card_payments']['Row']
export type CreateCreditCardPayment = Pick<
  Database['public']['Tables']['credit_card_payments']['Insert'],
  'credit_card_id' | 'source_wallet_id' | 'amount' | 'payment_date' | 'notes'
>

export async function listCreditCardPayments(): Promise<CreditCardPayment[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  const { data, error } = await supabase.from('credit_card_payments')
    .select('*').eq('user_id', user.id)
    .order('payment_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createCreditCardPayment(input: CreateCreditCardPayment): Promise<CreditCardPayment> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('Informe um pagamento maior que zero.')
  }
  const { data, error } = await supabase.from('credit_card_payments')
    .insert({ ...input, user_id: user.id }).select('*').single()
  if (error) throw error
  return data
}

export async function deleteCreditCardPayment(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  const { error } = await supabase.from('credit_card_payments')
    .delete().eq('id', id).eq('user_id', user.id)
  if (error) throw error
}
