import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/providers/auth-context'

import { getGoal } from '../services/goal.service'

export function useGoal(id: string | null) {
  const { loading, user } = useAuth()

  return useQuery({
    queryKey: id
      ? queryKeys.goals.details(id)
      : queryKeys.goals.details(''),
    queryFn: () => getGoal(id ?? ''),
    enabled: !loading && !!user && !!id,
  })
}
