export interface Metric {
  title: string
  value: string
  change: string
  variant?: 'default' | 'income' | 'expense'
}

export interface DashboardTransaction {
  id: string
  title: string
  category: string
  amount: number
  type: 'income' | 'expense'
  transaction_date: string
}

export interface ExpenseChartData {
  month: string
  income: number
  expense: number
}

export interface BalanceChartData {
  month: string
  balance: number
}

export interface DashboardSummary {
balance: number
income: number
expenses: number
transactionsCount: number
}

