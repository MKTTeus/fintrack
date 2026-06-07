import { useQuery } from '@tanstack/react-query'

import { getDashboardMetrics } from '@/services/dashboard/dashboard-service'

import type { Metric } from '@/types/dashboard'

export function useDashboardMetrics() {
  return useQuery<Metric[]>({
    queryKey: ['dashboard-metrics'],

    queryFn: getDashboardMetrics,
  })
}