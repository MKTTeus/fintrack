import { Button } from '@/components/ui/button'

export function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-10">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <div className="flex flex-wrap gap-4">
          <Button>
            Default
          </Button>

          <Button variant="outline">
            Outline
          </Button>

          <Button variant="secondary">
            Secondary
          </Button>

          <Button variant="destructive">
            Destructive
          </Button>

          <Button variant="ghost">
            Ghost
          </Button>

          <Button variant="link">
            Link
          </Button>

          <Button size="sm">
            Small
          </Button>

          <Button size="lg">
            Large
          </Button>
        </div>
      </div>
    </main>
  )
}