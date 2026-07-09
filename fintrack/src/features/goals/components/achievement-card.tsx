import type { GoalAchievement } from '../types/goal.types'
import { goalToneStyles } from '../utils/goal-styles'

export function AchievementCard({
  title,
  value,
  detail,
  icon: Icon,
  tone,
}: GoalAchievement) {
  const styles = goalToneStyles[tone]

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center gap-4">
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

        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            {title}
          </p>
          <h3 className="mt-1 text-xl font-medium tracking-tight">
            {value}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {detail}
          </p>
        </div>
      </div>
    </div>
  )
}
