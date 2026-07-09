import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/providers/auth-context'

import { listGoalDeposits } from '../services/goal-deposit.service'

export function useGoalDeposits(goalId?: string) {
  const { loading, user } = useAuth()

  return useQuery({
    queryKey: goalId
      ? queryKeys.goalDeposits.byGoal(goalId)
      : queryKeys.goalDeposits.list,
    queryFn: () => listGoalDeposits(goalId),
    enabled: !loading && !!user,
  })
}
