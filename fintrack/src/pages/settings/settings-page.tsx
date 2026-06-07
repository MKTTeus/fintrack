import { AppLayout } from '@/components/layout/app-layout'

export function SettingsPage() {
  return (
    <AppLayout>
      <div>
        <h1
          className="
            text-3xl
            font-medium
            tracking-tight
          "
        >
          Configurações
        </h1>

        <p
          className="
            mt-1
            text-muted-foreground
          "
        >
          Personalize sua experiência 
        </p>
      </div>
    </AppLayout>
  )
}