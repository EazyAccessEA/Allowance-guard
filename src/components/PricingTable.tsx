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
    label: 'Max Wallets',
    values: {
      free: `${CONSUMER_PLAN_LIMITS.free.maxWallets}`,
      pro: 'Unlimited',
      sentinel: 'Unlimited',
    },
  },
  {
    label: 'Multi-chain (6 chains)',
    values: {
      free: false,
      pro: true,
      sentinel: true,
    },
  },
  {
    label: 'Batch Revoke',
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
    label: 'Email Alerts',
    values: {
      free: CONSUMER_PLAN_LIMITS.free.alerts,
      pro: CONSUMER_PLAN_LIMITS.pro.alerts,
      sentinel: CONSUMER_PLAN_LIMITS.sentinel.alerts,
    },
  },
  {
    label: 'Continuous Monitoring',
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
    label: 'Team Dashboard',
    values: {
      free: CONSUMER_PLAN_LIMITS.free.teams,
      pro: CONSUMER_PLAN_LIMITS.pro.teams,
      sentinel: CONSUMER_PLAN_LIMITS.sentinel.teams,
    },
  },
  {
    label: 'Automated Rules',
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
    label: 'Priority Support',
    values: {
      free: CONSUMER_PLAN_LIMITS.free.prioritySupport,
      pro: CONSUMER_PLAN_LIMITS.pro.prioritySupport,
      sentinel: CONSUMER_PLAN_LIMITS.sentinel.prioritySupport,
    },
  },
]

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === 'string') {
    return <span className="text-sm font-medium text-text-primary">{value}</span>
  }
  if (value) {
    return <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" aria-label="Included" />
  }
  return <X className="mx-auto h-5 w-5 text-neutral-300 dark:text-secondary-600" aria-label="Not included" />
}

export default function PricingTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border-primary">
            <th className="py-4 pr-4 text-sm font-medium text-text-secondary">
              Feature
            </th>
            {PLANS.map((plan) => (
              <th
                key={plan}
                className={cn(
                  'px-4 py-4 text-center text-sm font-medium',
                  plan === 'pro' ? 'text-primary-700 dark:text-primary-400' : 'text-text-primary dark:text-secondary-100'
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
                'border-b border-border-primary',
                idx % 2 === 1 && 'bg-neutral-50 dark:bg-secondary-800/50'
              )}
            >
              <td className="py-3 pr-4 text-sm text-text-primary">
                {row.label}
              </td>
              {PLANS.map((plan) => (
                <td key={plan} className="px-4 py-3 text-center">
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
