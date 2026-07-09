import { pdf } from '@react-pdf/renderer'

import { getReportsData } from '../services/report.service'

import { ReportDocument } from './report-document'
import type {
  ReportPdfFilters,
  ReportPdfSectionId,
} from './report-pdf-types'
import { buildReportPdfFileName } from './report-pdf-utils'

interface DownloadReportPdfInput {
  filters: ReportPdfFilters
  selectedSections: ReportPdfSectionId[]
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function downloadReportPdf({
  filters,
  selectedSections,
}: DownloadReportPdfInput) {
  const report = await getReportsData(filters)
  const blob = await pdf(
    <ReportDocument
      data={{
        filters,
        generatedAt: new Date(),
        report,
        selectedSections,
      }}
    />,
  ).toBlob()

  downloadBlob(blob, buildReportPdfFileName(filters))
}
