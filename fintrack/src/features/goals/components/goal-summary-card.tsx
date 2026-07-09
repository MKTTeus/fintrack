import type { GoalSummary } from '../types/goal.types'
import { goalSummaryVariantStyles } from '../utils/goal-styles'

export function GoalSummaryCard({
  title,
  value,
  fullValue,
  detail,
  icon: Icon,
  variant,
}: GoalSummary) {
  const styles = goalSummaryVariantStyles[variant]

  return (
    <div className="group rounded-3xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <div className="relative mt-3 max-w-full">
            <h3
              tabIndex={fullValue ? 0 : undefined}
              aria-label={fullValue ?? value}
              className={`
                max-w-full
                overflow-hidden
                whitespace-nowrap
                text-3xl
                font-medium
                tracking-tight
                outline-none
                ${styles.value}
              `}
            >
              {value}
            </h3>

            {fullValue ? (
              <div
                className="
                  pointer-events-none
                  absolute
                  left-0
                  top-full
                  z-20
                  mt-2
                  rounded-xl
                  border
                  border-border
                  bg-popover
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-popover-foreground
                  opacity-0
                  shadow-lg
                  transition-opacity
                  duration-150
                  group-hover:opacity-100
                  group-focus-within:opacity-100
                "
              >
                {fullValue}
              </div>
            ) : null}
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {detail}
          </p>
        </div>

        <div
          className={`
            flex
            size-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            ${styles.icon}
          `}
        >
          <Icon className="size-6" />
        </div>
      </div>
    </div>
  )
}
