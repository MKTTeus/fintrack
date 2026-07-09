import {
  ChartNoAxesCombined,
  CircleDollarSign,
  CreditCard,
} from 'lucide-react'

import type {
  PeriodSummary,
  PeriodSummaryInsight,
} from '../types/report.types'

const insightStyles: Record<
  PeriodSummaryInsight['tone'],
  {
    className: string
    icon: typeof CircleDollarSign
  }
> = {
  income: {
    icon: CircleDollarSign,
    className: 'bg-income/10 text-income',
  },
  warning: {
    icon: ChartNoAxesCombined,
    className: 'bg-amber-500/10 text-amber-400',
  },
  primary: {
    icon: CreditCard,
    className: 'bg-primary/10 text-primary',
  },
}

interface PeriodSummaryCardProps {
  isLoading: boolean
  summary?: PeriodSummary
}

export function PeriodSummaryCard({
  isLoading,
  summary,
}: PeriodSummaryCardProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-lg font-medium tracking-tight">
        Resumo do período
      </h2>

      <div className="mt-5 grid gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-start gap-3"
              >
                <div className="size-8 animate-pulse rounded-xl bg-muted" />
                <div className="mt-1 h-4 flex-1 animate-pulse rounded bg-muted" />
              </div>
            ))
          : summary?.insights.map((insight) => {
              const styles = insightStyles[insight.tone]
              const Icon = styles.icon

              return (
                <div
                  key={insight.text}
                  className="flex items-start gap-3"
                >
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${styles.className}`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <p className="pt-1 text-sm text-muted-foreground">
                    {insight.text}
                  </p>
                </div>
              )
            })}
      </div>

      <div className="mt-6 border-t border-border pt-5">
        {isLoading ? (
          <div className="grid gap-2">
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            {summary?.body}
          </p>
        )}
      </div>
    </section>
  )
}
