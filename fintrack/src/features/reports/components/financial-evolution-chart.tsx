import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { FinancialEvolutionPoint } from '../types/report.types'
import { formatReportCurrency } from '../utils/report-formatters'

interface FinancialEvolutionChartProps {
  data: FinancialEvolutionPoint[]
  isLoading: boolean
  periodLabel: string
}

export function FinancialEvolutionChart({
  data,
  isLoading,
  periodLabel,
}: FinancialEvolutionChartProps) {
  const hasData = data.some(
    (item) => item.income > 0 || item.expense > 0,
  )

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-medium tracking-tight">
            Evolução financeira
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Receitas e despesas nos últimos meses.
          </p>
        </div>

        <span className="w-fit rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted-foreground">
          {periodLabel}
        </span>
      </div>

      <div className="h-[340px] w-full">
        {isLoading ? (
          <div className="h-full w-full animate-pulse rounded-2xl bg-muted" />
        ) : hasData ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={data}
              barGap={6}
              barCategoryGap="28%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.14}
                vertical={false}
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
                tickFormatter={(value) =>
                  `${Number(value) / 1000}k`
                }
              />
              <Tooltip
                cursor={{
                  fill: 'var(--muted)',
                  opacity: 0.18,
                }}
                formatter={(value, name) => [
                  formatReportCurrency(Number(value)),
                  name,
                ]}
                contentStyle={{
                  background: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  color: 'var(--popover-foreground)',
                  boxShadow:
                    '0 18px 60px rgba(0, 0, 0, 0.24)',
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  color: 'var(--muted-foreground)',
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="income"
                name="Receitas"
                fill="var(--income)"
                radius={[8, 8, 2, 2]}
              />
              <Bar
                dataKey="expense"
                name="Despesas"
                fill="var(--expense)"
                radius={[8, 8, 2, 2]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border bg-background/30 p-6 text-center text-sm text-muted-foreground">
            Nenhuma movimentação encontrada para os filtros selecionados.
          </div>
        )}
      </div>
    </section>
  )
}
