'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  MOCK_APPROVALS,
  getStats,
  type Chain,
  type Approval,
} from './mock-data'
import DashboardHeader from './DashboardHeader'
import SummaryStats from './SummaryStats'
import ChainFilter from './ChainFilter'
import ApprovalTable from './ApprovalTable'
import BatchToolbar from './BatchToolbar'
import TimeMachineToggle from './TimeMachineToggle'

/**
 * Dashboard Prototype — Phase 7 Build 1
 *
 * Interactive design prototype with mock data.
 * Demonstrates: chain filtering, batch selection, Time Machine,
 * risk badges, responsive table→card layout, empty state.
 */
export default function DashboardPrototype() {
  const [activeChain, setActiveChain] = useState<Chain>('All')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [timeMachine, setTimeMachine] = useState(false)

  // Filter approvals by chain
  const filteredApprovals = useMemo(() => {
    let result: Approval[] = MOCK_APPROVALS
    if (activeChain !== 'All') {
      result = result.filter((a) => a.chain === activeChain)
    }
    return result
  }, [activeChain])

  // Time Machine: dimming handled in table, stats recalculated
  const displayStats = useMemo(() => {
    if (timeMachine) {
      const safe = filteredApprovals.filter(
        (a) => a.risk !== 'high' && a.risk !== 'critical'
      )
      return getStats(safe)
    }
    return getStats(filteredApprovals)
  }, [filteredApprovals, timeMachine])

  // Chain counts for filter pills
  const chainCounts = useMemo(() => {
    const counts: Record<string, number> = { All: MOCK_APPROVALS.length }
    for (const a of MOCK_APPROVALS) {
      counts[a.chain] = (counts[a.chain] || 0) + 1
    }
    return counts
  }, [])

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleToggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === filteredApprovals.length) return new Set()
      return new Set(filteredApprovals.map((a) => a.id))
    })
  }, [filteredApprovals])

  const handleRevoke = useCallback((id: string) => {
    const approval = MOCK_APPROVALS.find((a) => a.id === id)
    if (approval) {
      alert(`Would revoke: ${approval.tokenSymbol} (${approval.spender})`)
    }
  }, [])

  const handleBatchRevoke = useCallback(() => {
    const ids = Array.from(selectedIds)
    const tokens = ids
      .map((id) => MOCK_APPROVALS.find((a) => a.id === id)?.tokenSymbol)
      .filter(Boolean)
    alert(`Would revoke ${ids.length} approvals: ${tokens.join(', ')}`)
    setSelectedIds(new Set())
  }, [selectedIds])

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  return (
    <div className="min-h-screen bg-background-secondary dark:bg-dark-bg-primary">
      <DashboardHeader />

      <main className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Summary stats */}
        <SummaryStats
          total={displayStats.total}
          atRisk={displayStats.atRisk}
          valueExposed={displayStats.valueExposed}
          isTimeMachine={timeMachine}
        />

        {/* Controls row */}
        <div
          className={cn(
            'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
          )}
        >
          <ChainFilter
            active={activeChain}
            onChange={(chain) => {
              setActiveChain(chain)
              setSelectedIds(new Set())
            }}
            counts={chainCounts}
          />
          <TimeMachineToggle
            enabled={timeMachine}
            onToggle={() => setTimeMachine((p) => !p)}
          />
        </div>

        {/* Approval table */}
        <div
          className={cn(
            'rounded-lg border bg-background-primary dark:bg-dark-bg-secondary',
            'border-border-primary dark:border-secondary-700',
            timeMachine && 'ring-1 ring-primary-200 dark:ring-primary-800'
          )}
        >
          <ApprovalTable
            approvals={filteredApprovals}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            onRevoke={handleRevoke}
            isTimeMachine={timeMachine}
          />
        </div>
      </main>

      {/* Batch toolbar */}
      <BatchToolbar
        count={selectedIds.size}
        onRevoke={handleBatchRevoke}
        onClear={handleClearSelection}
      />
    </div>
  )
}
