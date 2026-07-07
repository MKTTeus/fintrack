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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {wallet ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
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
