'use client'

import React from 'react'
import { Shield, AlertTriangle, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SummaryStatsProps {
  total: number
  atRisk: number
  valueExposed: number
  isTimeMachine?: boolean
}

const formatUsd = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export default function SummaryStats({
  total,
  atRisk,
  valueExposed,
  isTimeMachine = false,
}: SummaryStatsProps) {
  const stats = [
    {
      label: 'Total Approvals',
      value: total,
      icon: Shield,
      color: 'text-primary-500',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      label: 'At Risk',
      value: atRisk,
      icon: AlertTriangle,
      color: atRisk > 0 ? 'text-semantic-error-500' : 'text-semantic-success-500',
      bg: atRisk > 0
        ? 'bg-semantic-error-50 dark:bg-semantic-error-900/20'
        : 'bg-semantic-success-50 dark:bg-semantic-success-900/20',
    },
    {
      label: 'Value Exposed',
      value: formatUsd(valueExposed),
      icon: DollarSign,
      color: valueExposed > 10000 ? 'text-semantic-warning-500' : 'text-ink-whisper',
      bg: valueExposed > 10000
        ? 'bg-semantic-warning-50 dark:bg-semantic-warning-900/20'
        : 'bg-secondary-50 dark:bg-paper-sub',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            'flex items-center gap-4 p-4 rounded-lg border transition-all duration-250',
            'border-ink-rule',
            'bg-paper dark:bg-dark-bg-secondary',
            isTimeMachine && 'border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-900/10'
          )}
        >
          <div
            className={cn('flex items-center justify-center w-10 h-10 rounded-lg', stat.bg)}
          >
            <stat.icon className={cn('h-5 w-5', stat.color)} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-ink-whisper dark:text-ink-muted uppercase tracking-wide">
              {stat.label}
            </p>
            <p className="text-xl font-semibold text-ink tracking-tight font-mono">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
