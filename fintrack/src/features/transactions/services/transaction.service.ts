import { transactionsMock } from "../mocks/transactions.mock"

import type {
  Transaction,
} from "../types/transaction.types"

type CreateTransactionInput = Omit<
  Transaction,
  "id"
>

export async function getTransactions() {
  await new Promise((resolve) =>
    setTimeout(resolve, 800),
  )

  return transactionsMock
}

export async function createTransaction(
  data: CreateTransactionInput,
) {
  await new Promise((resolve) =>
    setTimeout(resolve, 800),
  )

  const newTransaction: Transaction = {
    id: crypto.randomUUID(),
    ...data,
  }

  transactionsMock.unshift(newTransaction)

  return newTransaction
}