import type { WalletSummary } from '../types/wallet.types'

import { WalletSummaryCard } from './wallet-summary-card'

interface WalletSummaryCardsProps {
  summaries: WalletSummary[]
}

export function WalletSummaryCards({
  summaries,
}: WalletSummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {summaries.map((summary) => (
        <WalletSummaryCard
          key={summary.title}
          {...summary}
        />
      ))}
    </section>
  )
}
