'use client'

import React from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CONSUMER_PLAN_LIMITS, getPlanDisplayName } from '@/lib/plans'

type PlanKey = 'free' | 'pro' | 'sentinel'

const PLANS: PlanKey[] = ['free', 'pro', 'sentinel']

interface FeatureRow {
  label: string
  values: Record<PlanKey, string | boolean>
}

const FEATURE_ROWS: FeatureRow[] = [
  {
    label: 'Chains supported',
    values: {
      free: '27',
      pro: '27',
      sentinel: '27',
    },
  },
  {
    label: 'Batch revoke',
    values: {
      free: CONSUMER_PLAN_LIMITS.free.batchRevoke,
      pro: CONSUMER_PLAN_LIMITS.pro.batchRevoke,
      sentinel: CONSUMER_PLAN_LIMITS.sentinel.batchRevoke,
    },
  },
  {
    label: 'Export (CSV/PDF)',
    values: {
      free: CONSUMER_PLAN_LIMITS.free.export,
      pro: CONSUMER_PLAN_LIMITS.pro.export,
      sentinel: CONSUMER_PLAN_LIMITS.sentinel.export,
    },
  },
  {
    label: 'Risk email alerts',
    values: {
      free: CONSUMER_PLAN_LIMITS.free.alerts,
      pro: CONSUMER_PLAN_LIMITS.pro.alerts,
      sentinel: CONSUMER_PLAN_LIMITS.sentinel.alerts,
    },
  },
  {
    label: 'Twice-daily monitoring (12h cadence)',
    values: {
      free: CONSUMER_PLAN_LIMITS.free.monitoring,
      pro: `${CONSUMER_PLAN_LIMITS.pro.maxMonitoredWallets} wallets`,
      sentinel: `${CONSUMER_PLAN_LIMITS.sentinel.maxMonitoredWallets} wallets`,
    },
  },
  {
    label: 'Time Machine',
    values: {
      free: CONSUMER_PLAN_LIMITS.free.timeMachine,
      pro: CONSUMER_PLAN_LIMITS.pro.timeMachine,
      sentinel: CONSUMER_PLAN_LIMITS.sentinel.timeMachine,
    },
  },
  {
    label: 'Team dashboard',
    values: {
      free: CONSUMER_PLAN_LIMITS.free.teams,
      pro: CONSUMER_PLAN_LIMITS.pro.teams,
      sentinel: CONSUMER_PLAN_LIMITS.sentinel.teams,
    },
  },
  {
    label: 'Automated rules',
    values: {
      free: CONSUMER_PLAN_LIMITS.free.automatedRules,
      pro: CONSUMER_PLAN_LIMITS.pro.automatedRules,
      sentinel: CONSUMER_PLAN_LIMITS.sentinel.automatedRules,
    },
  },
  {
    label: 'Webhooks',
    values: {
      free: CONSUMER_PLAN_LIMITS.free.webhooks,
      pro: CONSUMER_PLAN_LIMITS.pro.webhooks,
      sentinel: CONSUMER_PLAN_LIMITS.sentinel.webhooks,
    },
  },
  {
    label: 'Priority support',
    values: {
      free: CONSUMER_PLAN_LIMITS.free.prioritySupport,
      pro: CONSUMER_PLAN_LIMITS.pro.prioritySupport,
      sentinel: CONSUMER_PLAN_LIMITS.sentinel.prioritySupport,
    },
  },
]

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === 'string') {
    return <span className="text-sm font-medium text-ink">{value}</span>
  }
  if (value) {
    return <Check className="mx-auto h-5 w-5 text-amber-deep" aria-label="Included" />
  }
  return <X className="mx-auto h-5 w-5 text-ink-whisper" aria-label="Not included" />
}

export default function PricingTable() {
  return (
    <div className="w-full overflow-x-auto bg-paper-sub border border-ink-rule p-1">
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink-rule/50">
            <th className="py-4 px-4 text-sm font-medium text-ink-muted">
              Feature
            </th>
            {PLANS.map((plan) => (
              <th
                key={plan}
                className={cn(
                  'px-4 py-4 text-center text-sm font-semibold',
                  plan === 'pro' ? 'text-amber-deep' : 'text-ink-soft'
                )}
              >
                {getPlanDisplayName(plan)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FEATURE_ROWS.map((row, idx) => (
            <tr
              key={row.label}
              className={cn(
                'border-b border-ink-rule/30',
                idx % 2 === 1 && 'bg-paper-sub'
              )}
            >
              <td className="py-3.5 px-4 text-sm text-ink-soft">
                {row.label}
              </td>
              {PLANS.map((plan) => (
                <td key={plan} className="px-4 py-3.5 text-center">
                  <CellValue value={row.values[plan]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
