import { Trash2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWalletTransfers } from '../hooks/use-wallet-transfers'
import type { WalletItem } from '../types/wallet.types'

function brl(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function WalletTransfersList({ wallets }: { wallets: WalletItem[] }) {
  const { transfers, query, remove } = useWalletTransfers()
  if (query.isLoading) return <p className="text-sm text-muted-foreground">Carregando transferências...</p>
  if (query.isError) return <p role="alert" className="text-sm text-destructive">Não foi possível consultar transferências.</p>
  if (!transfers.length) return (
    <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
      Nenhuma transferência registrada. Movimentações entre suas contas podem ser registradas aqui.
    </p>
  )
  const names = new Map(wallets.map(wallet => [wallet.id, wallet.name]))
  return <div className="space-y-2">
    {transfers.slice(0, 12).map(transfer => (
      <article key={transfer.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
            <span>{names.get(transfer.source_wallet_id) ?? 'Conta arquivada'}</span>
            <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span>{names.get(transfer.destination_wallet_id) ?? 'Conta arquivada'}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {transfer.transfer_date.split('-').reverse().join('/')}
            {transfer.notes ? ` · ${transfer.notes}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{brl(Number(transfer.amount))}</span>
          <Button size="icon" variant="ghost" aria-label="Excluir transferência"
            disabled={remove.isPending}
            onClick={async () => {
              if (!window.confirm('Excluir esta transferência? Os saldos das duas contas serão recalculados.')) return
              try { await remove.mutateAsync(transfer.id) } catch {
                window.alert('Não foi possível excluir a transferência.')
              }
            }}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </article>
    ))}
    {transfers.length > 12 && <p className="text-xs text-muted-foreground">
      Exibindo as 12 transferências mais recentes.
    </p>}
  </div>
}
