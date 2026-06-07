import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  variant?: 'default' | 'income' | 'expense'
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  variant = 'default',
}: MetricCardProps) {
  const variantStyles = {
    default: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      valueColor: 'text-foreground',
    },

    income: {
      iconBg: 'bg-income/10',
      iconColor: 'text-income',
      valueColor: 'text-income',
    },

    expense: {
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      valueColor: 'text-destructive',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div
      className="
        rounded-3xl
        border
        border-border
        bg-card
        p-6
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
        "
      >
        <div>
          <p
            className="
              text-sm
              text-muted-foreground
            "
          >
            {title}
          </p>

          <h3
            className={`
              mt-3
              text-3xl
              font-medium
              tracking-tight
              ${styles.valueColor}
            `}
          >
            {value}
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-muted-foreground
            "
          >
            {change}
          </p>
        </div>

        <div
          className={`
            flex
            size-12
            items-center
            justify-center
            rounded-2xl
            ${styles.iconBg}
          `}
        >
          <Icon
            className={`
              size-6
              ${styles.iconColor}
            `}
          />
        </div>
      </div>
    </div>
  )
}