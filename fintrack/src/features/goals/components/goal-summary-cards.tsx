import type { GoalSummary } from '../types/goal.types'

import { GoalSummaryCard } from './goal-summary-card'

interface GoalSummaryCardsProps {
  summaries: GoalSummary[]
}

export function GoalSummaryCards({
  summaries,
}: GoalSummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {summaries.map((summary) => (
        <GoalSummaryCard
          key={summary.title}
          {...summary}
        />
      ))}
    </section>
  )
}
