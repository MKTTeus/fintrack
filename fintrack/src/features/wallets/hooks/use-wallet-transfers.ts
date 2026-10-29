import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/providers/auth-context'
import {
  createWalletTransfer, deleteWalletTransfer, listWalletTransfers,
} from '../services/wallet-transfer.service'

function invalidateLedger(client: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    client.invalidateQueries({ queryKey: queryKeys.walletTransfers.list }),
    client.invalidateQueries({ queryKey: queryKeys.wallets.list }),
    client.invalidateQueries({ queryKey: queryKeys.dashboard.summary }),
    client.invalidateQueries({ queryKey: queryKeys.dashboard.metrics }),
    client.invalidateQueries({ queryKey: queryKeys.dashboard.balanceChart }),
  ])
}
export function useWalletTransfers() {
  const { loading, user } = useAuth()
  const client = useQueryClient()
  const query = useQuery({
    queryKey: queryKeys.walletTransfers.list,
    queryFn: listWalletTransfers,
    enabled: !loading && !!user,
  })
  const create = useMutation({
    mutationFn: createWalletTransfer,
    onSuccess: async () => { await invalidateLedger(client) },
  })
  const remove = useMutation({
    mutationFn: deleteWalletTransfer,
    onSuccess: async () => { await invalidateLedger(client) },
  })
  return { query, transfers: query.data ?? [], create, remove }
}
