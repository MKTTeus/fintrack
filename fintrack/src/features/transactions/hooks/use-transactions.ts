import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/providers/auth-context'

import { getTransactions } from '../services/transaction.service'

export function useTransactions() {
const { loading, user } = useAuth()

return useQuery({
queryKey: queryKeys.transactions.list,
queryFn: getTransactions,
enabled: !loading && !!user,
})
}
