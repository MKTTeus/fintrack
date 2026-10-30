import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type InvestmentPosition = Database['public']['Tables']['investment_positions']['Row']
export type InvestmentMovement = Database['public']['Tables']['investment_movements']['Row']
export type NewInvestment = Pick<InvestmentPosition, 'name' | 'kind' | 'institution' | 'notes'>
export type NewMovement = Pick<InvestmentMovement, 'position_id' | 'wallet_id' | 'kind' | 'amount' | 'movement_date' | 'notes'>

async function currentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Sessão expirada. Entre novamente.')
  return user
}
export async function listInvestments(): Promise<InvestmentPosition[]> {
  const user = await currentUser()
  const { data, error } = await supabase.from('investment_positions').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
export async function listInvestmentMovements(): Promise<InvestmentMovement[]> {
  const user = await currentUser()
  const all: InvestmentMovement[] = []
  for (let page = 0; page < 200; page++) {
    const { data, error } = await supabase.from('investment_movements').select('*').eq('user_id', user.id).order('movement_date', { ascending: false }).order('id').range(page * 500, page * 500 + 499)
    if (error) throw error
    all.push(...(data ?? []))
    if ((data ?? []).length < 500) return all
  }
  throw new Error('Histórico de investimentos muito grande para ser carregado com segurança.')
}
export async function createInvestment(input: NewInvestment): Promise<InvestmentPosition> {
  const user = await currentUser()
  const name = input.name.trim()
  if (name.length < 2 || name.length > 100) throw new Error('Informe o nome do investimento (2 a 100 caracteres).')
  const { data, error } = await supabase.from('investment_positions').insert({ ...input, name, user_id: user.id }).select('*').single()
  if (error) throw error
  return data
}
export async function createInvestmentMovement(input: NewMovement): Promise<InvestmentMovement> {
  const user = await currentUser()
  if (!Number.isFinite(input.amount) || input.amount <= 0 || Math.round(input.amount * 100) !== input.amount * 100) throw new Error('Valor inválido: informe reais e centavos.')
  const [{ data: position, error: positionError }, { data: wallet, error: walletError }] = await Promise.all([
    supabase.from('investment_positions').select('id').eq('id', input.position_id).eq('user_id', user.id).maybeSingle(),
    supabase.from('wallets').select('id,type,is_active').eq('id', input.wallet_id).eq('user_id', user.id).maybeSingle(),
  ])
  if (positionError || !position) throw new Error('Investimento não encontrado.')
  if (walletError || !wallet || !wallet.is_active || wallet.type === 'credit_card') throw new Error('Escolha uma carteira ativa que não seja cartão de crédito.')
  const { data, error } = await supabase.from('investment_movements').insert({
    ...input, amount: Math.round(input.amount * 100) / 100, user_id: user.id,
  }).select('*').single()
  if (error) throw new Error(error.message)
  return data
}
export function investmentBalance(id: string, movements: InvestmentMovement[]) {
  return movements.filter(m => m.position_id === id).reduce((sum, m) =>
    sum + (m.kind === 'redemption' ? -Number(m.amount) : Number(m.amount)), 0)
}
