import type { Control } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type {
  TransactionFormData,
  TransactionFormInput,
} from '../schemas/transaction.schema'
import type {
  WalletItem,
  WalletType,
} from '@/features/wallets/types/wallet.types'

const walletTypeLabels = {
  pix: 'Pix',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  cash: 'Dinheiro',
} satisfies Record<WalletType, string>

interface TransactionWalletFieldProps {
  control: Control<
    TransactionFormInput,
    undefined,
    TransactionFormData
  >
  disabled?: boolean
  isLoading: boolean
  wallets: WalletItem[]
}

export function TransactionWalletField({
  control,
  disabled = false,
  isLoading,
  wallets,
}: TransactionWalletFieldProps) {
  const isEmpty = !isLoading && wallets.length === 0

  return (
    <FormField
      control={control}
      name="wallet_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm text-muted-foreground">
            Carteira / Forma de pagamento
          </FormLabel>

          <FormControl>
            <Select
              disabled={disabled || isLoading || isEmpty}
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger className="h-10 rounded-2xl px-3">
                <SelectValue
                  placeholder={
                    isLoading
                      ? 'Carregando carteiras...'
                      : 'Selecione uma carteira'
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem
                    key={wallet.id}
                    value={wallet.id}
                  >
                    {wallet.name} - {walletTypeLabels[wallet.type]} -{' '}
                    {wallet.currentValue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>

          {isEmpty ? (
            <p className="text-xs text-muted-foreground">
              Cadastre uma forma de pagamento antes de criar uma transação.
            </p>
          ) : null}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
