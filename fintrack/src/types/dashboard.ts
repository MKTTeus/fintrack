export interface Metric {
  title: string
  value: string
  change: string
  variant?: 'default' | 'income' | 'expense'
}

export interface Transaction {
  title: string
  category: string
  value: string
  expense: boolean
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