import type { ReportSelectOption } from '../types/report.types'

export const periodOptions: ReportSelectOption[] = [
  { label: 'Este mês', value: 'this-month' },
  { label: 'Mês passado', value: 'last-month' },
  { label: 'Últimos 3 meses', value: 'last-3-months' },
  { label: 'Últimos 6 meses', value: 'last-6-months' },
  { label: 'Este ano', value: 'this-year' },
  { label: 'Personalizado', value: 'custom' },
]

export const typeOptions: ReportSelectOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Receitas', value: 'income' },
  { label: 'Despesas', value: 'expense' },
]

export const reportContentOptions = [
  { id: 'financial-summary', label: 'Resumo financeiro' },
  { id: 'financial-evolution', label: 'Evolução financeira' },
  { id: 'category-expenses', label: 'Despesas por categoria' },
  { id: 'wallet-usage', label: 'Uso por carteira' },
  { id: 'period-transactions', label: 'Transações do período' },
]
