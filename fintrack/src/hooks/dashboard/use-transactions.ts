import { useQuery } from '@tanstack/react-query'

import { getTransactions } from '@/services/dashboard/dashboard-service'

import type { Transaction } from '@/types/dashboard'

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ['transactions'],

    queryFn: getTransactions,
  })
}