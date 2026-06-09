import { AppLayout } from '@/components/layout/app-layout'

import { TransactionFormDialog } from '@/features/transactions/components/transaction-form-dialog'
import { TransactionTable } from '@/features/transactions/components/transaction-table'
import { useTransactions } from '@/features/transactions/hooks/use-transactions'
import { Badge } from '@/components/ui/badge'

export function TransactionsPage() {
  const { data = [] } = useTransactions()

  const total = data.length
  const incomeCount = data.filter(
    (transaction) => transaction.type === 'income',
  ).length
  const expenseCount = data.filter(
    (transaction) => transaction.type === 'expense',
  ).length

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-baseline gap-3">
              <div className="text-sm text-muted-foreground">Registros</div>
              <div className="text-lg font-semibold tracking-tight text-foreground">{total}</div>
            </div>

            <div className="h-6 w-px bg-border/10" />

            <div className="flex items-center gap-2">
              <Badge
                variant="ghost"
                className="px-3 py-0.5 rounded-full text-sm tracking-tight bg-muted/6 text-muted-foreground border-transparent transition-colors duration-150 hover:bg-muted/10"
              >
                Receita {incomeCount}
              </Badge>

              <Badge
                variant="ghost"
                className="px-3 py-0.5 rounded-full text-sm tracking-tight bg-muted/6 text-muted-foreground border-transparent transition-colors duration-150 hover:bg-muted/10"
              >
                Despesa {expenseCount}
              </Badge>
            </div>
          </div>

          <div className="flex items-center">
            <TransactionFormDialog />
          </div>
        </div>

        <TransactionTable />
      </div>
    </AppLayout>
  )
}
