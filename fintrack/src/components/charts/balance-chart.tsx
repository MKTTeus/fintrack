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

import { ChartContainer } from './chart-container'

export function BalanceChart() {
  const { data, isLoading } =
    useBalanceChart()

  if (isLoading) {
    return (
      <div
        className="
          h-[320px]
          animate-pulse
          rounded-3xl
          bg-card
        "
      />
    )
  }

  return (
    <ChartContainer
      title="Evolução do Saldo"
      description="Crescimento financeiro ao longo do tempo"
    >
      <div className="h-[320px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>
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
            />

            <YAxis
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
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