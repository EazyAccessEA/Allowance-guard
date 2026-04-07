'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
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

export default function PlanCard({
  plan,
  currentPeriodEnd,
  status = 'active',
}: PlanCardProps) {
  const limits = CONSUMER_PLAN_LIMITS[plan as ConsumerPlan]
  const paid = isPaidPlan(plan as ConsumerPlan)
  const statusCfg = statusConfig[status]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Current Plan</CardTitle>
          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan name + badge */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-text-primary">
            {getPlanDisplayName(plan as ConsumerPlan)}
          </span>
          <PlanBadge plan={plan as ConsumerPlan} />
        </div>

        {/* Billing period */}
        {currentPeriodEnd && paid && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <CalendarDays className="h-4 w-4" />
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-secondary-700 p-3">
            <Wallet className="h-5 w-5 text-primary-700" />
            <div>
              <p className="text-xs text-text-secondary">Wallets</p>
              <p className="text-sm font-semibold text-text-primary">
                {isUnlimited(limits.maxWallets) ? 'Unlimited' : `Up to ${limits.maxWallets}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-secondary-700 p-3">
            <Zap className="h-5 w-5 text-primary-700" />
            <div>
              <p className="text-xs text-text-secondary">API Calls / Day</p>
              <p className="text-sm font-semibold text-text-primary">
                {isUnlimited(limits.maxApiCallsPerDay)
                  ? 'Unlimited'
                  : limits.maxApiCallsPerDay.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-secondary-700 p-3">
            <svg
              className="h-5 w-5 text-primary-700"
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
            <div>
              <p className="text-xs text-text-secondary">Chains</p>
              <p className="text-sm font-semibold text-text-primary">
                {limits.maxChains === 1 ? '1 chain' : `${limits.maxChains} chains`}
              </p>
            </div>
          </div>
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
      </CardContent>
    </Card>
  )
}
