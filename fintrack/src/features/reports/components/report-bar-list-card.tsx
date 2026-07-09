import type { ReportBarItem } from '../types/report.types'

interface ReportBarListCardProps {
  title: string
  items: ReportBarItem[]
  barClassName?: string
  emptyMessage: string
  isLoading: boolean
  periodLabel: string
}

export function ReportBarListCard({
  title,
  items,
  barClassName = 'bg-primary',
  emptyMessage,
  isLoading,
  periodLabel,
}: ReportBarListCardProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium tracking-tight">
          {title}
        </h2>
        <span className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted-foreground">
          {periodLabel}
        </span>
      </div>

      <div className="grid gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="grid gap-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-1.5 animate-pulse rounded-full bg-muted" />
              </div>
            ))
          : items.length > 0
            ? items.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-2"
                >
                  <div className="grid grid-cols-[minmax(7rem,1fr)_auto] items-baseline gap-3">
                    <p className="truncate text-sm font-medium">
                      {item.label}
                    </p>
                    <div className="flex items-baseline gap-3 text-sm">
                      <span className="font-medium">
                        {item.value}
                      </span>
                      <span className="w-9 text-right text-muted-foreground">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${barClassName}`}
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            : (
                <div className="rounded-2xl border border-dashed border-border bg-background/30 p-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              )}
      </div>
    </section>
  )
}
