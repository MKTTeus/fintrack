import { AppLayout } from '@/components/layout/app-layout'

export function GoalsPage() {
  return (
    <AppLayout>
      <div>
        <h1
          className="
            text-3xl
            font-medium
            tracking-tight
          "
        >
          Metas
        </h1>

        <p
          className="
            mt-1
            text-muted-foreground
          "
        >
          Gerencie seus objetivos financeiros
        </p>
      </div>
    </AppLayout>
  )
}