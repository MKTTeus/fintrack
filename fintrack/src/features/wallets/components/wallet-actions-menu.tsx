import { Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { WalletItem } from '../types/wallet.types'

interface WalletActionsMenuProps {
  wallet: WalletItem
  onDetails: (wallet: WalletItem) => void
}

export function WalletActionsMenu({
  wallet,
  onDetails,
}: WalletActionsMenuProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onDetails(wallet)}
      aria-label={`Ver detalhes de ${wallet.name}`}
      className="gap-2 rounded-xl"
    >
      <Eye className="size-4" />
      Ver detalhes
    </Button>
  )
}
