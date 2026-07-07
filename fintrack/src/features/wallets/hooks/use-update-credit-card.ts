import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { updateCreditCard } from '../services/credit-card.service'

import type { UpdateCreditCardInput } from '../types/wallet.types'

export function useUpdateCreditCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: UpdateCreditCardInput
    }) => updateCreditCard(id, input),

    onSuccess: async (creditCard) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.creditCards.list,
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.creditCards.details(creditCard.id),
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.list,
      })
    },
  })
}
