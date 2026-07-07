import type { Database } from '@/types/database.types'

export type Transaction =
  Database['public']['Tables']['transactions']['Row']

export type TransactionType = Transaction['type']

export type CreateTransactionInput = Pick<
  Database['public']['Tables']['transactions']['Insert'],
  | 'title'
  | 'amount'
  | 'type'
  | 'category'
  | 'transaction_date'
  | 'wallet_id'
>

export type UpdateTransactionInput = Partial<
  Omit<CreateTransactionInput, never>
>

export type DeleteTransactionInput = {
  id: string
}
