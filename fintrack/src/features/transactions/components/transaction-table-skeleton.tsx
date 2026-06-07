export function TransactionTableSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-10 animate-pulse rounded-2xl bg-muted/60"
          />
        ))}
      </div>
    </div>
  )
}