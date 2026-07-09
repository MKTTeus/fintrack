import type { ReactNode } from 'react'

import type { LucideIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SettingsSectionCardProps {
  children: ReactNode
  description: string
  icon: LucideIcon
  iconClassName?: string
  title: string
}

export function SettingsSectionCard({
  children,
  description,
  icon: Icon,
  iconClassName,
  title,
}: SettingsSectionCardProps) {
  return (
    <Card className="grid gap-6 rounded-2xl border-border/80 bg-card/70 p-5 shadow-[0_18px_80px_rgb(0_0_0/0.14)] ring-1 ring-white/5 md:grid-cols-[18rem_minmax(0,1fr)] md:items-start md:p-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
      <div className="flex gap-4">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15",
            iconClassName,
          )}
        >
          <Icon className="size-6" />
        </div>

        <div className="min-w-0 pt-1">
          <h2 className="text-base font-medium tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-1 max-w-52 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="min-w-0">{children}</div>
    </Card>
  )
}
