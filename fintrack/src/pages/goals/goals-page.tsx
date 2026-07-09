import { useMemo, useState } from 'react'

import { AppLayout } from '@/components/layout/app-layout'
import { AchievementCards } from '@/features/goals/components/achievement-cards'
import { GoalList } from '@/features/goals/components/goal-list'
import { GoalSummaryCards } from '@/features/goals/components/goal-summary-cards'
import { GoalDetailsDialog } from '@/features/goals/dialogs/goal-details-dialog'
import { NewGoalDialog } from '@/features/goals/dialogs/new-goal-dialog'
import { useGoals } from '@/features/goals/hooks/use-goals'

export function GoalsPage() {
  const {
    achievements,
    goals,
    isError,
    isLoading,
    summaries,
  } = useGoals()
  const [selectedGoalId, setSelectedGoalId] =
    useState<string | null>(null)

  const selectedGoal = useMemo(
    () =>
      goals.find((goal) => goal.id === selectedGoalId) ??
      null,
    [goals, selectedGoalId],
  )

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">

        <GoalSummaryCards summaries={summaries} />

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-medium tracking-tight">
                Todas as metas
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Visualize e gerencie seus objetivos financeiros
              </p>
            </div>

            <NewGoalDialog />
          </div>

          <GoalList
            goals={goals}
            isError={isError}
            isLoading={isLoading}
            onDetails={(goal) =>
              setSelectedGoalId(goal.id)
            }
          />
        </section>

        <AchievementCards achievements={achievements} />

        <GoalDetailsDialog
          goal={selectedGoal}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedGoalId(null)
            }
          }}
        />
      </div>
    </AppLayout>
  )
}
