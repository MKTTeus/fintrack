import type { ReportFilters } from '../types/report.types'
import { formatReportCurrency } from '../utils/report-formatters'

const periodFileNameLabels: Record<string, string> = {
  'last-3-months': 'Ultimos_3_meses',
  'last-6-months': 'Ultimos_6_meses',
  'this-year': new Date().getFullYear().toString(),
}

export function formatPdfDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function formatPdfCurrency(value: number) {
  return formatReportCurrency(value)
}

export function formatPdfPeriodForFile(filters: ReportFilters) {
  const now = new Date()

  if (
    filters.period === 'custom' &&
    filters.customStartDate &&
    filters.customEndDate
  ) {
    const start = filters.customStartDate
      .split('-')
      .reverse()
      .join('-')
    const end = filters.customEndDate
      .split('-')
      .reverse()
      .join('-')

    return `${start}_a_${end}`
  }

  if (filters.period === 'this-month') {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
      .format(now)
      .replace(' de ', '_')
  }

  if (filters.period === 'last-month') {
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    )

    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
      .format(lastMonth)
      .replace(' de ', '_')
  }

  return (
    periodFileNameLabels[filters.period] ??
    filters.period.replaceAll('-', '_')
  )
}

export function buildReportPdfFileName(filters: ReportFilters) {
  const period = formatPdfPeriodForFile(filters)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')

  return `Relatorio_FinTrack_${period}.pdf`
}

export function hasPdfSection(
  sections: string[],
  section: string,
) {
  return sections.includes(section)
}
