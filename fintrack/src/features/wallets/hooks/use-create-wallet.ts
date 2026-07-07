import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { createWallet } from '../services/wallet.service'

export function useCreateWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWallet,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.list,
      })
    },
  })
}
