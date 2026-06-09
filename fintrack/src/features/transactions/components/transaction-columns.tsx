import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import type { Transaction } from "../types/transaction.types"

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.original.type

      return (
        <Badge
          variant="ghost"
          className={`px-3 py-0.5 rounded-full text-sm tracking-tight ${
            type === "income"
              ? "bg-income/6 text-income"
              : "bg-destructive/8 text-destructive"
          }`}
        >
          {type === "income" ? "Receita" : "Despesa"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const amount = row.original.amount
      const type = row.original.type

      return (
        <span
          className={
            type === "income" ? "text-income" : "text-expense"
          }
        >
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </span>
      )
    },
  },
  {
    accessorKey: "transaction_date",
    header: "Data",
    cell: ({ row }) =>
      new Intl.DateTimeFormat("pt-BR").format(
        new Date(
          `${row.original.transaction_date}T00:00:00`,
        ),
      ),
  },
]
