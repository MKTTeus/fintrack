import type { Goal } from '../types/goal.types'

import { GoalEmptyState } from './goal-empty-state'
import { GoalErrorState } from './goal-error-state'
import { GoalListSkeleton } from './goal-list-skeleton'
import { GoalRow } from './goal-row'

interface GoalListProps {
  goals: Goal[]
  isError?: boolean
  isLoading?: boolean
  onDetails: (goal: Goal) => void
}

export function GoalList({
  goals,
  isError = false,
  isLoading = false,
  onDetails,
}: GoalListProps) {
  if (isLoading) {
    return <GoalListSkeleton />
  }

  if (isError) {
    return <GoalErrorState />
  }

  if (!goals.length) {
    return <GoalEmptyState />
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      {goals.map((goal) => (
        <GoalRow
          key={goal.id}
          goal={goal}
          onDetails={onDetails}
        />
      ))}
    </section>
  )
}
