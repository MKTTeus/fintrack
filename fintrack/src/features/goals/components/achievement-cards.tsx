import type { GoalAchievement } from '../types/goal.types'

import { AchievementCard } from './achievement-card'

interface AchievementCardsProps {
  achievements: GoalAchievement[]
}

export function AchievementCards({
  achievements,
}: AchievementCardsProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-medium tracking-tight">
          Suas conquistas
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.title}
            {...achievement}
          />
        ))}
      </div>
    </section>
  )
}
