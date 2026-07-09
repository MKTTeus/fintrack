import { Archive, Target } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { GoalEvolutionChart } from '../components/goal-evolution-chart'
import { GoalProgressBar } from '../components/goal-progress-bar'
import { useDeleteGoal } from '../hooks/use-delete-goal'
import type { Goal } from '../types/goal.types'
import {
  formatCurrency,
  formatPercent,
  getGoalProgress,
  getRemainingAmount,
} from '../utils/goal-formatters'
import { goalToneStyles } from '../utils/goal-styles'

import { AddGoalDepositDialog } from './add-goal-deposit-dialog'
import { EditGoalDialog } from './edit-goal-dialog'

interface GoalDetailsDialogProps {
  goal: Goal | null
  onOpenChange: (open: boolean) => void
}

export function GoalDetailsDialog({
  goal,
  onOpenChange,
}: GoalDetailsDialogProps) {
  const deleteGoal = useDeleteGoal()

  if (!goal) {
    return null
  }

  const Icon = goal.icon
  const goalId = goal.id
  const progress = getGoalProgress(goal)
  const remaining = getRemainingAmount(goal)
  const styles = goalToneStyles[goal.tone]

  async function handleCancelGoal() {
    await deleteGoal.mutateAsync(goalId)
    onOpenChange(false)
  }

  return (
    <Sheet open={Boolean(goal)} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="
          w-full
          gap-0
          overflow-hidden
          border-border
          bg-card
          p-0
          shadow-2xl
          sm:max-w-[420px]
        "
      >
        <SheetHeader className="border-b border-border p-6 pr-12">
          <div className="flex items-start gap-4 pr-4">
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

            <div>
              <SheetTitle className="text-xl">
                {goal.title}
              </SheetTitle>
              <SheetDescription className="mt-2">
                {goal.description}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="flex flex-wrap gap-3">
            <EditGoalDialog goal={goal} />
            <Button
              type="button"
              variant="destructive"
              className="gap-2 rounded-2xl"
              disabled={deleteGoal.isPending}
              onClick={handleCancelGoal}
            >
              <Archive className="size-4" />
              {deleteGoal.isPending
                ? 'Cancelando...'
                : 'Cancelar meta'}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">
                Valor atual
              </p>
              <p className={`mt-1 font-medium ${styles.text}`}>
                {formatCurrency(goal.currentAmount)}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">
                Objetivo
              </p>
              <p className="mt-1 font-medium">
                {formatCurrency(goal.targetAmount)}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">
                Progresso
              </p>
              <p className={`mt-1 font-medium ${styles.text}`}>
                {formatPercent(progress)}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">
                Valor restante
              </p>
              <p className="mt-1 font-medium">
                {formatCurrency(remaining)}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">
                Meta mensal
              </p>
              <p className="mt-1 font-medium">
                {formatCurrency(goal.monthlyTarget)}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">
                Previsão
              </p>
              <p className="mt-1 font-medium">{goal.dueLabel}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="flex items-center gap-2 font-medium">
                <Target className="size-4 text-muted-foreground" />
                Progresso da meta
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

          <GoalEvolutionChart goal={goal} />

          <div className="grid gap-4">
            <div>
              <h4 className="font-medium tracking-tight">
                Histórico de depósitos
              </h4>
              <div className="mt-3 grid gap-3">
                {goal.deposits.length > 0 ? (
                  goal.deposits.map((deposit) => (
                    <div
                      key={deposit.id}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {deposit.month}
                      </span>
                      <span className="font-medium text-income">
                        +{formatCurrency(deposit.amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                    Nenhum depósito cadastrado para esta meta.
                  </p>
                )}
              </div>
            </div>

            <AddGoalDepositDialog goal={goal} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
