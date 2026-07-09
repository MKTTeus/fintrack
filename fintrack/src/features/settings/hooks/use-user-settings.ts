import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/providers/auth-context'

import {
  getOrCreateUserSettings,
  updateUserSettings,
} from '../services/settings.service'
import type {
  UpdateUserSettingsInput,
  UserSettings,
} from '../types/settings.types'

export function useUserSettings() {
  const { loading, user } = useAuth()
  const queryClient = useQueryClient()

  const settingsQuery = useQuery({
    queryKey: queryKeys.userSettings.details,
    queryFn: getOrCreateUserSettings,
    enabled: !loading && !!user,
  })

  const updateSettings = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData(
        queryKeys.userSettings.details,
        settings,
      )
    },
  })

  function updateSettingsCache(input: UpdateUserSettingsInput) {
    queryClient.setQueryData<UserSettings>(
      queryKeys.userSettings.details,
      (current) =>
        current
          ? {
              ...current,
              ...input,
              updated_at: new Date().toISOString(),
            }
          : current,
    )
  }

  return {
    ...settingsQuery,
    updateSettings,
    updateSettingsCache,
  }
}
