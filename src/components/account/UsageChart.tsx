'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
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
  return 'bg-semantic-success-500'
}

function getBarTrackColor(percentage: number): string {
  if (percentage > 85) return 'bg-semantic-error-100'
  if (percentage > 60) return 'bg-semantic-warning-100'
  return 'bg-semantic-success-100'
}

interface UsageBarProps {
  label: string
  used: number
  limit: number
}

function UsageBar({ label, used, limit }: UsageBarProps) {
  const isUnlimited = limit === -1
  const percentage = isUnlimited ? 0 : Math.min(Math.round((used / limit) * 100), 100)
  const displayPercentage = isUnlimited ? null : percentage

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-ink-muted">
          {used.toLocaleString()}
          {' / '}
          {isUnlimited ? (
            <span className="font-medium text-primary-700">Unlimited</span>
          ) : (
            limit.toLocaleString()
          )}
          {displayPercentage !== null && (
            <span
              className={cn(
                'ml-2 text-xs font-semibold',
                percentage > 85
                  ? 'text-semantic-error-500'
                  : percentage > 60
                    ? 'text-semantic-warning-500'
                    : 'text-semantic-success-500'
              )}
            >
              ({displayPercentage}%)
            </span>
          )}
        </span>
      </div>
      <div
        className={cn(
          'h-2.5 w-full rounded-full overflow-hidden',
          isUnlimited ? 'bg-primary-100' : getBarTrackColor(percentage)
        )}
        role="progressbar"
        aria-valuenow={isUnlimited ? undefined : percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} usage`}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            isUnlimited ? 'bg-primary-400' : getBarColor(percentage)
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
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <UsageBar label="Wallets" used={walletsUsed} limit={walletsLimit} />
        <UsageBar label="API Calls (today)" used={apiCallsUsed} limit={apiCallsLimit} />
        <UsageBar label="Chains" used={chainsUsed} limit={chainsLimit} />
      </CardContent>
    </Card>
  )
}
