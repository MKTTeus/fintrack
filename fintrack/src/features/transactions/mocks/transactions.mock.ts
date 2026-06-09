import type { Transaction } from "../types/transaction.types"

export const transactionsMock: Transaction[] = [
  {
    id: "1",
    title: "Salário",
    amount: 4500,
    category: "Salário",
    type: "income",
    transaction_date: "2026-06-01",
    user_id: "00000000-0000-0000-0000-000000000000",
    created_at: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Mercado",
    amount: 320,
    category: "Alimentação",
    type: "expense",
    transaction_date: "2026-06-03",
    user_id: "00000000-0000-0000-0000-000000000000",
    created_at: "2026-06-03T00:00:00.000Z",
  },
]
