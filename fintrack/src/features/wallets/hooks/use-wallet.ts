import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { getWallet } from '../services/wallet.service'

export function useWallet(id: string) {
  return useQuery({
    queryKey: queryKeys.wallets.details(id),
    queryFn: () => getWallet(id),
    enabled: Boolean(id),
  })
}
