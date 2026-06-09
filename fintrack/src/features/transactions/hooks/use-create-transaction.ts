import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { createTransaction } from '../services/transaction.service'

export function useCreateTransaction() {
const queryClient = useQueryClient()

return useMutation({
mutationFn: createTransaction,

onSuccess: async () => {
  await queryClient.invalidateQueries({
    queryKey: queryKeys.transactions.list,
  })

  // Invalidate dashboard queries to reflect new transaction
  await queryClient.invalidateQueries({
    queryKey: queryKeys.dashboard.summary,
  })

  await queryClient.invalidateQueries({
    queryKey: queryKeys.dashboard.recentTransactions,
  })

  // Invalidate chart queries for dynamic data updates
  await queryClient.invalidateQueries({
    queryKey: queryKeys.dashboard.expensesChart,
  })

  await queryClient.invalidateQueries({
    queryKey: queryKeys.dashboard.balanceChart,
  })
},

})
}
