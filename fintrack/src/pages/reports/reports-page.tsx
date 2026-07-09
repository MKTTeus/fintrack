import { useState } from 'react'

import { AppLayout } from '@/components/layout/app-layout'
import { CategoryExpensesCard } from '@/features/reports/components/category-expenses-card'
import { FinancialEvolutionChart } from '@/features/reports/components/financial-evolution-chart'
import { PeriodSummaryCard } from '@/features/reports/components/period-summary-card'
import { PeriodTransactionsTable } from '@/features/reports/components/period-transactions-table'
import { ReportsFilters } from '@/features/reports/components/reports-filters'
import { ReportsSummaryCards } from '@/features/reports/components/reports-summary-cards'
import { WalletUsageCard } from '@/features/reports/components/wallet-usage-card'
import { useReportData } from '@/features/reports/hooks/use-report-data'
import { getDefaultReportFilters } from '@/features/reports/services/report.service'

export function ReportsPage() {
  const [filters, setFilters] = useState(getDefaultReportFilters)
  const {
    data,
    isLoading,
  } = useReportData(filters)

  const filterOptions = data?.filterOptions ?? {
    categories: [{ label: 'Todas', value: 'all' }],
    wallets: [{ label: 'Todas', value: 'all' }],
  }
  const periodLabel = data?.periodLabel ?? 'Este mês'

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <ReportsFilters
          filterOptions={filterOptions}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <ReportsSummaryCards
          isLoading={isLoading}
          summaries={data?.summaries ?? []}
        />

        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.55fr)_minmax(22rem,0.85fr)]">
          <FinancialEvolutionChart
            data={data?.evolution ?? []}
            isLoading={isLoading}
            periodLabel={periodLabel}
          />
          <PeriodSummaryCard
            isLoading={isLoading}
            summary={data?.periodSummary}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <CategoryExpensesCard
            items={data?.categoryExpenses ?? []}
            isLoading={isLoading}
            periodLabel={periodLabel}
          />
          <WalletUsageCard
            items={data?.walletUsage ?? []}
            isLoading={isLoading}
            periodLabel={periodLabel}
          />
        </div>

        <PeriodTransactionsTable
          isLoading={isLoading}
          transactions={data?.transactions ?? []}
        />
      </div>
    </AppLayout>
  )
}
