import {
  balanceChartData,
  expensesChartData,
  metrics,
  transactions,
} from '@/mocks/dashboard/dashboard-data'

import type {
  BalanceChartData,
  DashboardTransaction,
  ExpenseChartData,
  Metric,
} from '@/types/dashboard'

export async function getDashboardMetrics(): Promise<
  Metric[]
> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(metrics)
    }, 300)
  })
}

export async function getTransactions(): Promise<
  DashboardTransaction[]
> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(transactions)
    }, 300)
  })
}

export async function getExpensesChartData(): Promise<
  ExpenseChartData[]
> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(expensesChartData)
    }, 300)
  })
}

export async function getBalanceChartData(): Promise<
  BalanceChartData[]
> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(balanceChartData)
    }, 300)
  })
}
