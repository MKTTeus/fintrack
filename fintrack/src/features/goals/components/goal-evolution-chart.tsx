import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { Goal } from '../types/goal.types'
import { formatCurrency } from '../utils/goal-formatters'
import { goalToneStyles } from '../utils/goal-styles'

interface GoalEvolutionChartProps {
  goal: Goal
}

const chartColors = {
  amber: '#f59e0b',
  blue: '#2563eb',
  green: '#22c55e',
  pink: '#ef4444',
  purple: '#8b5cf6',
}

export function GoalEvolutionChart({
  goal,
}: GoalEvolutionChartProps) {
  const color = chartColors[goal.tone]
  const gradientId = `goal-gradient-${goal.id}`
  const hasDeposits = goal.progressHistory.length > 0

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h4 className="font-medium tracking-tight">
          Evolução dos depósitos
        </h4>
        <span
          className={`text-sm font-medium ${goalToneStyles[goal.tone].text}`}
        >
          {formatCurrency(goal.currentAmount)}
        </span>
      </div>

      <div className="h-56 w-full">
        {hasDeposits ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={goal.progressHistory}>
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={color}
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="100%"
                    stopColor={color}
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
                tickFormatter={(value) =>
                  `${Number(value) / 1000}k`
                }
              />
              <Tooltip
                formatter={(value) =>
                  formatCurrency(Number(value))
                }
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  color: 'var(--foreground)',
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={color}
                strokeWidth={3}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 text-center text-sm text-muted-foreground">
            Os depósitos aparecerão aqui conforme forem cadastrados.
          </div>
        )}
      </div>
    </div>
  )
}
