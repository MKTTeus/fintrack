import { Badge } from '@/components/ui/badge'

export function WalletStatusBadge() {
  return (
    <Badge
      variant="ghost"
      className="rounded-full border-transparent bg-income/10 text-income"
    >
      Ativa
    </Badge>
  )
}
