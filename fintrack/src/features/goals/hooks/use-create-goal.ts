import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { createGoal } from '../services/goal.service'

export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGoal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.goals.list,
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
