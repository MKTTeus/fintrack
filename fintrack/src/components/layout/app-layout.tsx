import type { ReactNode } from 'react'

import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div
      className="
        min-h-screen
        bg-background
        text-foreground
      "
    >
      <div className="flex">
        <AppSidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <AppHeader />

          <main
            className="
              flex-1
              p-8
            "
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}