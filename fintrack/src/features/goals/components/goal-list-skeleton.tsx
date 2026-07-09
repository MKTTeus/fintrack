export function GoalListSkeleton() {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-5 border-t border-border p-5 first:border-t-0 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,1fr)_auto] lg:items-center"
        >
          <div className="flex items-center gap-4">
            <div className="size-14 animate-pulse rounded-2xl bg-muted/30" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-4 w-44 animate-pulse rounded bg-muted/30" />
              <div className="h-3 w-64 max-w-full animate-pulse rounded bg-muted/20" />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="h-4 w-24 animate-pulse rounded bg-muted/20" />
                <div className="h-4 w-28 animate-pulse rounded bg-muted/20" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted/20" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-4 w-52 animate-pulse rounded bg-muted/30" />
            <div className="h-2 w-full animate-pulse rounded-full bg-muted/20" />
          </div>

          <div className="h-9 w-32 animate-pulse rounded-2xl bg-muted/30" />
        </div>
      ))}
    </section>
  )
}
