import type {
  ReportSummary,
  ReportSummaryTone,
} from '../types/report.types'

const summaryToneStyles: Record<
  ReportSummaryTone,
  {
    comparison: string
    icon: string
    value: string
  }
> = {
  income: {
    comparison: 'text-income',
    icon: 'bg-income/10 text-income',
    value: 'text-foreground',
  },
  expense: {
    comparison: 'text-destructive',
    icon: 'bg-destructive/10 text-destructive',
    value: 'text-foreground',
  },
  balance: {
    comparison: 'text-income',
    icon: 'bg-primary/10 text-primary',
    value: 'text-foreground',
  },
  saving: {
    comparison: 'text-violet-400',
    icon: 'bg-violet-500/10 text-violet-400',
    value: 'text-foreground',
  },
}

function ReportsSummaryCard({
  title,
  value,
  comparison,
  icon: Icon,
  tone,
}: ReportSummary) {
  const styles = summaryToneStyles[tone]

  return (
    <article className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            {title}
          </p>
          <h3
            className={`mt-2 truncate text-2xl font-medium tracking-tight ${styles.value}`}
          >
            {value}
          </h3>
          <p
            className={`mt-2 text-sm font-medium ${styles.comparison}`}
          >
            {comparison}
          </p>
        </div>

        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </article>
  )
}

interface ReportsSummaryCardsProps {
  isLoading: boolean
  summaries: ReportSummary[]
}

function ReportsSummarySkeleton() {
  return (
    <article className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-4 w-36 animate-pulse rounded bg-muted" />
        </div>
        <div className="size-11 animate-pulse rounded-2xl bg-muted" />
      </div>
    </article>
  )
}

export function ReportsSummaryCards({
  isLoading,
  summaries,
}: ReportsSummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <ReportsSummarySkeleton key={index} />
          ))
        : summaries.map((summary) => (
            <ReportsSummaryCard
              key={summary.title}
              {...summary}
            />
          ))}
    </section>
  )
}
