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

import { useTransactions } from "../hooks/use-transactions"

import { TransactionEmptyState } from "./transaction-empty-state"
import { transactionColumns } from "./transaction-columns"
import { TransactionTableSkeleton } from "./transaction-table-skeleton"

export function TransactionTable() {
  const {
    data = [],
    isLoading,
  } = useTransactions()

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
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="overflow-hidden rounded-xl">
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
    </section>
  )
}