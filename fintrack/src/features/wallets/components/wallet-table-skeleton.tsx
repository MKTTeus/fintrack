import { walletTableGridClassName } from '../constants/wallet-table-layout'

export function WalletTableSkeleton() {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      <div
        className={`
          hidden
          gap-4
          px-5
          py-4
          text-sm
          text-muted-foreground
          lg:grid
          ${walletTableGridClassName}
        `}
      >
        <span>Carteira</span>
        <span>Transações</span>
        <span>Gasto no mês</span>
        <span>Recebido no mês / Info</span>
        <span className="text-right">Ações</span>
      </div>

      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={`
            grid
            grid-cols-1
            gap-4
            border-t
            border-border
            p-5
            lg:items-center
            ${walletTableGridClassName}
          `}
        >
          <div className="flex items-center gap-4">
            <div className="size-11 animate-pulse rounded-2xl bg-muted/30" />
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted/30" />
              <div className="h-3 w-44 animate-pulse rounded bg-muted/20" />
            </div>
          </div>
          <div className="h-5 w-12 animate-pulse rounded bg-muted/30" />
          <div className="h-5 w-28 animate-pulse rounded bg-muted/30" />
          <div className="h-5 w-32 animate-pulse rounded bg-muted/30" />
          <div className="ml-auto h-8 w-28 animate-pulse rounded-xl bg-muted/30" />
        </div>
      ))}
    </section>
  )
}
