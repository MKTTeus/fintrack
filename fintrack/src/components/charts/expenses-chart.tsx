import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useExpensesChart } from '@/hooks/dashboard/use-expenses-chart'
import { ChartsEmptyState } from '@/components/dashboard/charts-empty-state'

import { ChartContainer } from './chart-container'

export function ExpensesChart() {
  const { data, isLoading } =
    useExpensesChart()

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

  // Check if all data is empty (all zeros)
  const hasData = data?.some(
    (item) => item.income > 0 || item.expense > 0
  )

  if (!hasData) {
    return (
      <ChartContainer
        title="Receitas vs Despesas"
        description="Comparação financeira dos últimos meses"
      >
        <div className="h-[320px] w-full">
          <ChartsEmptyState
            title="Gráfico de Receitas e Despesas"
            description="Seus dados aparecerão aqui conforme você criar transações"
          />
        </div>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer
      title="Receitas vs Despesas"
      description="Comparação financeira dos últimos meses"
    >
      <div className="h-[320px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
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

            <Legend />

            <Line
              type="monotone"
              dataKey="income"
              name="Receitas"
              stroke="#22c97e"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="expense"
              name="Despesas"
              stroke="#f25c5c"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}