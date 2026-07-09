import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useWallets } from '@/features/wallets/hooks/use-wallets'

import { useCreateGoalDeposit } from '../hooks/use-create-goal-deposit'
import { useUpdateGoal } from '../hooks/use-update-goal'
import {
  goalDepositSchema,
  type GoalDepositFormData,
  type GoalDepositFormInput,
} from '../schemas/goal.schema'
import type { Goal } from '../types/goal.types'

interface AddGoalDepositDialogProps {
  goal: Goal
}

function getToday() {
  return new Date().toLocaleDateString('en-CA')
}

const defaultValues: GoalDepositFormInput = {
  amount: 0,
  deposit_date: getToday(),
  notes: '',
  wallet_id: 'none',
}

function optionalText(value?: string) {
  return value && value !== 'none' ? value : null
}

export function AddGoalDepositDialog({
  goal,
}: AddGoalDepositDialogProps) {
  const [open, setOpen] = useState(false)
  const createDeposit = useCreateGoalDeposit()
  const updateGoal = useUpdateGoal()
  const { wallets, walletsQuery } = useWallets()

  const form = useForm<
    GoalDepositFormInput,
    undefined,
    GoalDepositFormData
  >({
    resolver: zodResolver(goalDepositSchema),
    defaultValues: {
      ...defaultValues,
      wallet_id: goal.walletId ?? 'none',
    },
  })

  async function onSubmit(data: GoalDepositFormData) {
    try {
      await createDeposit.mutateAsync({
        goal_id: goal.id,
        wallet_id: optionalText(data.wallet_id),
        amount: data.amount,
        deposit_date: data.deposit_date,
        notes: optionalText(data.notes),
      })

      if (
        goal.currentAmount + data.amount >= goal.targetAmount &&
        goal.status !== 'completed'
      ) {
        await updateGoal.mutateAsync({
          id: goal.id,
          input: {
            status: 'completed',
          },
        })
      }

      form.reset({
        ...defaultValues,
        deposit_date: getToday(),
        wallet_id: goal.walletId ?? 'none',
      })
      setOpen(false)
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível adicionar o depósito.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-full gap-2 rounded-2xl"
        >
          <Plus className="size-4" />
          Adicionar depósito
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Adicionar depósito
          </DialogTitle>
          <DialogDescription>
            Registre um novo valor depositado nesta meta.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        className="h-10 rounded-2xl"
                        placeholder="500"
                        value={field.value || ''}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === ''
                              ? 0
                              : Number(event.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deposit_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-10 rounded-2xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="wallet_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carteira vinculada</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? 'none'}
                      onValueChange={field.onChange}
                      disabled={walletsQuery.isLoading}
                    >
                      <SelectTrigger className="h-10 rounded-2xl">
                        <SelectValue placeholder="Opcional" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          Nenhuma carteira
                        </SelectItem>
                        {wallets.map((wallet) => (
                          <SelectItem
                            key={wallet.id}
                            value={wallet.id}
                          >
                            {wallet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-24 rounded-2xl"
                      placeholder="Opcional"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root?.message ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            ) : null}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={
                  createDeposit.isPending ||
                  updateGoal.isPending
                }
              >
                {createDeposit.isPending
                  ? 'Salvando...'
                  : 'Salvar depósito'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
