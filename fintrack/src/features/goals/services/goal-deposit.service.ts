import { supabase } from '@/lib/supabase'

import type {
  CreateGoalDepositInput,
  GoalDepositRecord,
  UpdateGoalDepositInput,
} from '../types/goal.types'

async function getAuthenticatedUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  return user.id
}

export async function listGoalDeposits(
  goalId?: string,
): Promise<GoalDepositRecord[]> {
  const userId = await getAuthenticatedUserId()

  let query = supabase
    .from('goal_deposits')
    .select('*')
    .eq('user_id', userId)
    .order('deposit_date', { ascending: true })

  if (goalId) {
    query = query.eq('goal_id', goalId)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data || []
}

export async function createGoalDeposit(
  input: CreateGoalDepositInput,
): Promise<GoalDepositRecord> {
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('goal_deposits')
    .insert({
      user_id: userId,
      goal_id: input.goal_id,
      wallet_id: input.wallet_id ?? null,
      amount: input.amount,
      deposit_date: input.deposit_date,
      notes: input.notes ?? null,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateGoalDeposit(
  id: string,
  input: UpdateGoalDepositInput,
): Promise<GoalDepositRecord> {
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('goal_deposits')
    .update({
      ...(input.goal_id !== undefined && {
        goal_id: input.goal_id,
      }),
      ...(input.wallet_id !== undefined && {
        wallet_id: input.wallet_id,
      }),
      ...(input.amount !== undefined && {
        amount: input.amount,
      }),
      ...(input.deposit_date !== undefined && {
        deposit_date: input.deposit_date,
      }),
      ...(input.notes !== undefined && {
        notes: input.notes,
      }),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function deleteGoalDeposit(id: string): Promise<void> {
  const userId = await getAuthenticatedUserId()

  const { error } = await supabase
    .from('goal_deposits')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    throw error
  }
}
