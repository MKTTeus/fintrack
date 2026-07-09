import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { updateGoal } from '../services/goal.service'
import type { UpdateGoalInput } from '../types/goal.types'

export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: UpdateGoalInput
    }) => updateGoal(id, input),
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
