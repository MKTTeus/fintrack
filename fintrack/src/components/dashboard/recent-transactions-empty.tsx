import { Plus, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function RecentTransactionsEmpty() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-border
        bg-muted/30
        py-12
        text-center
      "
    >
      <Wallet className="size-10 text-muted-foreground" />

      <h4
        className="
          mt-4
          font-medium
          tracking-tight
        "
      >
        Nenhuma transação ainda
      </h4>

      <p
        className="
          mt-1
          text-sm
          text-muted-foreground
        "
      >
        Suas transações recentes aparecerão aqui
      </p>

      <Link to="/transactions">
        <Button
          variant="outline"
          size="sm"
          className="
            mt-4
            gap-2
          "
        >
          <Plus className="size-3" />
          Adicionar Transação
        </Button>
      </Link>
    </div>
  )
}
