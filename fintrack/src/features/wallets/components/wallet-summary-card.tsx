import type { WalletSummary } from '../types/wallet.types'
import { summaryVariantStyles } from '../utils/wallet-styles'

export function WalletSummaryCard({
  title,
  value,
  detail,
  icon: Icon,
  variant,
}: WalletSummary) {
  const styles = summaryVariantStyles[variant]

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h3
            className={`
              mt-3
              text-3xl
              font-medium
              tracking-tight
              ${styles.value}
            `}
          >
            {value}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {detail}
          </p>
        </div>

        <div
          className={`
            flex
            size-12
            items-center
            justify-center
            rounded-2xl
            ${styles.icon}
          `}
        >
          <Icon className="size-6" />
        </div>
      </div>
    </div>
  )
}
