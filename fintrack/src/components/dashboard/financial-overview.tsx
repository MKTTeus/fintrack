import {
  ArrowDown,
  ArrowUp,
  DollarSign,
} from 'lucide-react'

import { useDashboardMetrics } from '@/hooks/dashboard/use-dashboard-metrics'

import { MetricCard } from './metric-card'

const icons = {
  'Saldo Total': DollarSign,
  Receitas: ArrowUp,
  Despesas: ArrowDown,
}

export function FinancialOverview() {
  const { data, isLoading } =
    useDashboardMetrics()

  if (isLoading) {
    return (
      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="
              h-[140px]
              animate-pulse
              rounded-3xl
              bg-card
            "
          />
        ))}
      </div>
    )
  }

  return (
    <section
      className="
        grid
        grid-cols-1
        gap-6
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {data?.map((metric) => {
        const Icon =
          icons[
            metric.title as keyof typeof icons
          ]

        return (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={Icon}
            variant={metric.variant}
          />
        )
      })}
    </section>
  )
}