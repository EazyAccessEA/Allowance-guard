'use client'

/**
 * UsageChart — unified Ledger canon.
 *
 * State-ramp tints tuned for paper: `semantic-*-600/700` text, `-500`
 * bar fills, `-100` track backgrounds.
 */

import React from 'react'
import { cn } from '@/lib/utils'

interface UsageChartProps {
  walletsUsed: number
  walletsLimit: number
  apiCallsUsed: number
  apiCallsLimit: number
  chainsUsed: number
  chainsLimit: number
}

function getBarColor(percentage: number): string {
  if (percentage > 85) return 'bg-semantic-error-500'
  if (percentage > 60) return 'bg-semantic-warning-500'
  return 'bg-semantic-success-600'
}

function getBarPercentColor(percentage: number): string {
  if (percentage > 85) return 'text-semantic-error-700'
  if (percentage > 60) return 'text-semantic-warning-700'
  return 'text-semantic-success-700'
}

interface UsageBarProps {
  label: string
  used: number
  limit: number
}

function UsageBar({ label, used, limit }: UsageBarProps) {
  const isUnlimited = limit === -1
  const percentage = isUnlimited
    ? 0
    : Math.min(Math.round((used / limit) * 100), 100)
  const displayPercentage = isUnlimited ? null : percentage

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between font-plex text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-ink-muted">
          {used.toLocaleString()}
          {' / '}
          {isUnlimited ? (
            <span className="font-medium text-amber-deep">Unlimited</span>
          ) : (
            limit.toLocaleString()
          )}
          {displayPercentage !== null && (
            <span
              className={cn(
                'ml-2 font-mono text-xs font-semibold',
                getBarPercentColor(percentage),
              )}
            >
              ({displayPercentage}%)
            </span>
          )}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden bg-paper-deep border border-ink-rule"
        role="progressbar"
        aria-valuenow={isUnlimited ? undefined : percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} usage`}
      >
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            isUnlimited ? 'bg-amber-deep' : getBarColor(percentage),
          )}
          style={{
            width: isUnlimited ? '15%' : `${Math.max(percentage, 2)}%`,
          }}
        />
      </div>
    </div>
  )
}

export default function UsageChart({
  walletsUsed,
  walletsLimit,
  apiCallsUsed,
  apiCallsLimit,
  chainsUsed,
  chainsLimit,
}: UsageChartProps) {
  return (
    <div className="paper-card p-6 sm:p-7">
      <h2 className="mb-6 font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
        Usage
      </h2>
      <div className="space-y-5">
        <UsageBar label="Wallets" used={walletsUsed} limit={walletsLimit} />
        <UsageBar label="API Calls (today)" used={apiCallsUsed} limit={apiCallsLimit} />
        <UsageBar label="Chains" used={chainsUsed} limit={chainsLimit} />
      </div>
    </div>
  )
}
