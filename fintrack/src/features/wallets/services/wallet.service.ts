import { supabase } from '@/lib/supabase'

import type {
  CreateWalletInput,
  UpdateWalletInput,
  Wallet,
} from '../types/wallet.types'

export async function listWallets(): Promise<Wallet[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return data || []
}

export async function getWallet(id: string): Promise<Wallet> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function createWallet(
  input: CreateWalletInput,
): Promise<Wallet> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('wallets')
    .insert({
      name: input.name,
      type: input.type,
      description: input.description,
      current_balance: input.current_balance ?? 0,
      color: input.color,
      icon: input.icon,
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

export async function updateWallet(
  id: string,
  input: UpdateWalletInput,
): Promise<Wallet> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('wallets')
    .update({
      ...(input.name !== undefined && {
        name: input.name,
      }),
      ...(input.type !== undefined && {
        type: input.type,
      }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.current_balance !== undefined && {
        current_balance: input.current_balance,
      }),
      ...(input.color !== undefined && {
        color: input.color,
      }),
      ...(input.icon !== undefined && {
        icon: input.icon,
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

export async function deleteWallet(id: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { error } = await supabase
    .from('wallets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw error
  }
}
