import type { UseFormReturn } from 'react-hook-form'

import {
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

import type {
  WalletFormData,
  WalletFormInput,
} from '../schemas/wallet.schema'
import type { WalletType } from '../types/wallet.types'

interface AddWalletFieldsProps {
  form: UseFormReturn<
    WalletFormInput,
    undefined,
    WalletFormData
  >
  type: WalletType
}

export function AddWalletFields({
  form,
  type,
}: AddWalletFieldsProps) {
  if (type === 'credit_card') {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          form={form}
          name="name"
          label="Nome da carteira"
          placeholder="Ex: Crédito principal"
        />
        <TextField
          form={form}
          name="description"
          label="Descrição"
          placeholder="Ex: Cartão de uso recorrente"
        />
        <TextField
          form={form}
          name="bank"
          label="Banco"
          placeholder="Ex: Nubank"
        />
        <TextField
          form={form}
          name="card_name"
          label="Nome do cartão"
          placeholder="Ex: Ultravioleta"
        />
        <TextField
          form={form}
          name="last_four_digits"
          label="Últimos 4 dígitos"
          placeholder="Ex: 1234"
        />
        <NumberField
          form={form}
          name="credit_limit"
          label="Limite"
          placeholder="Ex: 10000"
        />
        <NumberField
          form={form}
          name="closing_day"
          label="Dia de fechamento"
          placeholder="Ex: 10"
        />
        <NumberField
          form={form}
          name="due_day"
          label="Dia de vencimento"
          placeholder="Ex: 15"
        />
      </div>
    )
  }

  if (type === 'pix') {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          form={form}
          name="name"
          label="Nome"
          placeholder="Ex: Pix pessoal"
        />
        <TextField
          form={form}
          name="description"
          label="Descrição"
          placeholder="Ex: Conta principal para recebimentos"
        />
        <TextField
          form={form}
          name="bank"
          label="Banco"
          placeholder="Ex: Banco Inter"
        />
        <PixKeyTypeField form={form} />
        <TextField
          form={form}
          name="pix_key"
          label="Chave Pix"
          placeholder="Ex: email, CPF ou telefone"
        />
      </div>
    )
  }

  if (type === 'debit_card') {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          form={form}
          name="name"
          label="Nome da carteira"
          placeholder="Ex: Débito principal"
        />
        <TextField
          form={form}
          name="description"
          label="Descrição"
          placeholder="Ex: Conta para pagamentos à vista"
        />
        <TextField
          form={form}
          name="bank"
          label="Banco"
          placeholder="Ex: Banco Inter"
        />
        <TextField
          form={form}
          name="agency"
          label="Agência"
          placeholder="Ex: 0001"
        />
        <TextField
          form={form}
          name="account"
          label="Conta"
          placeholder="Ex: 34567-8"
        />
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField
        form={form}
        name="name"
        label="Nome da carteira"
        placeholder="Ex: Caixa pessoal"
      />
      <TextField
        form={form}
        name="description"
        label="Descrição"
        placeholder="Ex: Dinheiro físico"
      />
      <NumberField
        form={form}
        name="current_balance"
        label="Saldo inicial"
        placeholder="Ex: 1000"
      />
      <div className="sm:col-span-2">
        <TextareaField
          form={form}
          name="observations"
          label="Observações"
          placeholder="Ex: Reserva para pequenas despesas presenciais"
        />
      </div>
    </div>
  )
}

function TextField({
  form,
  label,
  name,
  placeholder,
}: {
  form: AddWalletFieldsProps['form']
  label: string
  name: keyof WalletFormInput
  placeholder: string
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              value={String(field.value ?? '')}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function TextareaField({
  form,
  label,
  name,
  placeholder,
}: {
  form: AddWalletFieldsProps['form']
  label: string
  name: keyof WalletFormInput
  placeholder: string
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              value={String(field.value ?? '')}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function NumberField({
  form,
  label,
  name,
  placeholder,
}: {
  form: AddWalletFieldsProps['form']
  label: string
  name: keyof WalletFormInput
  placeholder: string
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={placeholder}
              value={
                field.value === undefined ||
                field.value === null
                  ? ''
                  : Number(field.value)
              }
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
  )
}

function PixKeyTypeField({
  form,
}: {
  form: AddWalletFieldsProps['form']
}) {
  return (
    <FormField
      control={form.control}
      name="pix_key_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo da chave</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={String(field.value ?? 'email')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="phone">Telefone</SelectItem>
                <SelectItem value="random">Chave aleatória</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
