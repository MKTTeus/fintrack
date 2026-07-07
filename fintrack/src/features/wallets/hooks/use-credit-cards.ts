import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/providers/auth-context'

import { listCreditCards } from '../services/credit-card.service'

export function useCreditCards() {
  const { loading, user } = useAuth()

  return useQuery({
    queryKey: queryKeys.creditCards.list,
    queryFn: listCreditCards,
    enabled: !loading && !!user,
  })
}
