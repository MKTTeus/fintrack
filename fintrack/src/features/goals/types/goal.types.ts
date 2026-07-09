import type { LucideIcon } from 'lucide-react'

import type { Database } from '@/types/database.types'

export type GoalRecord =
  Database['public']['Tables']['goals']['Row']

export type GoalDepositRecord =
  Database['public']['Tables']['goal_deposits']['Row']

export type GoalStatus = GoalRecord['status']

export type GoalTone = 'pink' | 'blue' | 'green' | 'purple' | 'amber'

export type GoalSummaryVariant =
  | 'income'
  | 'primary'
  | 'purple'
  | 'warning'

export type CreateGoalInput = Pick<
  Database['public']['Tables']['goals']['Insert'],
  | 'wallet_id'
  | 'title'
  | 'description'
  | 'target_amount'
  | 'target_date'
  | 'monthly_target'
  | 'icon'
  | 'color'
>

export type UpdateGoalInput = Partial<CreateGoalInput> & {
  status?: GoalStatus
}

export type CreateGoalDepositInput = Pick<
  Database['public']['Tables']['goal_deposits']['Insert'],
  'goal_id' | 'wallet_id' | 'amount' | 'deposit_date' | 'notes'
>

export type UpdateGoalDepositInput =
  Partial<CreateGoalDepositInput>

export interface GoalDeposit {
  id: string
  month: string
  amount: number
  date: string
  notes?: string | null
  walletId?: string | null
}

export interface GoalProgressPoint {
  month: string
  amount: number
}

export interface Goal {
  id: string
  walletId: string | null
  title: string
  description: string
  currentAmount: number
  targetAmount: number
  monthlyTarget: number
  targetDate: string | null
  dueLabel: string
  icon: LucideIcon
  iconName: string
  color: string | null
  tone: GoalTone
  status: GoalStatus
  deposits: GoalDeposit[]
  progressHistory: GoalProgressPoint[]
  raw: GoalRecord
}

export interface GoalSummary {
  title: string
  value: string
  fullValue?: string
  detail: string
  icon: LucideIcon
  variant: GoalSummaryVariant
}

export interface GoalAchievement {
  title: string
  value: string
  detail: string
  icon: LucideIcon
  tone: GoalTone
}
