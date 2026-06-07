import { AppLayout } from '@/components/layout/app-layout'

export function ReportsPage() {
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
          Relatórios
        </h1>

        <p
          className="
            mt-1
            text-muted-foreground
          "
        >
          Análise financeiras detalhadas
        </p>
      </div>
    </AppLayout>
  )
}