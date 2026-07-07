import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { deleteWallet } from '../services/wallet.service'

export function useDeleteWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteWallet(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.list,
      })
    },
  })
}
