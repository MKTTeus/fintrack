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
      <div className="flex min-w-0">
        <AppSidebar />

        <div className="flex min-h-[100dvh] min-w-0 flex-1 flex-col">
          <AppHeader />

          <main className="min-w-0 flex-1 px-3 pb-28 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-8 xl:px-10">
            {children}
          </main>
        </div>
      </div>

      <AppBottomNavigation />
    </div>
  )
}