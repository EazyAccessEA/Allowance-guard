'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/ui/Alert'
import {
  FileText,
  Download,
  Calendar,
  Loader2,
  CheckCircle,
  Clock,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ExportType = 'full_audit' | 'risk_summary' | 'allowance_snapshot' | 'team_report'
type ExportFormat = 'json' | 'csv'

interface ExportHistoryEntry {
  id: string
  export_type: string
  format: string
  row_count: number
  file_size: number | null
  created_at: string
}

interface AuditReportProps {
  teamId?: number
  wallets?: string[]
}

// ---------------------------------------------------------------------------
// Report types
// ---------------------------------------------------------------------------

const REPORT_TYPES: Array<{ type: ExportType; label: string; description: string }> = [
  {
    type: 'full_audit',
    label: 'Full Audit Log',
    description: 'Complete audit trail of all account actions with timestamps and IP addresses.',
  },
  {
    type: 'risk_summary',
    label: 'Risk Summary',
    description: 'Historical risk snapshots showing score trends over time per wallet.',
  },
  {
    type: 'allowance_snapshot',
    label: 'Allowance Snapshot',
    description: 'Current state of all token approvals with risk scores and spender labels.',
  },
  {
    type: 'team_report',
    label: 'Team Activity Report',
    description: 'Per-member activity log for compliance review and audit.',
  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AuditReport({ teamId, wallets }: AuditReportProps) {
  const [selectedType, setSelectedType] = useState<ExportType>('allowance_snapshot')
  const [format, setFormat] = useState<ExportFormat>('csv')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [generating, setGenerating] = useState(false)
  const [lastExport, setLastExport] = useState<{ filename: string; rows: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<ExportHistoryEntry[]>([])
  const [historyLoaded, setHistoryLoaded] = useState(false)

  const generateReport = async () => {
    setGenerating(true)
    setError(null)
    setLastExport(null)

    try {
      const filters: Record<string, unknown> = {}
      if (wallets && wallets.length > 0) filters.wallets = wallets
      if (dateFrom) filters.dateFrom = dateFrom
      if (dateTo) filters.dateTo = dateTo
      if (teamId) filters.teamId = teamId

      const res = await fetch('/api/compliance/export', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ exportType: selectedType, format, filters }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Export failed')
        return
      }

      const blob = await res.blob()
      const filename = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1]
        ?? `report.${format}`
      const rows = Number(res.headers.get('X-Export-Rows') ?? 0)

      // Trigger download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)

      setLastExport({ filename, rows })
    } catch {
      setError('Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/compliance/export')
      const data = await res.json()
      setHistory(data.exports ?? [])
      setHistoryLoaded(true)
    } catch {
      // silently fail
    }
  }

  function formatFileSize(bytes: number | null): string {
    if (!bytes) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      {/* Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-accent" />
            Compliance Audit Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Report Type Selection */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">Report Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {REPORT_TYPES
                .filter((r) => r.type !== 'team_report' || teamId)
                .map((r) => (
                  <button
                    key={r.type}
                    onClick={() => setSelectedType(r.type)}
                    className={`text-left p-3 rounded-lg border transition-colors ${
                      selectedType === r.type
                        ? 'border-primary-accent bg-primary-50'
                        : 'border-secondary-700 hover:border-primary-200'
                    }`}
                  >
                    <div className="text-sm font-medium text-text-primary">{r.label}</div>
                    <div className="text-xs text-text-secondary mt-0.5">{r.description}</div>
                  </button>
                ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-1 block">Format</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormat('csv')}
                  className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                    format === 'csv'
                      ? 'border-primary-accent bg-primary-50 text-primary-accent'
                      : 'border-secondary-700 text-text-secondary hover:border-primary-200'
                  }`}
                >
                  CSV
                </button>
                <button
                  onClick={() => setFormat('json')}
                  className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                    format === 'json'
                      ? 'border-primary-accent bg-primary-50 text-primary-accent'
                      : 'border-secondary-700 text-text-secondary hover:border-primary-200'
                  }`}
                >
                  JSON
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <div>
                <label className="text-sm font-medium text-text-primary mb-1 block">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-2 py-1.5 text-sm border border-secondary-700 rounded bg-background-primary text-text-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary mb-1 block">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-2 py-1.5 text-sm border border-secondary-700 rounded bg-background-primary text-text-primary"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Success */}
          {lastExport && (
            <Alert variant="success" icon={<CheckCircle className="w-4 h-4" />}>
              Report downloaded: {lastExport.filename} ({lastExport.rows} records)
            </Alert>
          )}

          {/* Generate Button */}
          <Button onClick={generateReport} disabled={generating} variant="primary">
            {generating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {generating ? 'Generating...' : 'Generate Report'}
          </Button>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Export History
            </CardTitle>
            {!historyLoaded && (
              <Button onClick={loadHistory} variant="ghost" size="sm">
                Load History
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!historyLoaded ? (
            <p className="text-sm text-text-secondary">Click &quot;Load History&quot; to view previous exports.</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-text-secondary">No exports generated yet.</p>
          ) : (
            <div className="space-y-2">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-secondary-700"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-text-tertiary" />
                    <div>
                      <div className="text-sm font-medium text-text-primary">
                        {entry.export_type.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs text-text-tertiary">
                        {new Date(entry.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{entry.format.toUpperCase()}</Badge>
                    <span className="text-xs text-text-secondary">{entry.row_count} rows</span>
                    <span className="text-xs text-text-tertiary">{formatFileSize(entry.file_size)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
