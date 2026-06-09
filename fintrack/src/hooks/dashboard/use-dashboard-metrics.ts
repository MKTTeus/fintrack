import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { getDashboardMetrics } from '@/services/dashboard/dashboard-service'

import type { Metric } from '@/types/dashboard'

export function useDashboardMetrics() {
  return useQuery<Metric[]>({
    queryKey: queryKeys.dashboard.metrics,

    queryFn: getDashboardMetrics,
  })
}
