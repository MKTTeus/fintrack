import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { updateGoalDeposit } from '../services/goal-deposit.service'
import type { UpdateGoalDepositInput } from '../types/goal.types'

export function useUpdateGoalDeposit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: UpdateGoalDepositInput
    }) => updateGoalDeposit(id, input),
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
    },
  })
}
