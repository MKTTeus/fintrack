import { z } from 'zod'

export const goalSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'O título deve ter pelo menos 2 caracteres'),
  description: z.string().trim().optional(),
  target_amount: z
    .number({
      error: 'Informe um valor válido',
    })
    .positive('O valor deve ser maior que zero'),
  target_date: z.string().trim().optional(),
  monthly_target: z
    .number({
      error: 'Informe um valor válido',
    })
    .min(0, 'O valor não pode ser negativo')
    .optional(),
  wallet_id: z.string().trim().optional(),
  icon: z.string().trim().optional(),
  color: z.string().trim().optional(),
})

export const goalEditSchema = goalSchema.extend({
  status: z.enum(['active', 'completed', 'paused', 'cancelled']),
})

export const goalDepositSchema = z.object({
  amount: z
    .number({
      error: 'Informe um valor válido',
    })
    .positive('O valor deve ser maior que zero'),
  deposit_date: z
    .string()
    .trim()
    .min(1, 'Informe a data do depósito'),
  wallet_id: z.string().trim().optional(),
  notes: z.string().trim().optional(),
})

export type GoalFormInput = z.input<typeof goalSchema>
export type GoalFormData = z.output<typeof goalSchema>

export type GoalEditFormInput = z.input<typeof goalEditSchema>
export type GoalEditFormData = z.output<typeof goalEditSchema>

export type GoalDepositFormInput = z.input<typeof goalDepositSchema>
export type GoalDepositFormData = z.output<typeof goalDepositSchema>
