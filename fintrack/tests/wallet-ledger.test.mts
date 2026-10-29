import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getAvailableWalletBalance, getCardOutstanding, getOpenCardCycle,
  getOpenCycleCharges, getTotalAvailableBalance,
} from '../src/features/wallets/utils/wallet-ledger.ts'
import { calculateCumulativeBalance } from '../src/services/dashboard/dashboard-aggregation.ts'

// The ledger accepts these minimal projections; cast only at the test boundary.
const cashA = { id: 'a', type: 'pix', current_balance: 100, is_active: true }
const cashB = { id: 'b', type: 'debit_card', current_balance: 50, is_active: true }
const creditWallet = { id: 'c', type: 'credit_card', current_balance: 0, is_active: true }
const card = { id: 'card-a', wallet_id: 'c', closing_day: 10 }

function transaction(wallet_id: string, type: 'income' | 'expense', amount: number, transaction_date = '2026-10-08') {
  return { wallet_id, type, amount, transaction_date }
}
const rows = [
  transaction('a', 'income', 40),
  transaction('a', 'expense', 10),
  transaction('c', 'expense', 100),
]
const transfers = [{
  source_wallet_id: 'a', destination_wallet_id: 'b', amount: 30,
}]
const payments = [{
  credit_card_id: 'card-a', source_wallet_id: 'b', amount: 20,
}]

test('opening balance + cash movements, without double counting credit spending', () => {
  const a = getAvailableWalletBalance(cashA as any, rows as any, transfers as any, payments as any)
  const b = getAvailableWalletBalance(cashB as any, rows as any, transfers as any, payments as any)
  assert.equal(a, 100)
  assert.equal(b, 60)
  assert.equal(getTotalAvailableBalance([cashA, cashB, creditWallet] as any, rows as any,
    transfers as any, payments as any), 160)
  // 150 starting cash + 40 income - 10 debit spend - 20 credit settlement = 160.
})

test('credit outstanding accounts for refunds and cash payments', () => {
  const charges = [
    transaction('c', 'expense', 100), transaction('c', 'expense', 50),
    transaction('c', 'income', 20),
  ]
  assert.equal(getCardOutstanding(card as any, charges as any, [
    { credit_card_id: 'card-a', amount: 40 },
  ] as any), 90)
  assert.equal(getCardOutstanding(card as any, charges as any, [
    { credit_card_id: 'card-a', amount: 200 },
  ] as any), 0)
})

test('a transfer only reassigns cash between accounts', () => {
  const all = [cashA, cashB]
  assert.equal(getTotalAvailableBalance(all as any, [], transfers as any), 150)
  assert.equal(getAvailableWalletBalance(cashA as any, [], transfers as any), 70)
  assert.equal(getAvailableWalletBalance(cashB as any, [], transfers as any), 80)
})

test('closing day includes the entire day and creates the next cycle afterwards', () => {
  const closing = getOpenCardCycle(10, new Date(2026, 9, 10, 23, 45))
  assert.deepEqual(closing, {
    start: '2026-09-11', end: '2026-10-10', closingDate: '2026-10-10',
  })
  const next = getOpenCardCycle(10, new Date(2026, 9, 11, 10))
  assert.deepEqual(next, {
    start: '2026-10-11', end: '2026-11-10', closingDate: '2026-11-10',
  })
  assert.equal(getOpenCycleCharges(card as any, [
    transaction('c', 'expense', 10, '2026-10-10'),
    transaction('c', 'expense', 20, '2026-10-11'),
  ] as any, new Date(2026, 9, 10, 23)), 10)
})

test('historical transactions before last 12 months are retained in cumulative balance', () => {
  const data = [
    transaction('a', 'income', 100, '2025-01-03'),
    ...Array.from({ length: 13 }, (_, i) =>
      transaction('a', 'income', 1,
        `${2025 + Math.floor((i+1)/12)}-${String((i+1)%12+1).padStart(2,'0')}-10`)),
  ]
  const points = calculateCumulativeBalance(data, 40)
  assert.equal(points.length, 12)
  assert.equal(points.at(-1)?.balance, 153)
})
