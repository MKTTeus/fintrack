import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { updateTransaction } from '../services/transaction.service'

import type { UpdateTransactionInput } from '../types/transaction.types'

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: UpdateTransactionInput
    }) => updateTransaction(id, input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.list,
      })

      // Invalidate dashboard queries
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary,
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.recentTransactions,
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.expensesChart,
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.balanceChart,
      })
    },
  })
}
