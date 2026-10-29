import { useState } from 'react'
import { Pencil, Wallet, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { WalletItem } from '../types/wallet.types'
import { WalletIcon } from './wallet-icon'
import { WalletEditDialog } from './wallet-edit-dialog'
import { CreditCardPaymentDialog } from './credit-card-payment-dialog'
import { useUpdateWallet } from '../hooks/use-update-wallet'

export function WalletAccountsGrid({ wallets }: { wallets: WalletItem[] }) {
  const [editing, setEditing] = useState<WalletItem | null>(null)
  const [error, setError] = useState('')
  const update = useUpdateWallet()

  async function archive(wallet: WalletItem) {
    if (!window.confirm(
      `Arquivar "${wallet.name}"? Ela deixará de contar no saldo disponível e sairá da lista de contas ativas. O histórico permanece no FinTrack.`
    )) return
    setError('')
    try {
      await update.mutateAsync({ id: wallet.id, input: { is_active: false } })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível arquivar a carteira.')
    }
  }

  if (!wallets.length) {
    return <div className="rounded-2xl border border-dashed p-7 text-center text-sm text-muted-foreground">
      Nenhuma conta cadastrada. Adicione uma carteira para acompanhar seu saldo.
    </div>
  }

  return (
    <>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {wallets.map(wallet => (
          <article key={wallet.id} className="flex min-w-0 flex-col justify-between rounded-[22px] border border-border bg-card p-4 shadow-sm sm:p-5">
            <div>
              <div className="flex items-center gap-3">
                <WalletIcon wallet={wallet} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-foreground" title={wallet.name}>{wallet.name}</h3>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{wallet.description}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs text-muted-foreground">{wallet.currentHint}</p>
                <p className="mt-1 break-words text-[clamp(1.45rem,2vw,1.85rem)] font-semibold tracking-tight">
                  {wallet.currentValue}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-3 text-xs">
                <span className="text-muted-foreground">Saídas no mês</span>
                <span className="font-medium">{wallet.spentThisMonth}</span>
              </div>
              {wallet.type === 'credit_card' && (
                <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground">Fatura do ciclo (estimada)</span>
                  <span className="font-medium">{wallet.details.credit?.invoice ?? 'Não informado'}</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button variant="outline" className="h-9 gap-1.5 rounded-xl" onClick={() => setEditing(wallet)}>
                <Pencil className="size-3.5" /> Editar
              </Button>
              {wallet.type === 'credit_card' && (
                <CreditCardPaymentDialog cardWallet={wallet} wallets={wallets} />
              )}
              <Button variant="ghost" size="sm" className="h-9 gap-1.5 rounded-xl text-muted-foreground"
                disabled={update.isPending} onClick={() => archive(wallet)}>
                <Archive className="size-3.5" /> Arquivar
              </Button>
            </div>
          </article>
        ))}
      </div>
      <WalletEditDialog wallet={editing} onOpenChange={open => { if (!open) setEditing(null) }} />
      <p className="text-xs leading-5 text-muted-foreground">
        O saldo estimado considera o saldo inicial cadastrado e as movimentações registradas.
        Cartões exibem dívidas em aberto e não integram o saldo disponível das contas.
        <Wallet className="ml-1 inline size-3" aria-hidden="true" />
      </p>
    </>
  )
}
