import { Trash2, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCreditCardPayments } from '../hooks/use-credit-card-payments'
import type { WalletItem } from '../types/wallet.types'

const brl = (value: number) => new Intl.NumberFormat(
  'pt-BR', { style: 'currency', currency: 'BRL' },
).format(value)

export function CreditCardPaymentsList({ wallets }: { wallets: WalletItem[] }) {
  const { payments, query, remove } = useCreditCardPayments()
  if (query.isLoading) return <p className="text-sm text-muted-foreground">Carregando pagamentos...</p>
  if (query.isError) return <p role="alert" className="text-sm text-destructive">Não foi possível consultar os pagamentos de cartão.</p>
  if (!payments.length) return (
    <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
      Nenhum pagamento de cartão registrado. Ao pagar uma fatura, registre aqui para reduzir a dívida sem duplicar despesas.
    </div>
  )
  const names = new Map(wallets.map(w => [w.id, w.name]))
  const cardNames = new Map(wallets.filter(w => w.creditCard)
    .map(w => [w.creditCard!.id, w.name]))
  return <div className="space-y-2">
    {payments.slice(0, 12).map(payment => (
      <article key={payment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium">
            <CreditCard className="size-4 text-primary" aria-hidden="true" />
            {cardNames.get(payment.credit_card_id) ?? 'Cartão arquivado'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {payment.payment_date.split('-').reverse().join('/')} · Pago com {names.get(payment.source_wallet_id) ?? 'Conta arquivada'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{brl(Number(payment.amount))}</span>
          <Button size="icon" variant="ghost" disabled={remove.isPending}
            aria-label="Desfazer registro de pagamento"
            onClick={async () => {
              if (!window.confirm('Desfazer este registro de pagamento? O saldo da conta e a dívida do cartão serão recalculados.')) return
              try { await remove.mutateAsync(payment.id) } catch {
                window.alert('Não foi possível desfazer este pagamento.')
              }
            }}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </article>
    ))}
    {payments.length > 12 && <p className="text-xs text-muted-foreground">Exibindo os 12 pagamentos mais recentes.</p>}
  </div>
}
