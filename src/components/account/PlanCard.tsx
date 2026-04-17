'use client'

/**
 * PlanCard — unified Ledger canon.
 *
 * Renders on the account surface (post-ADR 0007, Ledger everywhere). Uses
 * `.paper-card` directly rather than the `ui/Card` primitive because
 * `Card`'s variant matrix is still being pruned of Glass residue — once
 * that's done, this file should migrate back to `<Card>`.
 */

import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import PlanBadge from '@/components/PlanBadge'
import {
  type ConsumerPlan,
  getPlanDisplayName,
  CONSUMER_PLAN_LIMITS,
  isPaidPlan,
  isUnlimited,
} from '@/lib/plans'
import {
  CalendarDays,
  Wallet,
  Zap,
  ArrowUpRight,
  Settings,
} from 'lucide-react'

interface PlanCardProps {
  plan: 'free' | 'pro' | 'sentinel'
  currentPeriodEnd?: string
  status?: 'active' | 'trialing' | 'past_due' | 'canceled'
}

const statusConfig: Record<
  NonNullable<PlanCardProps['status']>,
  { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }
> = {
  active: { label: 'Active', variant: 'success' },
  trialing: { label: 'Trialing', variant: 'info' },
  past_due: { label: 'Past Due', variant: 'warning' },
  canceled: { label: 'Canceled', variant: 'danger' },
}

function LimitTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 border border-ink-rule bg-paper-sub p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-rule bg-paper text-amber-deep">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-plex text-xs text-ink-muted">{label}</p>
        <p className="font-plex text-sm font-semibold text-ink truncate">{value}</p>
      </div>
    </div>
  )
}

export default function PlanCard({
  plan,
  currentPeriodEnd,
  status = 'active',
}: PlanCardProps) {
  const limits = CONSUMER_PLAN_LIMITS[plan as ConsumerPlan]
  const paid = isPaidPlan(plan as ConsumerPlan)
  const statusCfg = statusConfig[status]

  return (
    <div className="paper-card p-6 sm:p-7">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
          Current Plan
        </h2>
        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
      </div>

      <div className="space-y-6">
        {/* Plan name + badge */}
        <div className="flex items-center gap-3">
          <span className="font-display-tight text-2xl text-ink">
            {getPlanDisplayName(plan as ConsumerPlan)}
          </span>
          <PlanBadge plan={plan as ConsumerPlan} />
        </div>

        {/* Billing period */}
        {currentPeriodEnd && paid && (
          <div className="flex items-center gap-2 font-plex text-sm text-ink-muted">
            <CalendarDays className="h-4 w-4 text-ink-whisper" />
            <span>
              Current period ends{' '}
              {new Date(currentPeriodEnd).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        )}

        {/* Usage summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <LimitTile
            icon={<Wallet className="h-4 w-4" />}
            label="Wallets"
            value={
              isUnlimited(limits.maxWallets)
                ? 'Unlimited'
                : `Up to ${limits.maxWallets}`
            }
          />
          <LimitTile
            icon={<Zap className="h-4 w-4" />}
            label="API Calls / Day"
            value={
              isUnlimited(limits.maxApiCallsPerDay)
                ? 'Unlimited'
                : limits.maxApiCallsPerDay.toLocaleString()
            }
          />
          <LimitTile
            icon={
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            }
            label="Chains"
            value={
              limits.maxChains === 1 ? '1 chain' : `${limits.maxChains} chains`
            }
          />
        </div>

        {/* Action button */}
        <div>
          {paid ? (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Settings className="h-4 w-4" />}
              onClick={() => (window.location.href = '/account/billing')}
            >
              Manage Subscription
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowUpRight className="h-4 w-4" />}
              onClick={() => (window.location.href = '/pricing')}
            >
              Upgrade
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
