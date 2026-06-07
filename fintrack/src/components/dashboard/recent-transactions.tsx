import {
  Car,
  ShoppingCart,
  Wallet,
} from 'lucide-react'

import { useTransactions } from '@/hooks/dashboard/use-transactions'

const icons = {
  Supermercado: ShoppingCart,
  Salário: Wallet,
  Uber: Car,
}

export function RecentTransactions() {
  const { data, isLoading } =
    useTransactions()

  if (isLoading) {
    return (
      <div
        className="
          h-[320px]
          animate-pulse
          rounded-3xl
          bg-card
        "
      />
    )
  }

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
      <div
        className="
          mb-6
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h2
            className="
              text-xl
              font-medium
              tracking-tight
            "
          >
            Transações Recentes
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-muted-foreground
            "
          >
            Últimas movimentações da conta
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {data?.map((transaction) => {
          const Icon =
            icons[
              transaction.title as keyof typeof icons
            ]

          return (
            <div
              key={transaction.title}
              className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-border
                p-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >
                <div
                  className={`
                    flex
                    size-11
                    items-center
                    justify-center
                    rounded-2xl
                    ${
                      transaction.expense
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-income/10 text-income'
                    }
                  `}
                >
                  <Icon className="size-5" />
                </div>

                <div>
                  <p className="font-medium">
                    {transaction.title}
                  </p>

                  <p
                    className="
                      text-sm
                      text-muted-foreground
                    "
                  >
                    {transaction.category}
                  </p>
                </div>
              </div>

              <p
                className={`
                  font-medium
                  ${
                    transaction.expense
                      ? 'text-destructive'
                      : 'text-income'
                  }
                `}
              >
                {transaction.value}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}