import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/providers/auth-context'
import {
  createCreditCardPayment, deleteCreditCardPayment, listCreditCardPayments,
} from '../services/credit-card-payment.service'

async function invalidateLedger(client: ReturnType<typeof useQueryClient>) {
  await Promise.all([
    client.invalidateQueries({ queryKey: queryKeys.creditCardPayments.list }),
    client.invalidateQueries({ queryKey: queryKeys.wallets.list }),
    client.invalidateQueries({ queryKey: queryKeys.dashboard.summary }),
    client.invalidateQueries({ queryKey: queryKeys.dashboard.metrics }),
    client.invalidateQueries({ queryKey: queryKeys.dashboard.balanceChart }),
  ])
}
export function useCreditCardPayments() {
  const { loading, user } = useAuth()
  const client = useQueryClient()
  const query = useQuery({
    queryKey: queryKeys.creditCardPayments.list,
    queryFn: listCreditCardPayments,
    enabled: !loading && !!user,
  })
  const create = useMutation({
    mutationFn: createCreditCardPayment,
    onSuccess: () => invalidateLedger(client),
  })
  const remove = useMutation({
    mutationFn: deleteCreditCardPayment,
    onSuccess: () => invalidateLedger(client),
  })
  return { query, payments: query.data ?? [], create, remove }
}
