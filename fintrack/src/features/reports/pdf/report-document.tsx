import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

import type { ReportPdfData } from './report-pdf-types'
import {
  formatPdfCurrency,
  formatPdfDate,
  hasPdfSection,
} from './report-pdf-utils'

const colors = {
  border: '#E5E7EB',
  expense: '#DC2626',
  income: '#16A34A',
  muted: '#6B7280',
  primary: '#2563EB',
  surface: '#F8FAFC',
  text: '#111827',
  white: '#FFFFFF',
}

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: colors.muted,
  },
  metaGrid: {
    marginTop: 14,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  metaItem: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  metaLabel: {
    fontSize: 8,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  metaValue: {
    marginTop: 3,
    fontSize: 10,
    color: colors.text,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 13,
    fontWeight: 700,
  },
  summaryGrid: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flexGrow: 1,
    flexBasis: 0,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  summaryTitle: {
    fontSize: 9,
    color: colors.muted,
  },
  summaryValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 700,
  },
  summaryDetail: {
    marginTop: 5,
    fontSize: 8,
    color: colors.muted,
  },
  textBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    lineHeight: 1.5,
    color: colors.text,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 28,
  },
  tableHeader: {
    backgroundColor: colors.surface,
  },
  tableCell: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    fontSize: 9,
  },
  tableHeadCell: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  emptyState: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    color: colors.muted,
    textAlign: 'center',
  },
  income: {
    color: colors.income,
  },
  expense: {
    color: colors.expense,
  },
  footer: {
    position: 'absolute',
    right: 36,
    bottom: 22,
    color: colors.muted,
    fontSize: 8,
  },
})

function ReportHeader({
  data,
}: {
  data: ReportPdfData
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.brand}>FinTrack</Text>
      <Text style={styles.subtitle}>Relatório financeiro</Text>

      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Período</Text>
          <Text style={styles.metaValue}>
            {data.report.periodLabel}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Gerado em</Text>
          <Text style={styles.metaValue}>
            {formatPdfDate(data.generatedAt)}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Tipo</Text>
          <Text style={styles.metaValue}>
            {data.filters.typeLabel}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Carteira</Text>
          <Text style={styles.metaValue}>
            {data.filters.walletLabel}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Categoria</Text>
          <Text style={styles.metaValue}>
            {data.filters.categoryLabel}
          </Text>
        </View>
      </View>
    </View>
  )
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>
}

function EmptyState({ children }: { children: string }) {
  return <Text style={styles.emptyState}>{children}</Text>
}

function SummaryCards({ data }: { data: ReportPdfData }) {
  return (
    <View style={styles.section}>
      <SectionTitle>Resumo financeiro</SectionTitle>
      <View style={styles.summaryGrid}>
        {data.report.summaries.map((summary) => (
          <View
            key={summary.title}
            style={styles.summaryCard}
          >
            <Text style={styles.summaryTitle}>
              {summary.title}
            </Text>
            <Text
              style={[
                styles.summaryValue,
                summary.tone === 'income' ? styles.income : {},
                summary.tone === 'expense' ? styles.expense : {},
              ]}
            >
              {summary.value}
            </Text>
            <Text style={styles.summaryDetail}>
              {summary.comparison}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

function PeriodSummary({ data }: { data: ReportPdfData }) {
  return (
    <View style={styles.section}>
      <SectionTitle>Resumo do período</SectionTitle>
      <Text style={styles.textBox}>
        {data.report.periodSummary.body}
        {' '}
        {data.report.periodSummary.insights
          .map((insight) => insight.text)
          .join(' ')}
      </Text>
    </View>
  )
}

function TableHeader({
  columns,
}: {
  columns: Array<{ label: string; width: string }>
}) {
  return (
    <View style={[styles.tableRow, styles.tableHeader]}>
      {columns.map((column) => (
        <Text
          key={column.label}
          style={[
            styles.tableCell,
            styles.tableHeadCell,
            { width: column.width },
          ]}
        >
          {column.label}
        </Text>
      ))}
    </View>
  )
}

function EvolutionTable({ data }: { data: ReportPdfData }) {
  const columns = [
    { label: 'Período', width: '25%' },
    { label: 'Receitas', width: '25%' },
    { label: 'Despesas', width: '25%' },
    { label: 'Saldo', width: '25%' },
  ]

  return (
    <View style={styles.section}>
      <SectionTitle>Evolução financeira</SectionTitle>
      {data.report.evolution.length > 0 ? (
        <View style={styles.table}>
          <TableHeader columns={columns} />
          {data.report.evolution.map((item) => {
            const balance = item.income - item.expense

            return (
              <View
                key={item.month}
                style={styles.tableRow}
                wrap={false}
              >
                <Text style={[styles.tableCell, { width: '25%' }]}>
                  {item.month}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.income,
                    { width: '25%' },
                  ]}
                >
                  {formatPdfCurrency(item.income)}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.expense,
                    { width: '25%' },
                  ]}
                >
                  {formatPdfCurrency(item.expense)}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    balance >= 0 ? styles.income : styles.expense,
                    { width: '25%' },
                  ]}
                >
                  {formatPdfCurrency(balance)}
                </Text>
              </View>
            )
          })}
        </View>
      ) : (
        <EmptyState>
          Não há evolução financeira para os filtros selecionados.
        </EmptyState>
      )}
    </View>
  )
}

function BarItemTable({
  title,
  emptyMessage,
  items,
  firstColumn,
}: {
  title: string
  emptyMessage: string
  items: ReportPdfData['report']['categoryExpenses']
  firstColumn: string
}) {
  const columns = [
    { label: firstColumn, width: '50%' },
    { label: 'Valor', width: '30%' },
    { label: 'Percentual', width: '20%' },
  ]

  return (
    <View style={styles.section}>
      <SectionTitle>{title}</SectionTitle>
      {items.length > 0 ? (
        <View style={styles.table}>
          <TableHeader columns={columns} />
          {items.map((item) => (
            <View
              key={item.label}
              style={styles.tableRow}
              wrap={false}
            >
              <Text style={[styles.tableCell, { width: '50%' }]}>
                {item.label}
              </Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>
                {item.value}
              </Text>
              <Text style={[styles.tableCell, { width: '20%' }]}>
                {item.percentage}%
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <EmptyState>{emptyMessage}</EmptyState>
      )}
    </View>
  )
}

function TransactionsTable({ data }: { data: ReportPdfData }) {
  const columns = [
    { label: 'Data', width: '13%' },
    { label: 'Descrição', width: '27%' },
    { label: 'Categoria', width: '17%' },
    { label: 'Carteira', width: '18%' },
    { label: 'Tipo', width: '10%' },
    { label: 'Valor', width: '15%' },
  ]

  return (
    <View style={styles.section}>
      <SectionTitle>Transações do período</SectionTitle>
      {data.report.transactions.length > 0 ? (
        <View style={styles.table}>
          <TableHeader columns={columns} />
          {data.report.transactions.map((transaction) => (
            <View
              key={transaction.id}
              style={styles.tableRow}
              wrap={false}
            >
              <Text style={[styles.tableCell, { width: '13%' }]}>
                {transaction.date}
              </Text>
              <Text style={[styles.tableCell, { width: '27%' }]}>
                {transaction.description}
              </Text>
              <Text style={[styles.tableCell, { width: '17%' }]}>
                {transaction.category}
              </Text>
              <Text style={[styles.tableCell, { width: '18%' }]}>
                {transaction.wallet}
              </Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>
                {transaction.type === 'income'
                  ? 'Receita'
                  : 'Despesa'}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  transaction.type === 'income'
                    ? styles.income
                    : styles.expense,
                  { width: '15%' },
                ]}
              >
                {transaction.value}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <EmptyState>
          Não foram encontradas transações para o período e
          filtros selecionados.
        </EmptyState>
      )}
    </View>
  )
}

function NoDataMessage({ data }: { data: ReportPdfData }) {
  if (data.report.hasTransactions) {
    return null
  }

  return (
    <View style={styles.section}>
      <EmptyState>
        Não foram encontradas transações para o período e filtros
        selecionados.
      </EmptyState>
    </View>
  )
}

function SecondarySections({ data }: { data: ReportPdfData }) {
  const sections = data.selectedSections

  return (
    <>
      {hasPdfSection(sections, 'category-expenses') ? (
        <BarItemTable
          title="Despesas por categoria"
          firstColumn="Categoria"
          items={data.report.categoryExpenses}
          emptyMessage="Nenhuma despesa encontrada para os filtros selecionados."
        />
      ) : null}

      {hasPdfSection(sections, 'wallet-usage') ? (
        <BarItemTable
          title="Uso por carteira"
          firstColumn="Carteira"
          items={data.report.walletUsage}
          emptyMessage="Nenhuma movimentação por carteira encontrada."
        />
      ) : null}

      {hasPdfSection(sections, 'period-transactions') ? (
        <TransactionsTable data={data} />
      ) : null}
    </>
  )
}

function Footer() {
  return (
    <Text
      style={styles.footer}
      render={({ pageNumber, totalPages }) =>
        `Página ${pageNumber} de ${totalPages}`
      }
      fixed
    />
  )
}

export function ReportDocument({
  data,
}: {
  data: ReportPdfData
}) {
  const sections = data.selectedSections
  const hasPrimarySections =
    hasPdfSection(sections, 'financial-summary') ||
    hasPdfSection(sections, 'financial-evolution')
  const hasSecondarySections =
    hasPdfSection(sections, 'category-expenses') ||
    hasPdfSection(sections, 'wallet-usage') ||
    hasPdfSection(sections, 'period-transactions')
  const hasNoTransactions = !data.report.hasTransactions

  return (
    <Document
      title="Relatório financeiro FinTrack"
      author="FinTrack"
    >
      <Page
        size="A4"
        style={styles.page}
      >
        <ReportHeader data={data} />

        {hasNoTransactions ? <NoDataMessage data={data} /> : null}

        {!hasNoTransactions &&
        hasPdfSection(sections, 'financial-summary') ? (
          <>
            <SummaryCards data={data} />
            <PeriodSummary data={data} />
          </>
        ) : null}

        {!hasNoTransactions &&
        hasPdfSection(sections, 'financial-evolution') ? (
          <EvolutionTable data={data} />
        ) : null}
        {!hasNoTransactions &&
        !hasPrimarySections &&
        hasSecondarySections ? (
          <SecondarySections data={data} />
        ) : null}
        <Footer />
      </Page>

      {!hasNoTransactions &&
      hasPrimarySections &&
      hasSecondarySections ? (
        <Page
          size="A4"
          style={styles.page}
        >
          <ReportHeader data={data} />
          <SecondarySections data={data} />
          <Footer />
        </Page>
      ) : null}
    </Document>
  )
}
