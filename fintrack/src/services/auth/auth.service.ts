import { supabase } from '@/lib/supabase'

export async function signUp(
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: password.trim(),
  })

  if (error) {
    throw error
  }

  return data
}