export type TransactionType = "income" | "expense"

export interface Transaction {
  id: string
  title: string
  amount: number
  category: string
  type: TransactionType
  date: string
}