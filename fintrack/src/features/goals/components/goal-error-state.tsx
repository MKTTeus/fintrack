import { Target } from 'lucide-react'

export function GoalErrorState() {
  return (
    <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
        <Target className="size-8 text-destructive" />
      </div>

      <h2 className="mt-6 text-xl font-medium tracking-tight">
        Não foi possível carregar suas metas
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        Verifique sua conexão e tente novamente em instantes.
      </p>
    </section>
  )
}
