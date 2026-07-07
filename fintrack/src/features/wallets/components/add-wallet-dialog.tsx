import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'

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
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'

import {
  walletSchema,
  type WalletFormData,
  type WalletFormInput,
} from '../schemas/wallet.schema'
import type {
  PaymentTypeOption,
  WalletType,
} from '../types/wallet.types'

import { AddWalletFields } from './add-wallet-fields'

interface AddWalletDialogProps {
  isCreating?: boolean
  onCreate: (data: WalletFormData) => Promise<void>
  paymentTypes: PaymentTypeOption[]
}

const defaultValues: WalletFormInput = {
  name: '',
  type: 'pix',
  description: '',
  current_balance: 0,
  color: '',
  icon: '',
  bank: '',
  pix_key_type: 'email',
  pix_key: '',
  agency: '',
  account: '',
  observations: '',
  card_name: '',
  last_four_digits: '',
  credit_limit: undefined,
  closing_day: undefined,
  due_day: undefined,
}

export function AddWalletDialog({
  isCreating = false,
  onCreate,
  paymentTypes,
}: AddWalletDialogProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<
    WalletFormInput,
    undefined,
    WalletFormData
  >({
    resolver: zodResolver(walletSchema),
    defaultValues,
  })

  const selectedType = useWatch({
    control: form.control,
    name: 'type',
  })

  function handleSelectType(type: WalletType) {
    form.setValue('type', type)
    form.setValue('name', '')
    form.setValue('description', '')
    form.setValue('current_balance', 0)
    form.setValue('bank', '')
    form.setValue('pix_key_type', 'email')
    form.setValue('pix_key', '')
    form.setValue('agency', '')
    form.setValue('account', '')
    form.setValue('observations', '')
    form.setValue('card_name', '')
    form.setValue('last_four_digits', '')
    form.setValue('credit_limit', undefined)
    form.setValue('closing_day', undefined)
    form.setValue('due_day', undefined)
    form.clearErrors()
  }

  async function onSubmit(data: WalletFormData) {
    try {
      await onCreate(data)

      form.reset(defaultValues)
      setOpen(false)
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível salvar a forma de pagamento.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="size-4" />
          Adicionar forma de pagamento
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Adicionar forma de pagamento
          </DialogTitle>
          <DialogDescription>
            Selecione um tipo e preencha as informações principais.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {paymentTypes.map((paymentType) => {
                const Icon = paymentType.icon
                const isSelected =
                  selectedType === paymentType.type

                return (
                  <button
                    key={paymentType.type}
                    type="button"
                    onClick={() =>
                      handleSelectType(paymentType.type)
                    }
                    className={`
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition-colors
                      ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted/20'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                          flex
                          size-10
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            isSelected
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted/30 text-muted-foreground'
                          }
                        `}
                      >
                        <Icon className="size-5" />
                      </div>

                      <div>
                        <p className="font-medium">
                          {paymentType.label}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {paymentType.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <Separator />

            <AddWalletFields
              form={form}
              type={selectedType}
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
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
