import { z } from "zod"

export const transactionSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres"),

  amount: z
    .number({
      error: "Informe um valor válido",
    })
    .positive("O valor deve ser maior que zero"),

  category: z
    .string()
    .min(1, "Selecione uma categoria"),

  type: z.enum(["income", "expense"]),

  date: z.string(),
})

export type TransactionFormData =
  z.infer<typeof transactionSchema>