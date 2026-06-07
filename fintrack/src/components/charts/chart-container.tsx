import type { ReactNode } from 'react'

interface ChartContainerProps {
  title: string
  description: string
  children: ReactNode
}

export function ChartContainer({
  title,
  description,
  children,
}: ChartContainerProps) {
  return (
    <section
      className="
        rounded-3xl
        border
        border-border
        bg-card
        p-6
      "
    >
      <div className="mb-8">
        <h2
          className="
            text-xl
            font-medium
            tracking-tight
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-muted-foreground
          "
        >
          {description}
        </p>
      </div>

      {children}
    </section>
  )
}