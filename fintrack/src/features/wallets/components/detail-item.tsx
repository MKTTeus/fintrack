import type { DetailTone } from '../types/wallet.types'
import { detailToneStyles } from '../utils/wallet-styles'

interface DetailItemProps {
  label: string
  value: string
  tone?: DetailTone
}

export function DetailItem({
  label,
  value,
  tone = 'default',
}: DetailItemProps) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>
      <p
        className={`
          mt-2
          font-medium
          tracking-tight
          ${detailToneStyles[tone]}
        `}
      >
        {value}
      </p>
    </div>
  )
}
