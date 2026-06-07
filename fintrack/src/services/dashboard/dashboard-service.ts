import {
  balanceChartData,
  expensesChartData,
  metrics,
  transactions,
} from '@/mocks/dashboard/dashboard-data'

import type {
  BalanceChartData,
  ExpenseChartData,
  Metric,
  Transaction,
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
  Transaction[]
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