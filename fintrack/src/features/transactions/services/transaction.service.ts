import { supabase } from '@/lib/supabase'

import type {
CreateTransactionInput,
Transaction,
UpdateTransactionInput,
} from '../types/transaction.types'

export async function getTransactions(): Promise<Transaction[]> {
const {
data,
error,
} = await supabase
.from('transactions')
.select('*')
.order('transaction_date', { ascending: false })

if (error) {
throw error
}

return data
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
})
.eq('id', id)
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
const { error } = await supabase
.from('transactions')
.delete()
.eq('id', id)

if (error) {
throw error
}
}
