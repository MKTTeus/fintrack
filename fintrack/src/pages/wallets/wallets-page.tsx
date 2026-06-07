import { AppLayout } from '@/components/layout/app-layout'

export function WalletsPage() {
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
          Carteiras
        </h1>

        <p
          className="
            mt-1
            text-muted-foreground
          "
        >
          Gerencie suas contas financeiras
        </p>
      </div>
    </AppLayout>
  )
}