import { FinancialOverview } from '@/components/dashboard/financial-overview'

import { RecentTransactions } from '@/components/dashboard/recent-transactions'

import { BalanceChart } from '@/components/charts/balance-chart'

import { ExpensesChart } from '@/components/charts/expenses-chart'

import { AppLayout } from '@/components/layout/app-layout'

export function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Metrics */}
        <FinancialOverview />

        {/* Charts */}
        <div
          className="
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-2
          "
        >
          <ExpensesChart />

          <BalanceChart />
        </div>

        {/* Transactions */}
        <RecentTransactions />
      </div>
    </AppLayout>
  )
}