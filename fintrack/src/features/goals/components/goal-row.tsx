import { CalendarDays, Eye, Flag } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { Goal } from '../types/goal.types'
import {
  formatCurrency,
  formatPercent,
  getGoalProgress,
  getRemainingAmount,
} from '../utils/goal-formatters'
import { goalToneStyles } from '../utils/goal-styles'

import { GoalProgressBar } from './goal-progress-bar'

const statusLabels = {
  active: 'Ativa',
  completed: 'Concluída',
  paused: 'Pausada',
  cancelled: 'Cancelada',
}

interface GoalRowProps {
  goal: Goal
  onDetails: (goal: Goal) => void
}

export function GoalRow({
  goal,
  onDetails,
}: GoalRowProps) {
  const Icon = goal.icon
  const progress = getGoalProgress(goal)
  const remaining = getRemainingAmount(goal)
  const styles = goalToneStyles[goal.tone]

  return (
    <article className="grid grid-cols-1 gap-5 border-t border-border p-5 transition-colors first:border-t-0 hover:bg-muted/20 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,1fr)_auto] lg:items-center">
      <div className="flex min-w-0 items-center gap-4">
        <div
          className={`
            flex
            size-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            ${styles.icon}
          `}
        >
          <Icon className="size-7" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium tracking-tight">
              {goal.title}
            </h3>
            <Badge
              variant="outline"
              className={`${styles.soft} ${styles.text}`}
            >
              {statusLabels[goal.status]}
            </Badge>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {goal.description}
          </p>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">
                Faltam
              </p>
              <p className="font-medium">
                {formatCurrency(remaining)}
              </p>
            </div>

            <div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="size-3" />
                Previsão
              </p>
              <p className="font-medium">{goal.dueLabel}</p>
            </div>

            <div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Flag className="size-3" />
                Meta mensal
              </p>
              <p className="font-medium">
                {formatCurrency(goal.monthlyTarget)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="truncate font-medium tracking-tight">
            {formatCurrency(goal.currentAmount)} /{' '}
            {formatCurrency(goal.targetAmount)}
          </p>
          <span className={`text-sm font-medium ${styles.text}`}>
            {formatPercent(progress)}
          </span>
        </div>

        <GoalProgressBar
          progress={progress}
          tone={goal.tone}
        />
      </div>

      <div className="flex justify-start lg:justify-end">
        <Button
          type="button"
          variant="outline"
          className="gap-2 rounded-2xl"
          onClick={() => onDetails(goal)}
        >
          <Eye className="size-4" />
          Ver detalhes
        </Button>
      </div>
    </article>
  )
}
