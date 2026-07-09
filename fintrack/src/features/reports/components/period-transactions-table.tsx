import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { PeriodTransaction } from '../types/report.types'

function TransactionValue({
  transaction,
}: {
  transaction: PeriodTransaction
}) {
  return (
    <span
      className={`font-medium ${
        transaction.type === 'income'
          ? 'text-income'
          : 'text-destructive'
      }`}
    >
      {transaction.value}
    </span>
  )
}

interface PeriodTransactionsTableProps {
  isLoading: boolean
  transactions: PeriodTransaction[]
}

export function PeriodTransactionsTable({
  isLoading,
  transactions,
}: PeriodTransactionsTableProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-medium tracking-tight">
            Transações do período
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão organizada das movimentações consideradas no relatório.
          </p>
        </div>

        <span className="w-fit rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted-foreground">
          {transactions.length} lançamentos
        </span>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border/70 md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Carteira</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">
                Valor
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 5 }).map(
                      (_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <div className="h-4 animate-pulse rounded bg-muted" />
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ))
              : transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.wallet}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <TransactionValue
                        transaction={transaction}
                      />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <article
                key={index}
                className="rounded-2xl border border-border bg-background/30 p-4"
              >
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="mt-4 h-5 w-32 animate-pulse rounded bg-muted" />
              </article>
            ))
          : transactions.map((transaction) => (
              <article
                key={transaction.id}
                className="rounded-2xl border border-border bg-background/30 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium">
                      {transaction.description}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>

                  <TransactionValue transaction={transaction} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {transaction.category}
                  </Badge>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {transaction.wallet}
                  </span>
                </div>
              </article>
            ))}
      </div>

      {!isLoading && transactions.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-background/30 p-6 text-center text-sm text-muted-foreground">
          Nenhuma transação encontrada para os filtros selecionados.
        </div>
      ) : null}
    </section>
  )
}
