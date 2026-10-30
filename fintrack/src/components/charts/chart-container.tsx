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
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        p-4 sm:p-6
      "
    >
      <div className="mb-4 min-w-0 sm:mb-6">
        <h2
          className="
            text-lg sm:text-xl
            font-semibold
            tracking-tight
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-xs sm:text-sm
            leading-relaxed
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