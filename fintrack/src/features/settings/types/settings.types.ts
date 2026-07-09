import type { Database } from '@/types/database.types'

export type UserSettings =
  Database['public']['Tables']['user_settings']['Row']

export type UserSettingsInsert =
  Database['public']['Tables']['user_settings']['Insert']

export type UpdateUserSettingsInput = Pick<
  Database['public']['Tables']['user_settings']['Update'],
  'currency' | 'date_format' | 'display_name' | 'show_cents' | 'theme'
>

export type SettingsCurrency = UserSettings['currency']
export type SettingsDateFormat = UserSettings['date_format']
export type SettingsTheme = UserSettings['theme']

export interface SettingsCardBaseProps {
  settings: UserSettings
  isSaving: boolean
  onUpdate: (input: UpdateUserSettingsInput) => Promise<void>
}
