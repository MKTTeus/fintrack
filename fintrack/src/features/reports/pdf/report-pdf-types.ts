import type {
  ReportFilters,
  ReportsData,
} from '../types/report.types'

export type ReportPdfSectionId =
  | 'financial-summary'
  | 'financial-evolution'
  | 'category-expenses'
  | 'wallet-usage'
  | 'period-transactions'

export interface ReportPdfFilters extends ReportFilters {
  categoryLabel: string
  typeLabel: string
  walletLabel: string
}

export interface ReportPdfData {
  generatedAt: Date
  report: ReportsData
  selectedSections: ReportPdfSectionId[]
  filters: ReportPdfFilters
}
