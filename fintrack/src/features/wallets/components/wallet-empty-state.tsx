import { Wallet } from 'lucide-react'

export function WalletEmptyState() {
  return (
    <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
        <Wallet className="size-8 text-primary" />
      </div>

      <h2 className="mt-6 text-xl font-medium tracking-tight">
        Nenhuma carteira encontrada
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        Adicione sua primeira forma de pagamento para acompanhar saldo,
        transações e status em um só lugar.
      </p>
    </section>
  )
}
