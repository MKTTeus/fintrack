import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { createCreditWalletWithCard } from '../services/credit-card.service'

export function useCreateCreditWalletWithCard() {
  const cache = useQueryClient()
  return useMutation({
    mutationFn: createCreditWalletWithCard,
    onSuccess: async () => {
      await Promise.all([
        cache.invalidateQueries({ queryKey: queryKeys.wallets.list }),
        cache.invalidateQueries({ queryKey: queryKeys.creditCards.list }),
      ])
    },
  })
}
