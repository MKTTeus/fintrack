import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { updateWallet } from '../services/wallet.service'

import type { UpdateWalletInput } from '../types/wallet.types'

export function useUpdateWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: UpdateWalletInput
    }) => updateWallet(id, input),

    onSuccess: async (wallet) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.list,
      })

      await queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.details(wallet.id),
      })
    },
  })
}
