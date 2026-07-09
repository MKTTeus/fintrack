import { supabase } from '@/lib/supabase'

import type {
  UpdateUserSettingsInput,
  UserSettings,
  UserSettingsInsert,
} from '../types/settings.types'

function getDefaultDisplayName(email?: string, metadataName?: string) {
  if (metadataName?.trim()) {
    return metadataName.trim()
  }

  if (email) {
    return email.split('@')[0] ?? 'Usuário'
  }

  return 'Usuário'
}

async function getAuthenticatedUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  return user
}

function getDefaultSettingsInput(
  userId: string,
  email?: string,
  metadataName?: string,
): UserSettingsInsert {
  return {
    user_id: userId,
    display_name: getDefaultDisplayName(email, metadataName),
    currency: 'BRL',
    show_cents: true,
    date_format: 'dd/MM/yyyy',
    theme: 'system',
  }
}

export async function getOrCreateUserSettings(): Promise<UserSettings> {
  const user = await getAuthenticatedUser()
  const metadataName =
    typeof user.user_metadata?.name === 'string'
      ? user.user_metadata.name
      : typeof user.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : undefined

  const { data: existingSettings, error: selectError } =
    await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

  if (selectError) {
    throw selectError
  }

  if (existingSettings) {
    return existingSettings
  }

  const { data: createdSettings, error: insertError } =
    await supabase
      .from('user_settings')
      .insert(
        getDefaultSettingsInput(
          user.id,
          user.email,
          metadataName,
        ),
      )
      .select('*')
      .single()

  if (insertError) {
    throw insertError
  }

  return createdSettings
}

export async function updateUserSettings(
  input: UpdateUserSettingsInput,
): Promise<UserSettings> {
  const user = await getAuthenticatedUser()

  const { data, error } = await supabase
    .from('user_settings')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function deleteCurrentUserPublicData(): Promise<void> {
  const user = await getAuthenticatedUser()

  const operations = [
    supabase.from('goal_deposits').delete().eq('user_id', user.id),
    supabase.from('transactions').delete().eq('user_id', user.id),
    supabase.from('credit_cards').delete().eq('user_id', user.id),
    supabase.from('goals').delete().eq('user_id', user.id),
    supabase.from('wallets').delete().eq('user_id', user.id),
    supabase.from('user_settings').delete().eq('user_id', user.id),
  ]

  for (const operation of operations) {
    const { error } = await operation

    if (error) {
      throw error
    }
  }

  /*
   * A exclusão definitiva de auth.users precisa acontecer em uma
   * RPC ou Edge Function segura usando service role. O cliente remove
   * apenas dados públicos cobertos por RLS.
   */
}
