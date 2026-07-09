import type { ReactNode } from 'react'

import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'
import { AppBottomNavigation } from './app-bottom-navigation'
import { UserSettingsThemeSync } from '@/features/settings/components/user-settings-theme-sync'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div
      className="
        min-h-[100dvh]
        bg-background
        text-foreground
      "
    >
      <UserSettingsThemeSync />
      <div className="flex">
        <AppSidebar />

        <div className="flex min-h-[100dvh] flex-1 flex-col">
          <AppHeader />

          <main className="flex-1 pb-24 px-4 py-4 sm:px-6 lg:px-8 lg:pb-8">
            {children}
          </main>
        </div>
      </div>

      <AppBottomNavigation />
    </div>
  )
}