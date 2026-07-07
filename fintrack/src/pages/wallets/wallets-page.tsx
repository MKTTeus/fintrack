import { useMemo, useState } from 'react'

import { AppLayout } from '@/components/layout/app-layout'
import { AddWalletDialog } from '@/features/wallets/components/add-wallet-dialog'
import { WalletDetailsDialog } from '@/features/wallets/components/wallet-details-dialog'
import { WalletSummaryCards } from '@/features/wallets/components/wallet-summary-cards'
import { WalletTable } from '@/features/wallets/components/wallet-table'
import { useWallets } from '@/features/wallets/hooks/use-wallets'
import type { WalletFormData } from '@/features/wallets/schemas/wallet.schema'
import { serializeWalletMetadata } from '@/features/wallets/utils/wallet-metadata'

export function WalletsPage() {
  const {
    createCreditCard,
    createWallet,
    isError,
    isLoading,
    paymentTypes,
    summaries,
    walletGroups,
  } = useWallets()
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
    const wallet = await createWallet.mutateAsync({
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

    if (data.type === 'credit_card') {
      await createCreditCard.mutateAsync({
        wallet_id: wallet.id,
        bank_name: data.bank || null,
        card_name: data.card_name || data.name,
        last_four_digits: data.last_four_digits || null,
        credit_limit: data.credit_limit ?? null,
        closing_day: data.closing_day ?? null,
        due_day: data.due_day ?? null,
      })
    }
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

            <AddWalletDialog
              isCreating={
                createWallet.isPending ||
                createCreditCard.isPending
              }
              onCreate={handleCreateWallet}
              paymentTypes={paymentTypes}
            />
          </div>

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
