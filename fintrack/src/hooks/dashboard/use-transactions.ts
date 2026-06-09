import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { getTransactions } from '@/features/transactions/services/transaction.service'

import type { DashboardTransaction } from '@/types/dashboard'

export function useTransactions() {
  return useQuery<DashboardTransaction[]>({
    queryKey: queryKeys.dashboard.recentTransactions,

    queryFn: getTransactions,
  })
}
