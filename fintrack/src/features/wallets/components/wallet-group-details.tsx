import { useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'

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

import type {
  DetailTone,
  WalletItem,
  WalletType,
} from '../types/wallet.types'
import { useUpdateWallet } from '../hooks/use-update-wallet'

import { DetailItem } from './detail-item'
import { WalletEditDialog } from './wallet-edit-dialog'
import { WalletIcon } from './wallet-icon'
import { WalletStatusBadge } from './wallet-status-badge'

interface WalletGroupDetailsProps {
  wallet: WalletItem
}

const walletTypeLabels = {
  pix: 'Pix',
  debit_card: 'Cartão de Débito',
  credit_card: 'Cartão de Crédito',
  cash: 'Dinheiro',
} satisfies Record<WalletType, string>

function getDynamicTone(tone: WalletItem['dynamicTone']): DetailTone {
  if (tone === 'income') {
    return 'income'
  }

  if (tone === 'primary') {
    return 'primary'
  }

  return 'default'
}

function formatOptionalCurrency(value?: number | null) {
  if (value === undefined || value === null) {
    return 'Não informado'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}

export function WalletGroupDetails({
  wallet,
}: WalletGroupDetailsProps) {
  const linkedWallets = wallet.linkedWallets ?? []
  const updateWallet = useUpdateWallet()
  const [editingWallet, setEditingWallet] =
    useState<WalletItem | null>(null)
  const [deactivatingWallet, setDeactivatingWallet] =
    useState<WalletItem | null>(null)

  async function handleDeactivateWallet() {
    if (!deactivatingWallet) {
      return
    }

    await updateWallet.mutateAsync({
      id: deactivatingWallet.id,
      input: {
        is_active: false,
      },
    })

    setDeactivatingWallet(null)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <DetailItem
            label="Transações"
            value={String(wallet.transactions)}
          />
          <DetailItem
            label="Gasto no mês"
            value={wallet.spentThisMonth}
            tone="expense"
          />
          <DetailItem
            label={wallet.dynamicLabel}
            value={wallet.dynamicValue}
            tone={getDynamicTone(wallet.dynamicTone)}
          />
        </div>

        <div>
          <h3 className="font-medium tracking-tight">
            Carteiras cadastradas
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Itens reais agrupados neste tipo de forma de pagamento.
          </p>
        </div>

        {linkedWallets.length ? (
          <div className="space-y-3">
            {linkedWallets.map((linkedWallet) => (
              <div
                key={linkedWallet.id}
                className="rounded-2xl border border-border p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <WalletIcon wallet={linkedWallet} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium tracking-tight">
                          {linkedWallet.name}
                        </p>
                        <WalletStatusBadge />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {linkedWallet.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-xl"
                      onClick={() =>
                        setEditingWallet(linkedWallet)
                      }
                    >
                      <Edit2 className="size-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-xl text-destructive hover:text-destructive"
                      onClick={() =>
                        setDeactivatingWallet(linkedWallet)
                      }
                    >
                      <Trash2 className="size-4" />
                      Excluir
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <DetailItem
                    label="Tipo"
                    value={walletTypeLabels[linkedWallet.type]}
                  />
                  <DetailItem
                    label="Status"
                    value="Ativa"
                    tone="income"
                  />
                  <DetailItem
                    label="Transações no mês"
                    value={String(linkedWallet.transactions)}
                  />
                  <DetailItem
                    label="Gasto no mês"
                    value={linkedWallet.spentThisMonth}
                    tone="expense"
                  />
                </div>

                {linkedWallet.type === 'pix' &&
                linkedWallet.details.pix ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-4">
                    <DetailItem
                      label="Banco"
                      value={linkedWallet.details.pix.bank}
                    />
                    <DetailItem
                      label="Tipo da chave"
                      value={linkedWallet.details.pix.keyType}
                    />
                    <DetailItem
                      label="Chave Pix"
                      value={linkedWallet.details.pix.key}
                    />
                    <DetailItem
                      label="Nome"
                      value={linkedWallet.details.pix.holder}
                    />
                  </div>
                ) : null}

                {linkedWallet.type === 'debit_card' &&
                linkedWallet.details.debit ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <DetailItem
                      label="Banco"
                      value={linkedWallet.details.debit.bank}
                    />
                    <DetailItem
                      label="Agência"
                      value={linkedWallet.details.debit.agency}
                    />
                    <DetailItem
                      label="Conta"
                      value={linkedWallet.details.debit.account}
                    />
                  </div>
                ) : null}

                {linkedWallet.type === 'credit_card' ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <DetailItem
                      label="Banco"
                      value={
                        linkedWallet.creditCard?.bank_name ??
                        'Não informado'
                      }
                    />
                    <DetailItem
                      label="Nome do cartão"
                      value={
                        linkedWallet.creditCard?.card_name ??
                        'Não informado'
                      }
                    />
                    <DetailItem
                      label="Últimos 4 dígitos"
                      value={
                        linkedWallet.creditCard
                          ?.last_four_digits ??
                        'Não informado'
                      }
                    />
                    <DetailItem
                      label="Limite"
                      value={formatOptionalCurrency(
                        linkedWallet.creditCard?.credit_limit,
                      )}
                    />
                    <DetailItem
                      label="Dia de fechamento"
                      value={
                        linkedWallet.creditCard?.closing_day
                          ? String(
                              linkedWallet.creditCard
                                .closing_day,
                            )
                          : 'Não informado'
                      }
                    />
                    <DetailItem
                      label="Dia de vencimento"
                      value={
                        linkedWallet.creditCard?.due_day
                          ? String(
                              linkedWallet.creditCard.due_day,
                            )
                          : 'Não informado'
                      }
                    />
                  </div>
                ) : null}

                {linkedWallet.type === 'cash' &&
                linkedWallet.details.cash ? (
                  <div className="mt-3">
                    <DetailItem
                      label="Observações"
                      value={linkedWallet.details.cash.notes}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center">
            <p className="font-medium tracking-tight">
              Nenhuma carteira cadastrada neste tipo
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use o botão de adicionar forma de pagamento para criar uma nova.
            </p>
          </div>
        )}
      </div>

      <WalletEditDialog
        wallet={editingWallet}
        onOpenChange={(open) => {
          if (!open) {
            setEditingWallet(null)
          }
        }}
      />

      <Dialog
        open={Boolean(deactivatingWallet)}
        onOpenChange={(open) => {
          if (!open) {
            setDeactivatingWallet(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir carteira?</DialogTitle>
            <DialogDescription>
              Esta carteira será desativada e não aparecerá mais na lista,
              sem apagar o histórico de transações.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeactivateWallet}
              disabled={updateWallet.isPending}
            >
              {updateWallet.isPending
                ? 'Excluindo...'
                : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
