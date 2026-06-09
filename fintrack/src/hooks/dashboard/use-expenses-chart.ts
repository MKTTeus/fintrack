import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { getExpensesChartData } from '@/services/dashboard/dashboard-service'

import type { ExpenseChartData } from '@/types/dashboard'

export function useExpensesChart() {
  return useQuery<ExpenseChartData[]>({
    queryKey: queryKeys.dashboard.expensesChart,

    queryFn: getExpensesChartData,
  })
}
