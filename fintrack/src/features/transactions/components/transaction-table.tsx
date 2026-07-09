import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { Transaction } from '../types/transaction.types'
import { useTransactions } from '../hooks/use-transactions'

import { TransactionEmptyState } from './transaction-empty-state'
import { transactionColumns } from './transaction-columns'
import { TransactionTableSkeleton } from './transaction-table-skeleton'

function formatTransactionDate(date?: string | null) {
  if (!date) {
    return ''
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const isExpense = transaction.type === 'expense'

  return (
    <article className="w-full rounded-3xl border border-border bg-background p-3 shadow-sm shadow-muted/10 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-medium text-foreground sm:text-lg">
            {transaction.title}
          </p>

          <p className="mt-2 text-sm text-muted-foreground break-words">
            {transaction.category}
          </p>
        </div>

        <p
          className={`
            flex-shrink-0
            max-w-[40%]
            text-right
            text-base
            font-semibold
            ${
              isExpense ? 'text-destructive' : 'text-income'
            }
          `}
        >
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(transaction.amount)}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>{formatTransactionDate(transaction.transaction_date)}</span>
        <span className="hidden h-4 w-px rounded-full bg-border/70 sm:inline-block" />
        <span>{transaction.type === 'income' ? 'Receita' : 'Despesa'}</span>
      </div>
    </article>
  )
}

export function TransactionTable() {
  const {
    data = [],
    isLoading,
  } = useTransactions()

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: transactionColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <TransactionTableSkeleton />
  }

  if (!data.length) {
    return <TransactionEmptyState />
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-4 lg:p-6">
      <div className="hidden lg:block overflow-hidden rounded-xl">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 lg:hidden">
        {data.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </div>
    </section>
  )
}
