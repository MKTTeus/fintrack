import { Plus, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function DashboardEmptyState() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-dashed
        border-border
        bg-card
        p-12
        text-center
      "
    >
      <div
        className="
          flex
          size-16
          items-center
          justify-center
          rounded-2xl
          bg-primary/10
        "
      >
        <TrendingUp className="size-8 text-primary" />
      </div>

      <h3
        className="
          mt-6
          text-xl
          font-medium
          tracking-tight
        "
      >
        Bem-vindo ao FinTrack! 👋
      </h3>

      <p
        className="
          mt-2
          max-w-sm
          text-sm
          text-muted-foreground
        "
      >
        Comece a rastrear suas transações financeiras agora. Crie sua primeira transação e veja seu dashboard ganhar vida.
      </p>

      <Link to="/transactions">
        <Button
          className="
            mt-6
            gap-2
          "
        >
          <Plus className="size-4" />
          Criar Primeira Transação
        </Button>
      </Link>
    </div>
  )
}
