import { Wallet } from "lucide-react"

export function TransactionEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-w-0 rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center sm:p-10">
      <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />

      <h3 className="text-lg font-medium">Nenhuma transação encontrada</h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Suas transações aparecerão aqui.
      </p>
    </div>
  )
}