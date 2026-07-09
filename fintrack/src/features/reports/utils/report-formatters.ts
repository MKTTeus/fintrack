export function formatReportCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatReportDate(value: string) {
  const [year, month, day] = value.split('-')

  return `${day}/${month}/${year}`
}

export function formatReportPercent(value: number) {
  return `${Math.round(value)}%`
}
