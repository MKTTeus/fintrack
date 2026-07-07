import { zodResolver } from '@hookform/resolvers/zod'
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

import {
  walletEditSchema,
  type WalletEditFormData,
  type WalletEditFormInput,
} from '../schemas/wallet.schema'
import { useCreateCreditCard } from '../hooks/use-create-credit-card'
import { useUpdateCreditCard } from '../hooks/use-update-credit-card'
import { useUpdateWallet } from '../hooks/use-update-wallet'
import type { WalletItem } from '../types/wallet.types'
import {
  parseWalletMetadata,
  serializeWalletMetadata,
} from '../utils/wallet-metadata'

interface WalletEditDialogProps {
  wallet: WalletItem | null
  onOpenChange: (open: boolean) => void
}

export function WalletEditDialog({
  wallet,
  onOpenChange,
}: WalletEditDialogProps) {
  const createCreditCard = useCreateCreditCard()
  const updateCreditCard = useUpdateCreditCard()
  const updateWallet = useUpdateWallet()
  const metadata = parseWalletMetadata(wallet?.description)

  const form = useForm<
    WalletEditFormInput,
    undefined,
    WalletEditFormData
  >({
    resolver: zodResolver(walletEditSchema),
    values: {
      name: wallet?.name ?? '',
      description: metadata.description ?? '',
      bank:
        wallet?.creditCard?.bank_name ??
        metadata.bank ??
        '',
      pix_key_type: metadata.pixKeyType ?? 'email',
      pix_key: metadata.pixKey ?? '',
      agency: metadata.agency ?? '',
      account: metadata.account ?? '',
      observations: metadata.observations ?? '',
      current_balance: undefined,
      card_name:
        wallet?.creditCard?.card_name ??
        wallet?.name ??
        '',
      last_four_digits:
        wallet?.creditCard?.last_four_digits ?? '',
      credit_limit:
        wallet?.creditCard?.credit_limit ?? undefined,
      closing_day:
        wallet?.creditCard?.closing_day ?? undefined,
      due_day: wallet?.creditCard?.due_day ?? undefined,
    },
  })

  async function onSubmit(data: WalletEditFormData) {
    if (!wallet) {
      return
    }

    try {
      await updateWallet.mutateAsync({
        id: wallet.id,
        input: {
          name: data.name,
          description: serializeWalletMetadata({
            agency: data.agency,
            bank: data.bank,
            account: data.account,
            description: data.description,
            observations: data.observations,
            pixKey: data.pix_key,
            pixKeyType: data.pix_key_type,
          }),
          ...(wallet.type === 'cash' &&
            data.current_balance !== undefined && {
              current_balance: data.current_balance,
            }),
        },
      })

      if (wallet.type === 'credit_card') {
        const creditCardInput = {
          wallet_id: wallet.id,
          bank_name: data.bank || null,
          card_name: data.card_name || data.name,
          last_four_digits: data.last_four_digits || null,
          credit_limit: data.credit_limit ?? null,
          closing_day: data.closing_day ?? null,
          due_day: data.due_day ?? null,
        }

        if (wallet.creditCard) {
          await updateCreditCard.mutateAsync({
            id: wallet.creditCard.id,
            input: creditCardInput,
          })
        } else {
          await createCreditCard.mutateAsync(creditCardInput)
        }
      }

      onOpenChange(false)
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível atualizar a carteira.',
      })
    }
  }

  const isSaving =
    updateWallet.isPending ||
    updateCreditCard.isPending ||
    createCreditCard.isPending

  return (
    <Dialog
      open={Boolean(wallet)}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {wallet ? (
          <>
            <DialogHeader>
              <DialogTitle>Editar carteira</DialogTitle>
              <DialogDescription>
                Atualize as informações desta forma de pagamento.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                className="grid gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <WalletEditFields
                  form={form}
                  type={wallet.type}
                />

                {form.formState.errors.root?.message ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.root.message}
                  </p>
                ) : null}

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      type="button"
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function WalletEditFields({
  form,
  type,
}: {
  form: ReturnType<
    typeof useForm<
      WalletEditFormInput,
      undefined,
      WalletEditFormData
    >
  >
  type: WalletItem['type']
}) {
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
  form: ReturnType<
    typeof useForm<
      WalletEditFormInput,
      undefined,
      WalletEditFormData
    >
  >
  label: string
  name: keyof WalletEditFormInput
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
  form: ReturnType<
    typeof useForm<
      WalletEditFormInput,
      undefined,
      WalletEditFormData
    >
  >
  label: string
  name: keyof WalletEditFormInput
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
  form: ReturnType<
    typeof useForm<
      WalletEditFormInput,
      undefined,
      WalletEditFormData
    >
  >
  label: string
  name: keyof WalletEditFormInput
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
  form: ReturnType<
    typeof useForm<
      WalletEditFormInput,
      undefined,
      WalletEditFormData
    >
  >
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
