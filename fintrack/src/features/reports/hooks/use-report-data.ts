import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/providers/auth-context'

import {
  getReportsData,
} from '../services/report.service'
import type { ReportFilters } from '../types/report.types'

export function useReportData(filters: ReportFilters) {
  const { loading, user } = useAuth()

  return useQuery({
    queryKey: queryKeys.reports.data(filters),
    queryFn: () => getReportsData(filters),
    enabled: !loading && !!user,
  })
}
