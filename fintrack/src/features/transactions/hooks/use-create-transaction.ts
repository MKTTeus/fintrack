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
},

})
}
