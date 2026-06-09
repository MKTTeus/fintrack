import { z } from "zod"

export const transactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "O título deve ter pelo menos 3 caracteres"),

  amount: z
    .coerce
    .number({
      error: "Informe um valor válido",
    })
    .positive("O valor deve ser maior que zero"),

  category: z
    .string()
    .min(1, "Selecione uma categoria"),

  type: z.enum(["income", "expense"]),

  transaction_date: z
    .string()
    .min(1, "Informe a data da transação"),
})

export type TransactionFormInput =
  z.input<typeof transactionSchema>

export type TransactionFormData =
  z.output<typeof transactionSchema>
