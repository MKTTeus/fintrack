import { Plus, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

interface ChartsEmptyStateProps {
  title?: string
  description?: string
}

export function ChartsEmptyState({
  title = 'Gráficos em Construção',
  description = 'Seus dados aparecerão aqui conforme você criar transações',
}: ChartsEmptyStateProps) {
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
      <BarChart3 className="size-10 text-muted-foreground" />

      <h4
        className="
          mt-4
          font-medium
          tracking-tight
        "
      >
        {title}
      </h4>

      <p
        className="
          mt-1
          max-w-sm
          text-sm
          text-muted-foreground
        "
      >
        {description}
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
          Primeira Transação
        </Button>
      </Link>
    </div>
  )
}
