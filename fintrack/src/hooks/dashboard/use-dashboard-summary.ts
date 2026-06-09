import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { getDashboardSummary } from '@/services/dashboard/dashboard-service'

export function useDashboardSummary() {
    return useQuery({
        queryKey: queryKeys.dashboard.summary,
    queryFn: getDashboardSummary,
    })
}
