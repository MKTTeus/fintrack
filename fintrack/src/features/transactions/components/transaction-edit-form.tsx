import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
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
import { useWallets } from '@/features/wallets/hooks/use-wallets'

import { transactionCategories } from '../constants/transaction-categories'
import {
  transactionSchema,
  type TransactionFormData,
  type TransactionFormInput,
} from '../schemas/transaction.schema'
import { useUpdateTransaction } from '../hooks/use-update-transaction'
import { TransactionWalletField } from './transaction-wallet-field'

import type { Transaction } from '../types/transaction.types'

interface TransactionEditFormProps {
  transaction: Transaction
  onClose: () => void
}

export function TransactionEditForm({
  transaction,
  onClose,
}: TransactionEditFormProps) {
  const { mutateAsync } =
    useUpdateTransaction()
  const { wallets, walletsQuery } = useWallets()
  const isWalletUnavailable =
    walletsQuery.isLoading || wallets.length === 0

  const form = useForm<
    TransactionFormInput,
    undefined,
    TransactionFormData
  >({
    resolver: zodResolver(transactionSchema),

    defaultValues: {
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      wallet_id: transaction.wallet_id ?? '',
      transaction_date: transaction.transaction_date,
    },
  })

  async function onSubmit(data: TransactionFormData) {
    try {
      await mutateAsync({
        id: transaction.id,
        input: data,
      })

      onClose()
    } catch (error) {
      console.error('Erro ao atualizar:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-muted-foreground">
                Título
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Ex: Mercado"
                  {...field}
                  className="h-10 rounded-2xl px-3 transition-colors"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground">
                  Valor
                </FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    placeholder="0,00"
                    value={String(field.value ?? '')}
                    onChange={field.onChange}
                    className="h-10 rounded-2xl px-3 transition-colors"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground">
                  Tipo
                </FormLabel>

                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="income">
                      Receita
                    </SelectItem>

                    <SelectItem value="expense">
                      Despesa
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <TransactionWalletField
          control={form.control}
          isLoading={walletsQuery.isLoading}
          wallets={wallets}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground">
                  Categoria
                </FormLabel>

                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {transactionCategories.map(
                      (category) => (
                        <SelectItem
                          key={category}
                          value={category}
                        >
                          {category}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="transaction_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground">
                  Data
                </FormLabel>

                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="h-10 rounded-2xl px-3 transition-colors"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-2xl"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting ||
              isWalletUnavailable
            }
            className="rounded-2xl"
          >
            {form.formState.isSubmitting
              ? 'Salvando...'
              : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
