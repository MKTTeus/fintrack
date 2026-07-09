import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/providers/auth-context'

import { listGoalDeposits } from '../services/goal-deposit.service'
import { listGoals } from '../services/goal.service'
import {
  getGoalAchievements,
  getGoalSummaries,
  goalToGoalItem,
} from '../utils/goal-formatters'

import { useCreateGoal } from './use-create-goal'
import { useCreateGoalDeposit } from './use-create-goal-deposit'
import { useDeleteGoal } from './use-delete-goal'
import { useDeleteGoalDeposit } from './use-delete-goal-deposit'
import { useUpdateGoal } from './use-update-goal'
import { useUpdateGoalDeposit } from './use-update-goal-deposit'

export function useGoals() {
  const { loading, user } = useAuth()

  const goalsQuery = useQuery({
    queryKey: queryKeys.goals.list,
    queryFn: listGoals,
    enabled: !loading && !!user,
  })

  const depositsQuery = useQuery({
    queryKey: queryKeys.goalDeposits.list,
    queryFn: () => listGoalDeposits(),
    enabled: !loading && !!user,
  })

  const goals = useMemo(
    () =>
      (goalsQuery.data ?? []).map((goal) =>
        goalToGoalItem(goal, depositsQuery.data ?? []),
      ),
    [depositsQuery.data, goalsQuery.data],
  )

  const activeGoals = useMemo(
    () =>
      goals.filter((goal) => goal.status !== 'cancelled'),
    [goals],
  )

  const summaries = useMemo(
    () => getGoalSummaries(activeGoals),
    [activeGoals],
  )

  const achievements = useMemo(
    () =>
      getGoalAchievements(
        activeGoals,
        depositsQuery.data ?? [],
      ),
    [activeGoals, depositsQuery.data],
  )

  return {
    achievements,
    depositsQuery,
    goals: activeGoals,
    goalsQuery,
    isError: goalsQuery.isError || depositsQuery.isError,
    isLoading:
      goalsQuery.isLoading || depositsQuery.isLoading,
    summaries,
    createGoal: useCreateGoal(),
    updateGoal: useUpdateGoal(),
    deleteGoal: useDeleteGoal(),
    createGoalDeposit: useCreateGoalDeposit(),
    updateGoalDeposit: useUpdateGoalDeposit(),
    deleteGoalDeposit: useDeleteGoalDeposit(),
  }
}
