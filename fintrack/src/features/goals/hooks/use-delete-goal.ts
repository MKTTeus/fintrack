import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { deleteGoal } from '../services/goal.service'

export function useDeleteGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSuccess: async (goal) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.goals.list,
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.goals.details(goal.id),
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary,
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.metrics,
      })
    },
  })
}
