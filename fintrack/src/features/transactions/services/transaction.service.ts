import { supabase } from '@/lib/supabase'

import type {
CreateTransactionInput,
Transaction,
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

return data as Transaction[]
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
...input,
user_id: user.id,
})
.select()
.single()

if (error) {
throw error
}

return data as Transaction
}
