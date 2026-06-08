import { QueryClientProvider } from '@tanstack/react-query'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import type { ReactNode } from 'react'

import { queryClient } from '@/lib/react-query'

import { AuthProvider } from '@/providers/auth-provider'
import { ThemeProvider } from '@/providers/theme-provider'

interface AppProvidersProps {
children: ReactNode
}

export function AppProviders({
children,
}: AppProvidersProps) {
return (<ThemeProvider> 
          <QueryClientProvider client={queryClient}> 
            <AuthProvider>
              {children} 
            </AuthProvider>

            <ReactQueryDevtools
              initialIsOpen={false}
            />
          </QueryClientProvider>
        </ThemeProvider>)
}
