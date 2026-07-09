import { supabase } from '@/lib/supabase'

import type {
  CreateGoalInput,
  GoalRecord,
  GoalStatus,
  UpdateGoalInput,
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

export async function listGoals(): Promise<GoalRecord[]> {
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return data || []
}

export async function getGoal(id: string): Promise<GoalRecord> {
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function createGoal(
  input: CreateGoalInput,
): Promise<GoalRecord> {
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      wallet_id: input.wallet_id ?? null,
      title: input.title,
      description: input.description ?? null,
      target_amount: input.target_amount,
      target_date: input.target_date ?? null,
      monthly_target: input.monthly_target ?? null,
      icon: input.icon ?? 'target',
      color: input.color ?? 'blue',
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateGoal(
  id: string,
  input: UpdateGoalInput,
): Promise<GoalRecord> {
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('goals')
    .update({
      ...(input.wallet_id !== undefined && {
        wallet_id: input.wallet_id,
      }),
      ...(input.title !== undefined && {
        title: input.title,
      }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.target_amount !== undefined && {
        target_amount: input.target_amount,
      }),
      ...(input.target_date !== undefined && {
        target_date: input.target_date,
      }),
      ...(input.monthly_target !== undefined && {
        monthly_target: input.monthly_target,
      }),
      ...(input.icon !== undefined && {
        icon: input.icon,
      }),
      ...(input.color !== undefined && {
        color: input.color,
      }),
      ...(input.status !== undefined && {
        status: input.status,
      }),
      updated_at: new Date().toISOString(),
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

export async function deleteGoal(id: string): Promise<GoalRecord> {
  return updateGoal(id, {
    status: 'cancelled',
  })
}

export async function updateGoalStatus(
  id: string,
  status: GoalStatus,
): Promise<GoalRecord> {
  return updateGoal(id, { status })
}
