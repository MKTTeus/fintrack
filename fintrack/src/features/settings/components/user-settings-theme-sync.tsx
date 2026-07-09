import { useEffect } from 'react'

import { useTheme } from 'next-themes'

import { useUserSettings } from '../hooks/use-user-settings'

export function UserSettingsThemeSync() {
  const { setTheme } = useTheme()
  const { data: settings } = useUserSettings()

  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme)
    }
  }, [setTheme, settings?.theme])

  return null
}
