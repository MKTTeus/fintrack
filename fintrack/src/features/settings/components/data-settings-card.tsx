import { Clock3, Database, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTransactions } from '@/features/transactions/hooks/use-transactions'

import { exportTransactionsCsv } from '../utils/export-transactions-csv'

import { SettingsSectionCard } from './settings-section-card'

export function DataSettingsCard() {
  const { data: transactions = [], isLoading } = useTransactions()

  return (
    <SettingsSectionCard
      icon={Database}
      title="Dados"
      description="Importe ou exporte seus dados"
    >
      <div className="divide-y divide-border/70">
        <div className="grid gap-4 py-1 pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="text-sm font-medium">
              Exportar transações
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Baixe todas as suas transações em um arquivo CSV
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isLoading || transactions.length === 0}
            onClick={() => exportTransactionsCsv(transactions)}
            className="h-10 w-full gap-2 rounded-xl bg-background/40 sm:w-auto"
          >
            <Download className="size-4" />
            Exportar CSV
          </Button>
        </div>

        <div className="grid gap-4 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="text-sm font-medium">Importar dados</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Em breve você poderá importar seus dados
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled
            className="h-10 w-full gap-2 rounded-xl bg-background/40 sm:w-auto"
          >
            <Clock3 className="size-4" />
            Em breve
          </Button>
        </div>
      </div>
    </SettingsSectionCard>
  )
}
