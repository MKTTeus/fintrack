import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { createGoalDeposit } from '../services/goal-deposit.service'

export function useCreateGoalDeposit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGoalDeposit,
    onSuccess: async (deposit) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.goalDeposits.list,
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.goalDeposits.byGoal(deposit.goal_id),
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.goals.list,
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.list,
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary,
      })
    },
  })
}
