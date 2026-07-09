import { useQueryClient } from '@tanstack/react-query'
import { useTheme } from 'next-themes'

import { AppLayout } from '@/components/layout/app-layout'
import { AccountSettingsCard } from '@/features/settings/components/account-settings-card'
import { AppearanceSettingsCard } from '@/features/settings/components/appearance-settings-card'
import { DataSettingsCard } from '@/features/settings/components/data-settings-card'
import { FinancialPreferencesCard } from '@/features/settings/components/financial-preferences-card'
import { ProfileSettingsCard } from '@/features/settings/components/profile-settings-card'
import {
  SettingsCardsSkeleton,
  SettingsErrorState,
} from '@/features/settings/components/settings-page-state'
import { useUserSettings } from '@/features/settings/hooks/use-user-settings'
import type {
  UpdateUserSettingsInput,
  UserSettings,
} from '@/features/settings/types/settings.types'
import { queryKeys } from '@/lib/query-keys'

export function SettingsPage() {
  const queryClient = useQueryClient()
  const { setTheme } = useTheme()
  const {
    data: settings,
    isError,
    isLoading,
    updateSettings,
    updateSettingsCache,
  } = useUserSettings()

  async function handleUpdateSettings(
    input: UpdateUserSettingsInput,
  ) {
    const previousSettings = settings

    if (input.theme) {
      setTheme(input.theme)
    }

    updateSettingsCache(input)

    try {
      await updateSettings.mutateAsync(input)
    } catch (error) {
      if (previousSettings) {
        queryClient.setQueryData<UserSettings>(
          queryKeys.userSettings.details,
          previousSettings,
        )

        if (input.theme) {
          setTheme(previousSettings.theme)
        }
      }

      throw error
    }
  }

  return (
    <AppLayout>
      {isLoading ? <SettingsCardsSkeleton /> : null}

      {isError ? <SettingsErrorState /> : null}

      {settings && !isLoading && !isError ? (
        <div className="flex flex-col gap-4">
          <ProfileSettingsCard
            isSaving={updateSettings.isPending}
            settings={settings}
            onUpdate={handleUpdateSettings}
          />
          <FinancialPreferencesCard
            isSaving={updateSettings.isPending}
            settings={settings}
            onUpdate={handleUpdateSettings}
          />
          <AppearanceSettingsCard
            isSaving={updateSettings.isPending}
            settings={settings}
            onUpdate={handleUpdateSettings}
          />
          <DataSettingsCard />
          <AccountSettingsCard />
        </div>
      ) : null}
    </AppLayout>
  )
}
