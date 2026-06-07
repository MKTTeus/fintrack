import { useQuery } from '@tanstack/react-query'

import { getExpensesChartData } from '@/services/dashboard/dashboard-service'

import type { ExpenseChartData } from '@/types/dashboard'

export function useExpensesChart() {
  return useQuery<ExpenseChartData[]>({
    queryKey: ['expenses-chart'],

    queryFn: getExpensesChartData,
  })
}