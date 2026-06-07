import type { Transaction } from "../types/transaction.types"

export const transactionsMock: Transaction[] = [
  {
    id: "1",
    title: "Salário",
    amount: 4500,
    category: "Salário",
    type: "income",
    date: "2026-06-01",
  },
  {
    id: "2",
    title: "Mercado",
    amount: 320,
    category: "Alimentação",
    type: "expense",
    date: "2026-06-03",
  },
]