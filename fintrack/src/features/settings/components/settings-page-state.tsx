import { AlertCircle } from 'lucide-react'

import { Card } from '@/components/ui/card'

export function SettingsCardsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card
          key={index}
          className="grid gap-6 rounded-2xl border-border/80 bg-card/70 p-5 ring-1 ring-white/5 md:grid-cols-[18rem_minmax(0,1fr)] md:p-6 xl:grid-cols-[20rem_minmax(0,1fr)]"
        >
          <div className="flex gap-4">
            <div className="size-12 animate-pulse rounded-2xl bg-muted" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="h-3 w-44 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-10 animate-pulse rounded-xl bg-muted" />
            <div className="h-10 animate-pulse rounded-xl bg-muted" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export function SettingsErrorState() {
  return (
    <Card className="flex items-start gap-4 rounded-2xl border-destructive/30 bg-card/70 p-6 text-sm ring-1 ring-white/5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertCircle className="size-5" />
      </div>
      <div>
        <h2 className="font-medium text-foreground">
          Não foi possível carregar suas configurações
        </h2>
        <p className="mt-1 text-muted-foreground">
          Recarregue a página ou tente novamente em alguns instantes.
        </p>
      </div>
    </Card>
  )
}
