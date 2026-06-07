import { QueryClientProvider } from '@tanstack/react-query'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import type { ReactNode } from 'react'

import { ThemeProvider } from '@/providers/theme-provider'

import { queryClient } from '@/lib/react-query'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}

        <ReactQueryDevtools
          initialIsOpen={false}
        />
      </QueryClientProvider>
    </ThemeProvider>
  )
}