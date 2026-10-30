import { useMemo, useState } from 'react'

import { AppLayout } from '@/components/layout/app-layout'
import { AddWalletDialog } from '@/features/wallets/components/add-wallet-dialog'
import { WalletDetailsDialog } from '@/features/wallets/components/wallet-details-dialog'
import { WalletSummaryCards } from '@/features/wallets/components/wallet-summary-cards'
import { WalletAccountsGrid } from '@/features/wallets/components/wallet-accounts-grid'
import { WalletTransferDialog } from '@/features/wallets/components/wallet-transfer-dialog'
import { WalletTransfersList } from '@/features/wallets/components/wallet-transfers-list'
import { CreditCardPaymentsList } from '@/features/wallets/components/credit-card-payments-list'
import { useCreateCreditWalletWithCard } from '@/features/wallets/hooks/use-create-credit-wallet-with-card'
import { WalletTable } from '@/features/wallets/components/wallet-table'
import { useWallets } from '@/features/wallets/hooks/use-wallets'
import type { WalletFormData } from '@/features/wallets/schemas/wallet.schema'
import { serializeWalletMetadata } from '@/features/wallets/utils/wallet-metadata'

export function WalletsPage() {
  const {
    createWallet,
    isError,
    isLoading,
    paymentTypes,
    summaries,
    wallets,
    walletGroups,
  } = useWallets()
  const createCreditWallet = useCreateCreditWalletWithCard()
  const [selectedWalletId, setSelectedWalletId] =
    useState<string | null>(null)

  const selectedWallet = useMemo(
    () =>
      walletGroups.find(
        (wallet) => wallet.id === selectedWalletId,
      ) ?? null,
    [selectedWalletId, walletGroups],
  )

  async function handleCreateWallet(data: WalletFormData) {
    if (data.type === 'credit_card') {
      if (!data.bank?.trim()) throw new Error('Informe o banco para cadastrar o cartão.')
      await createCreditWallet.mutateAsync({
        name: data.name,
        description: serializeWalletMetadata({
          bank: data.bank, description: data.description, observations: data.observations,
        }),
        bank_name: data.bank.trim(),
        card_name: data.card_name?.trim() || data.name,
        last_four_digits: data.last_four_digits?.trim() || null,
        credit_limit: data.credit_limit ?? null,
        closing_day: data.closing_day ?? null,
        due_day: data.due_day ?? null,
      })
      return
    }
    await createWallet.mutateAsync({
      name: data.name,
      type: data.type,
      description: serializeWalletMetadata({
        agency: data.agency,
        bank: data.bank,
        account: data.account,
        description: data.description,
        observations: data.observations,
        pixKey: data.pix_key,
        pixKeyType: data.pix_key_type,
      }),
      current_balance: data.current_balance ?? 0,
      color: null,
      icon: null,
    })

  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <WalletSummaryCards summaries={summaries} />

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-medium tracking-tight">
                Suas carteiras
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Acompanhe saldos, movimentações e informações detalhadas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
            <WalletTransferDialog wallets={wallets} />
            <AddWalletDialog
              isCreating={
                createWallet.isPending ||
                createCreditWallet.isPending
              }
              onCreate={handleCreateWallet}
              paymentTypes={paymentTypes}
            />
            </div>
          </div>

          {isError ? (
            <p role="alert" className="text-sm text-destructive">Não foi possível carregar todas as informações das carteiras.</p>
          ) : isLoading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-muted" />
          ) : (
            <WalletAccountsGrid wallets={wallets} />
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Transferências recentes</h2>
          <WalletTransfersList wallets={wallets} />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Pagamentos de cartão recentes</h2>
          <CreditCardPaymentsList wallets={wallets} />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Resumo por tipo de carteira</h2>
          <WalletTable
            isError={isError}
            isLoading={isLoading}
            wallets={walletGroups}
            onDetails={(wallet) =>
              setSelectedWalletId(wallet.id)
            }
          />
        </section>

        <WalletDetailsDialog
          wallet={selectedWallet}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedWalletId(null)
            }
          }}
        />
      </div>
    </AppLayout>
  )
}
