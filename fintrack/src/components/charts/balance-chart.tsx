import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useBalanceChart } from '@/hooks/dashboard/use-balance-chart'
import { ChartsEmptyState } from '@/components/dashboard/charts-empty-state'

import { ChartContainer } from './chart-container'

export function BalanceChart() {
  const { data, isLoading } =
    useBalanceChart()

  if (isLoading) {
    return (
      <div
        className="
          h-[260px] sm:h-[300px] lg:h-[320px]
          animate-pulse
          rounded-3xl
          bg-card
        "
      />
    )
  }

  // Check if all data is empty (all zeros)
  const hasData = data?.some((item) => item.balance !== 0)

  if (!hasData) {
    return (
      <ChartContainer
        title="Evolução do Saldo"
        description="Crescimento financeiro ao longo do tempo"
      >
        <div className="h-[260px] w-full min-w-0 sm:h-[300px] lg:h-[320px]">
          <ChartsEmptyState
            title="Gráfico de Evolução do Saldo"
            description="Conforme você criar transações, poderá acompanhar sua evolução financeira"
          />
        </div>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer
      title="Evolução do Saldo"
      description="Crescimento financeiro ao longo do tempo"
    >
      <div className="h-[260px] sm:h-[300px] lg:h-[320px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient
                id="balanceGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#2563eb"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.15}
            />

            <XAxis
              dataKey="month"
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={12}
            />

            <YAxis
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={55}
              tickFormatter={(value: number) => new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}
            />

            <Tooltip
              formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))}
              contentStyle={{
                background: 'var(--card)',
                border:
                  '1px solid var(--border)',
                borderRadius: '16px',
                color: 'var(--foreground)',
              }}
            />

            <Area
              type="monotone"
              dataKey="balance"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}