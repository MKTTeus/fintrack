import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
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

import { useUpdateGoal } from '../hooks/use-update-goal'
import {
  goalEditSchema,
  type GoalEditFormData,
  type GoalEditFormInput,
} from '../schemas/goal.schema'
import type { Goal } from '../types/goal.types'

interface EditGoalDialogProps {
  goal: Goal
}

function getDefaultValues(goal: Goal): GoalEditFormInput {
  return {
    color: goal.color ?? 'blue',
    description:
      goal.raw.description ??
      '',
    icon: goal.iconName,
    monthly_target: goal.raw.monthly_target ?? undefined,
    status: goal.status,
    target_amount: goal.targetAmount,
    target_date: goal.targetDate ?? '',
    title: goal.title,
    wallet_id: goal.walletId ?? 'none',
  }
}

function optionalText(value?: string) {
  return value && value !== 'none' ? value : null
}

export function EditGoalDialog({
  goal,
}: EditGoalDialogProps) {
  const [open, setOpen] = useState(false)
  const updateGoal = useUpdateGoal()
  const { wallets, walletsQuery } = useWallets()

  const form = useForm<
    GoalEditFormInput,
    undefined,
    GoalEditFormData
  >({
    resolver: zodResolver(goalEditSchema),
    defaultValues: getDefaultValues(goal),
  })

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(goal))
    }
  }, [form, goal, open])

  async function onSubmit(data: GoalEditFormData) {
    try {
      await updateGoal.mutateAsync({
        id: goal.id,
        input: {
          wallet_id: optionalText(data.wallet_id),
          title: data.title,
          description: optionalText(data.description),
          target_amount: data.target_amount,
          target_date: optionalText(data.target_date),
          monthly_target: data.monthly_target ?? null,
          icon: data.icon ?? goal.iconName,
          color: data.color ?? goal.color,
          status: data.status,
        },
      })

      setOpen(false)
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível atualizar a meta.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="gap-2 rounded-2xl"
        >
          <Pencil className="size-4" />
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Editar meta
          </DialogTitle>
          <DialogDescription>
            Atualize as informações principais da meta.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da meta</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 rounded-2xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="target_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor objetivo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        className="h-10 rounded-2xl"
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
                name="monthly_target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta mensal</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        className="h-10 rounded-2xl"
                        value={field.value ?? ''}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === ''
                              ? undefined
                              : Number(event.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
                name="target_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data prevista</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-10 rounded-2xl"
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-10 rounded-2xl">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativa</SelectItem>
                        <SelectItem value="paused">Pausada</SelectItem>
                        <SelectItem value="completed">
                          Concluída
                        </SelectItem>
                        <SelectItem value="cancelled">
                          Cancelada
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-24 rounded-2xl"
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
                disabled={updateGoal.isPending}
              >
                {updateGoal.isPending
                  ? 'Salvando...'
                  : 'Salvar alterações'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
