import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { getBalanceChartData } from '@/services/dashboard/dashboard-service'

import type { BalanceChartData } from '@/types/dashboard'

export function useBalanceChart() {
  return useQuery<BalanceChartData[]>({
    queryKey: queryKeys.dashboard.balanceChart,

    queryFn: getBalanceChartData,
  })
}
