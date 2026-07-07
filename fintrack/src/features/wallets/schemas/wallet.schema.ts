import { z } from 'zod'

const optionalText = z.string().trim().optional()

const optionalNumber = z.preprocess(
  (value) =>
    value === '' || value === null || value === undefined
      ? undefined
      : Number(value),
  z.number().min(0).optional(),
)

const optionalDay = z.preprocess(
  (value) =>
    value === '' || value === null || value === undefined
      ? undefined
      : Number(value),
  z
    .number()
    .int()
    .min(1, 'Informe um dia entre 1 e 31')
    .max(31, 'Informe um dia entre 1 e 31')
    .optional(),
)

export const walletSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres'),

  type: z.enum(['pix', 'credit_card', 'debit_card', 'cash']),

  description: optionalText,

  current_balance: z
    .number({
      error: 'Informe um valor válido',
    })
    .min(0, 'O valor não pode ser negativo'),

  color: optionalText,

  icon: optionalText,

  bank: optionalText,

  pix_key_type: optionalText,

  pix_key: optionalText,

  agency: optionalText,

  account: optionalText,

  observations: optionalText,

  card_name: optionalText,

  last_four_digits: optionalText,

  credit_limit: optionalNumber,

  closing_day: optionalDay,

  due_day: optionalDay,
})

export type WalletFormInput =
  z.input<typeof walletSchema>

export type WalletFormData =
  z.output<typeof walletSchema>

export const walletEditSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres'),

  description: optionalText,

  bank: optionalText,

  pix_key_type: optionalText,

  pix_key: optionalText,

  agency: optionalText,

  account: optionalText,

  observations: optionalText,

  current_balance: optionalNumber,

  card_name: optionalText,

  last_four_digits: optionalText,

  credit_limit: optionalNumber,

  closing_day: optionalDay,

  due_day: optionalDay,
})

export type WalletEditFormInput =
  z.input<typeof walletEditSchema>

export type WalletEditFormData =
  z.output<typeof walletEditSchema>
