import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { createCreditCard } from '../services/credit-card.service'

export function useCreateCreditCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCreditCard,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.creditCards.list,
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.list,
      })
    },
  })
}
