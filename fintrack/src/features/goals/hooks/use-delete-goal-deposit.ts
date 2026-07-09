import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { deleteGoalDeposit } from '../services/goal-deposit.service'

export function useDeleteGoalDeposit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteGoalDeposit(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.goalDeposits.list,
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
