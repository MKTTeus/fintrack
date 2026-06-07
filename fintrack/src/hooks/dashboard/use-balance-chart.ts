import { useQuery } from '@tanstack/react-query'

import { getBalanceChartData } from '@/services/dashboard/dashboard-service'

import type { BalanceChartData } from '@/types/dashboard'

export function useBalanceChart() {
  return useQuery<BalanceChartData[]>({
    queryKey: ['balance-chart'],

    queryFn: getBalanceChartData,
  })
}