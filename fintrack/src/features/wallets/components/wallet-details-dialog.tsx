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
import { Separator } from '@/components/ui/separator'

import type { WalletItem } from '../types/wallet.types'

import { WalletGroupDetails } from './wallet-group-details'
import { WalletIcon } from './wallet-icon'

interface WalletDetailsDialogProps {
  wallet: WalletItem | null
  onOpenChange: (open: boolean) => void
}

export function WalletDetailsDialog({
  wallet,
  onOpenChange,
}: WalletDetailsDialogProps) {
  return (
    <Dialog open={Boolean(wallet)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-1.5rem)] min-w-0 overflow-x-hidden overflow-y-auto rounded-2xl p-4 sm:max-w-2xl sm:p-6">
        {wallet ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex min-w-0 items-center gap-3 break-words text-lg sm:text-xl">
                <WalletIcon wallet={wallet} />
                Detalhes - {wallet.name}
              </DialogTitle>
              <DialogDescription>
                Resumo visual das carteiras agrupadas por tipo.
              </DialogDescription>
            </DialogHeader>

            <Separator />

            <WalletGroupDetails wallet={wallet} />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
