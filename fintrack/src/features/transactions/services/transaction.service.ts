import { supabase } from '@/lib/supabase'

import type {
CreateTransactionInput,
Transaction,
UpdateTransactionInput,
} from '../types/transaction.types'

export async function getTransactions(): Promise<Transaction[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  const pageSize = 500
  const result: Transaction[] = []
  for (let page = 0; page < 200; page++) {
    const { data, error } = await supabase.from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .order('id', { ascending: true })
      .range(page * pageSize, (page + 1) * pageSize - 1)
    if (error) throw error
    result.push(...(data ?? []))
    if ((data ?? []).length < pageSize) return result
  }
  throw new Error('Histórico muito grande para leitura completa; reduza o período ou consulte o suporte.')
}

export async function createTransaction(
input: CreateTransactionInput
): Promise<Transaction> {
const {
data: { user },
} = await supabase.auth.getUser()

if (!user) {
throw new Error('Usuário não autenticado')
}

const {
data,
error,
} = await supabase
.from('transactions')
.insert({
title: input.title,
amount: input.amount,
type: input.type,
category: input.category,
transaction_date: input.transaction_date,
wallet_id: input.wallet_id,
user_id: user.id,
})
.select()
.single()

if (error) {
throw error
}

return data
}

export async function updateTransaction(
id: string,
input: UpdateTransactionInput
): Promise<Transaction> {
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Usuário não autenticado')
const {
data,
error,
} = await supabase
.from('transactions')
.update({
...(input.title !== undefined && {
  title: input.title,
}),
...(input.amount !== undefined && {
  amount: input.amount,
}),
...(input.type !== undefined && {
  type: input.type,
}),
...(input.category !== undefined && {
  category: input.category,
}),
...(input.transaction_date !== undefined && {
  transaction_date: input.transaction_date,
}),
...(input.wallet_id !== undefined && {
  wallet_id: input.wallet_id,
}),
})
.eq('id', id)
.eq('user_id', user.id)
.select()
.single()

if (error) {
throw error
}

return data
}

export async function deleteTransaction(
id: string
): Promise<void> {
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Usuário não autenticado')
const { error } = await supabase
.from('transactions')
.delete()
.eq('id', id)
.eq('user_id', user.id)

if (error) {
throw error
}
}
