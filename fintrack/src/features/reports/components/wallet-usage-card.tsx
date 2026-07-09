import type { ReportBarItem } from '../types/report.types'

import { ReportBarListCard } from './report-bar-list-card'

interface WalletUsageCardProps {
  items: ReportBarItem[]
  isLoading: boolean
  periodLabel: string
}

export function WalletUsageCard({
  items,
  isLoading,
  periodLabel,
}: WalletUsageCardProps) {
  return (
    <ReportBarListCard
      title="Uso por carteira"
      items={items}
      barClassName="bg-income"
      emptyMessage="Nenhuma movimentação por carteira encontrada."
      isLoading={isLoading}
      periodLabel={periodLabel}
    />
  )
}
