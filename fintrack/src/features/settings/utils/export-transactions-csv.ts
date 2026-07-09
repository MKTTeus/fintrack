import type { Transaction } from '@/features/transactions/types/transaction.types'

function escapeCsvCell(value: string | number | null) {
  const text = value === null ? '' : String(value)

  return `"${text.replaceAll('"', '""')}"`
}

function buildCsv(transactions: Transaction[]) {
  const header = [
    'Descricao',
    'Categoria',
    'Tipo',
    'Data',
    'Valor',
    'Carteira',
  ]

  const rows = transactions.map((transaction) => [
    transaction.title,
    transaction.category,
    transaction.type === 'income' ? 'Receita' : 'Despesa',
    transaction.transaction_date,
    transaction.amount.toFixed(2).replace('.', ','),
    transaction.wallet_id,
  ])

  return [header, ...rows]
    .map((row) => row.map(escapeCsvCell).join(';'))
    .join('\n')
}

export function exportTransactionsCsv(transactions: Transaction[]) {
  const csv = buildCsv(transactions)
  const blob = new Blob([`\uFEFF${csv}`], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `Transacoes_FinTrack_${date}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
