import type { GoalTone } from '../types/goal.types'
import { goalToneStyles } from '../utils/goal-styles'

interface GoalProgressBarProps {
  progress: number
  tone: GoalTone
}

export function GoalProgressBar({
  progress,
  tone,
}: GoalProgressBarProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
      <div
        className={`
          h-full
          rounded-full
          transition-all
          duration-300
          ${goalToneStyles[tone].progress}
        `}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
