import type { WalletItem } from '../types/wallet.types'
import { walletTableGridClassName } from '../constants/wallet-table-layout'

import { WalletEmptyState } from './wallet-empty-state'
import { WalletErrorState } from './wallet-error-state'
import { WalletRow } from './wallet-row'
import { WalletTableSkeleton } from './wallet-table-skeleton'

interface WalletTableProps {
  wallets: WalletItem[]
  isError?: boolean
  isLoading?: boolean
  onDetails: (wallet: WalletItem) => void
}

export function WalletTable({
  wallets,
  isError = false,
  isLoading = false,
  onDetails,
}: WalletTableProps) {
  if (isLoading) {
    return <WalletTableSkeleton />
  }

  if (isError) {
    return <WalletErrorState />
  }

  if (!wallets.length) {
    return <WalletEmptyState />
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      <div
        className={`
          hidden
          gap-4
          px-5
          py-4
          text-sm
          text-muted-foreground
          lg:grid
          ${walletTableGridClassName}
        `}
      >
        <span>Carteira</span>
        <span>Transações</span>
        <span>Gasto no mês</span>
        <span>Recebido no mês / Info</span>
        <span className="text-right">Ações</span>
      </div>

      {wallets.map((wallet) => (
        <WalletRow
          key={wallet.id}
          wallet={wallet}
          onDetails={onDetails}
        />
      ))}
    </section>
  )
}
