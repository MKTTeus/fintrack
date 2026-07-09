import type { ReportBarItem } from '../types/report.types'

import { ReportBarListCard } from './report-bar-list-card'

interface CategoryExpensesCardProps {
  items: ReportBarItem[]
  isLoading: boolean
  periodLabel: string
}

export function CategoryExpensesCard({
  items,
  isLoading,
  periodLabel,
}: CategoryExpensesCardProps) {
  return (
    <ReportBarListCard
      title="Despesas por categoria"
      items={items}
      barClassName="bg-expense"
      emptyMessage="Nenhuma despesa encontrada para os filtros selecionados."
      isLoading={isLoading}
      periodLabel={periodLabel}
    />
  )
}
