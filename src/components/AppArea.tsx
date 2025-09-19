'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import WalletManager from '@/components/WalletManager'
import AllowanceTable from '@/components/AllowanceTable'
import WalletSecurity from '@/components/WalletSecurity'
import { 
  DashboardSkeleton, 
  StatsCard
} from '@/components/EnhancedLoadingStates'
import BulkRevokePanel from '@/components/BulkRevokePanel'
import { useState, useEffect, useCallback } from 'react'
import { 
  Shield, 
  Eye, 
  Download, 
  FileText, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'

interface AppAreaProps {
  isConnected: boolean
  selectedWallet: string | null
  setSelectedWallet: (wallet: string | null) => void
  rows: {
    chain_id: number
    token_address: string
    spender_address: string
    standard: string
    allowance_type: string
    amount: string
    is_unlimited: boolean
    last_seen_block: string
    risk_score: number
    risk_flags: string[]
  }[]
  total: number
  page: number
  pageSize: number
  onPage: (page: number) => void
  onPageSize: (pageSize: number) => void
  onRefresh: () => Promise<void>
  connectedAddress: string | undefined
  canRevoke?: boolean
  loading?: boolean
}

export default function AppArea({
  isConnected, selectedWallet, setSelectedWallet, rows, total, page, pageSize, onPage, onPageSize, onRefresh, connectedAddress, canRevoke = true, loading = false
}: AppAreaProps) {
  const [monitorOn, setMonitorOn] = useState<boolean | null>(null)
  const [monitorFreq, setMonitorFreq] = useState(720)
  const [activeTab, setActiveTab] = useState<'allowances' | 'security'>('allowances')
  const [selectedRows, setSelectedRows] = useState<typeof rows>([])

  const loadMonitor = useCallback(async () => {
    const target = selectedWallet || connectedAddress
    if (!target) return
    const r = await fetch(`/api/monitor?wallet=${target}`)
    const j = await r.json()
    if (j.monitor) { setMonitorOn(j.monitor.enabled); setMonitorFreq(j.monitor.freq_minutes) }
  }, [selectedWallet, connectedAddress])
  
  useEffect(() => { loadMonitor() }, [loadMonitor])

  async function saveMonitor() {
    const target = selectedWallet || connectedAddress
    if (!target) return alert('Select or connect a wallet first')
    await fetch('/api/monitor', {
      method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ wallet: target, enabled: monitorOn ?? true, freq_minutes: monitorFreq })
    })
  }

  if (!isConnected) return null

  const currentWallet = selectedWallet || connectedAddress
  const riskyCount = rows.filter(r => r.is_unlimited || (r.risk_flags||[]).includes('STALE')).length
  const unlimitedCount = rows.filter(r => r.is_unlimited).length

  // Show loading state
  if (loading) {
    return (
      <Section className="bg-background-light">
        <Container>
          <DashboardSkeleton />
        </Container>
      </Section>
    )
  }

  return (
    <Section className="bg-background-light">
      <Container>
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="mobbin-heading-1 text-text-primary mb-2">Security Dashboard</h2>
              <p className="mobbin-body text-text-secondary">Monitor and manage your wallet&apos;s token approvals</p>
            </div>
            <Button
              onClick={onRefresh}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          {/* Quick Stats - Mobile Optimized */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatsCard
              title="Total Allowances"
              value={total}
              icon={<Shield className="w-5 h-5 text-primary-accent" />}
              loading={loading}
            />
            <StatsCard
              title="High Risk"
              value={riskyCount}
              icon={<AlertTriangle className="w-5 h-5 text-semantic-danger" />}
              loading={loading}
            />
            <StatsCard
              title="Unlimited"
              value={unlimitedCount}
              icon={<AlertTriangle className="w-5 h-5 text-semantic-warning" />}
              loading={loading}
            />
            <StatsCard
              title="Safe"
              value={total - riskyCount}
              icon={<CheckCircle className="w-5 h-5 text-semantic-success" />}
              loading={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Wallet Manager */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mobbin-heading-4">
                  <Settings className="w-5 h-5" />
                  Wallet Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mobbin-body-small text-text-secondary mb-4">
                  Manage addresses you want to scan and monitor.
                </p>
                <WalletManager
                  selected={selectedWallet}
                  onSelect={setSelectedWallet}
                  onSavedChange={() => {}}
                />
              </CardContent>
            </Card>

            {/* Monitoring Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mobbin-heading-4">
                  <Eye className="w-5 h-5" />
                  Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={!!monitorOn} 
                    onChange={e=>setMonitorOn(e.target.checked)} 
                    className="rounded border-border-default text-primary-accent focus:ring-primary-accent"
                  />
                  <label className="mobbin-body-small font-medium text-text-primary">
                    Enable auto-rescan & drift alerts
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="mobbin-body-small text-text-secondary">Every</span>
                  <Input
                    type="number"
                    value={monitorFreq}
                    onChange={e => setMonitorFreq(Number(e.target.value) || 720)}
                    className="w-20 h-8"
                    inputSize="sm"
                  />
                  <span className="mobbin-body-small text-text-secondary">minutes</span>
                </div>
                
                <Button 
                  onClick={saveMonitor}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mobbin-heading-4">
                  <Shield className="w-5 h-5" />
                  Security Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-semantic-error-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="mobbin-body-small text-text-secondary">
                      <strong>Unlimited approvals</strong> are the #1 drain vector. Revoke them first.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-semantic-warning-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="mobbin-body-small text-text-secondary">
                      <strong>Stale approvals</strong> to inactive contracts should be cleaned up.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-semantic-info-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="mobbin-body-small text-text-secondary">
                      <strong>Regular monitoring</strong> helps catch new approvals quickly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-8">
            {/* Tab Navigation */}
            <div className="mb-8">
              <nav className="flex space-x-1 bg-background-secondary p-1 rounded-lg border border-border-primary">
                <button
                  onClick={() => setActiveTab('allowances')}
                  className={`flex-1 py-3 px-4 mobbin-body-small font-medium rounded-md transition-all duration-150 ${
                    activeTab === 'allowances'
                      ? 'bg-background-primary text-primary-600 shadow-sm border border-primary-200'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-primary/50'
                  }`}
                >
                  Token Allowances
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 py-3 px-4 mobbin-body-small font-medium rounded-md transition-all duration-150 ${
                    activeTab === 'security'
                      ? 'bg-background-primary text-primary-600 shadow-sm border border-primary-200'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-primary/50'
                  }`}
                >
                  Security Dashboard
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'allowances' && (
              <div className="space-y-6">
                {/* Bulk Revoke Panel */}
                <BulkRevokePanel
                  data={rows}
                  selectedRows={selectedRows}
                  onSelectionChange={setSelectedRows}
                  onRefresh={onRefresh}
                  selectedWallet={selectedWallet}
                  connectedAddress={connectedAddress}
                  canRevoke={canRevoke}
                />

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="mobbin-heading-3">Token Approvals</CardTitle>
                        <p className="mobbin-body-small text-text-secondary mt-2">
                          Review and manage your token allowances across all chains.
                        </p>
                      </div>
                      {currentWallet && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => window.open(`/api/export/csv?wallet=${currentWallet}&riskOnly=true`, '_blank')}
                          >
                            <Download className="w-4 h-4" />
                            CSV
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => window.open(`/api/export/pdf?wallet=${currentWallet}&riskOnly=true`, '_blank')}
                          >
                            <FileText className="w-4 h-4" />
                            PDF
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => window.open(`/report/${currentWallet}`, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                            Report
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <AllowanceTable
                      data={rows}
                      selectedWallet={selectedWallet}
                      connectedAddress={connectedAddress}
                      onRefresh={onRefresh}
                      canRevoke={canRevoke}
                    />
                  
                  {/* Pagination */}
                  {total > 0 && (
                    <div className="mt-8 pt-6 border-t border-border-primary flex items-center justify-between">
                      <div className="mobbin-body-small text-text-secondary">
                        Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => onPage(page - 1)}
                          disabled={page <= 1}
                          variant="ghost"
                          size="sm"
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => onPage(page + 1)}
                          disabled={page >= Math.ceil(total / pageSize)}
                          variant="ghost"
                          size="sm"
                        >
                          Next
                        </Button>
                        <select
                          value={pageSize}
                          onChange={(e) => onPageSize(Number(e.target.value))}
                          className="border border-border-primary rounded-md px-3 py-1 mobbin-body-small focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        >
                          {[10,25,50,100].map(n => <option key={n} value={n}>{n}/page</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle className="mobbin-heading-3">Security Dashboard</CardTitle>
                  <p className="mobbin-body-small text-text-secondary mt-2">
                    Comprehensive security analysis and monitoring for your wallet.
                  </p>
                </CardHeader>
                <CardContent>
                  <WalletSecurity />
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </Container>
    </Section>
  )
}