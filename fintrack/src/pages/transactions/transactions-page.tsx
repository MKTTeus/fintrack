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
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0">
              <div className="flex items-baseline gap-3">
                <div className="text-sm text-muted-foreground">
                  Registros
                </div>
                <div className="text-lg font-semibold tracking-tight text-foreground">
                  {total}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
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

          <div className="flex w-full justify-start lg:w-auto lg:justify-end">
            <TransactionFormDialog />
          </div>
        </div>

        <TransactionTable />
      </div>
    </AppLayout>
  )
}
