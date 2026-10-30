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
    <div className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h3
            className={`
              mt-3
              break-words text-[clamp(1.25rem,2vw,1.75rem)]
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
            size-10 shrink-0 sm:size-12
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
