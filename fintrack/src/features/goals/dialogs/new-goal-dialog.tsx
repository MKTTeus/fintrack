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

import { useCreateGoal } from '../hooks/use-create-goal'
import {
  goalSchema,
  type GoalFormData,
  type GoalFormInput,
} from '../schemas/goal.schema'

const defaultValues: GoalFormInput = {
  color: 'blue',
  description: '',
  icon: 'target',
  monthly_target: undefined,
  target_amount: 0,
  target_date: '',
  title: '',
  wallet_id: 'none',
}

function optionalText(value?: string) {
  return value && value !== 'none' ? value : null
}

export function NewGoalDialog() {
  const [open, setOpen] = useState(false)
  const createGoal = useCreateGoal()
  const { wallets, walletsQuery } = useWallets()

  const form = useForm<
    GoalFormInput,
    undefined,
    GoalFormData
  >({
    resolver: zodResolver(goalSchema),
    defaultValues,
  })

  async function onSubmit(data: GoalFormData) {
    try {
      await createGoal.mutateAsync({
        wallet_id: optionalText(data.wallet_id),
        title: data.title,
        description: optionalText(data.description),
        target_amount: data.target_amount,
        target_date: optionalText(data.target_date),
        monthly_target: data.monthly_target ?? null,
        icon: data.icon ?? 'target',
        color: data.color ?? 'blue',
      })

      form.reset(defaultValues)
      setOpen(false)
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível salvar a meta.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-2xl">
          <Plus className="size-4" />
          Nova Meta
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Nova Meta
          </DialogTitle>
          <DialogDescription>
            Estruture um objetivo financeiro para acompanhar seu progresso.
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
                      placeholder="Ex: Reserva de emergência"
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
                        placeholder="15000"
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
                        placeholder="600"
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
                          <SelectValue
                            placeholder={
                              walletsQuery.isLoading
                                ? 'Carregando carteiras...'
                                : 'Opcional'
                            }
                          />
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo e o motivo dessa meta"
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
                disabled={createGoal.isPending}
              >
                {createGoal.isPending
                  ? 'Salvando...'
                  : 'Salvar meta'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
