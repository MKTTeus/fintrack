import { AppLayout } from '@/components/layout/app-layout'

export function TransactionsPage() {
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
          Transações
        </h1>

        <p
          className="
            mt-1
            text-muted-foreground
          "
        >
          Gerencie suas movimentações
        </p>
      </div>
    </AppLayout>
  )
}