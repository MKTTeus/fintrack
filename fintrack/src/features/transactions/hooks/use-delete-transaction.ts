import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { deleteTransaction } from '../services/transaction.service'

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),

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
