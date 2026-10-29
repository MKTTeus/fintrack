import { supabase } from '@/lib/supabase'

import type {
  CreateCreditCardInput,
  CreditCard,
  UpdateCreditCardInput,
} from '../types/wallet.types'

export async function listCreditCards(): Promise<CreditCard[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return data || []
}

export async function createCreditCard(
  input: CreateCreditCardInput,
): Promise<CreditCard> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('credit_cards')
    .insert({
      wallet_id: input.wallet_id,
      bank_name: input.bank_name,
      card_name: input.card_name,
      last_four_digits: input.last_four_digits,
      credit_limit: input.credit_limit,
      closing_day: input.closing_day,
      due_day: input.due_day,
      user_id: user.id,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateCreditCard(
  id: string,
  input: UpdateCreditCardInput,
): Promise<CreditCard> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('credit_cards')
    .update({
      ...(input.wallet_id !== undefined && {
        wallet_id: input.wallet_id,
      }),
      ...(input.bank_name !== undefined && {
        bank_name: input.bank_name,
      }),
      ...(input.card_name !== undefined && {
        card_name: input.card_name,
      }),
      ...(input.last_four_digits !== undefined && {
        last_four_digits: input.last_four_digits,
      }),
      ...(input.credit_limit !== undefined && {
        credit_limit: input.credit_limit,
      }),
      ...(input.closing_day !== undefined && {
        closing_day: input.closing_day,
      }),
      ...(input.due_day !== undefined && {
        due_day: input.due_day,
      }),
      ...(input.is_active !== undefined && {
        is_active: input.is_active,
      }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/** Creates both records atomically through an invoker-rights database function. */
export async function createCreditWalletWithCard(input: {
  name: string
  description: string | null
  bank_name: string
  card_name: string
  last_four_digits: string | null
  credit_limit: number | null
  closing_day: number | null
  due_day: number | null
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  const { error } = await supabase.rpc('create_credit_wallet_with_card', {
    p_name: input.name, p_description: input.description,
    p_bank_name: input.bank_name, p_card_name: input.card_name,
    p_last_four_digits: input.last_four_digits, p_credit_limit: input.credit_limit,
    p_closing_day: input.closing_day, p_due_day: input.due_day,
  })
  if (error) throw error
}
