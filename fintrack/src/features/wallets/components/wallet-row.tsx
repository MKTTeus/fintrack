import type { WalletItem } from '../types/wallet.types'
import { walletTableGridClassName } from '../constants/wallet-table-layout'
import { dynamicToneStyles } from '../utils/wallet-styles'

import { WalletActionsMenu } from './wallet-actions-menu'
import { WalletIcon } from './wallet-icon'
import { WalletStatusBadge } from './wallet-status-badge'

interface WalletRowProps {
  wallet: WalletItem
  onDetails: (wallet: WalletItem) => void
}

export function WalletRow({
  wallet,
  onDetails,
}: WalletRowProps) {
  return (
    <div
      className={`
        grid
        grid-cols-1
        gap-4
        border-t
        border-border
        p-5
        transition-colors
        hover:bg-muted/20
        lg:items-center
        ${walletTableGridClassName}
      `}
    >
      <div className="flex min-w-0 items-center gap-4">
        <WalletIcon wallet={wallet} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium tracking-tight">
              {wallet.name}
            </h3>

            <WalletStatusBadge />
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {wallet.description}
          </p>
        </div>
      </div>

      <div>
        <p className="text-lg font-medium tracking-tight">
          {wallet.transactions}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Este mês
        </p>
      </div>

      <div>
        <p className="text-lg font-medium tracking-tight text-destructive">
          {wallet.spentThisMonth}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {wallet.spentHint}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          {wallet.dynamicLabel}
        </p>
        <p
          className={`
            mt-1
            text-lg
            font-medium
            tracking-tight
            ${dynamicToneStyles[wallet.dynamicTone]}
          `}
        >
          {wallet.dynamicValue}
        </p>
        {wallet.dynamicHint ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {wallet.dynamicHint}
          </p>
        ) : null}
      </div>

      <div className="flex justify-end">
        <WalletActionsMenu wallet={wallet} onDetails={onDetails} />
      </div>
    </div>
  )
}
