import type { LucideIcon } from 'lucide-react'

export type ReportSummaryTone =
  | 'income'
  | 'expense'
  | 'balance'
  | 'saving'

export interface ReportSummary {
  title: string
  value: string
  comparison: string
  icon: LucideIcon
  tone: ReportSummaryTone
}

export interface FinancialEvolutionPoint {
  month: string
  income: number
  expense: number
}

export interface ReportBarItem {
  label: string
  value: string
  percentage: number
}

export type PeriodTransactionType = 'income' | 'expense'

export interface PeriodTransaction {
  id: string
  description: string
  category: string
  wallet: string
  date: string
  value: string
  type: PeriodTransactionType
}

export interface ReportSelectOption {
  label: string
  value: string
}

export interface ReportContentOption {
  id: string
  label: string
}

export interface ReportFilters {
  period: string
  type: string
  walletId: string
  category: string
  customStartDate?: string
  customEndDate?: string
}

export interface ReportFilterOptions {
  categories: ReportSelectOption[]
  wallets: ReportSelectOption[]
}

export interface PeriodSummaryInsight {
  tone: 'income' | 'warning' | 'primary'
  text: string
}

export interface PeriodSummary {
  body: string
  insights: PeriodSummaryInsight[]
}

export interface ReportsData {
  categoryExpenses: ReportBarItem[]
  evolution: FinancialEvolutionPoint[]
  filterOptions: ReportFilterOptions
  hasTransactions: boolean
  periodLabel: string
  periodSummary: PeriodSummary
  summaries: ReportSummary[]
  transactions: PeriodTransaction[]
  walletUsage: ReportBarItem[]
}
