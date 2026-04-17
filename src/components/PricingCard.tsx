'use client'

import React from 'react'
import Link from 'next/link'
import { Check, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type ConsumerPlan,
  CONSUMER_PLAN_LIMITS,
  CONSUMER_PRICES,
  getPlanDisplayName,
  formatPrice,
} from '@/lib/plans'
import { useUpgradeFlow } from '@/hooks/useUpgradeFlow'

interface PricingCardProps {
  plan: 'free' | 'pro' | 'sentinel'
  billingPeriod: 'monthly' | 'yearly'
  highlighted?: boolean
}

type PaidPlan = Exclude<ConsumerPlan, 'free'>

const PLAN_DESCRIPTIONS: Record<ConsumerPlan, string> = {
  free: 'The open-source scanner. Up to 3 wallets, no account.',
  pro: 'For active DeFi users tracking everything they sign.',
  sentinel: 'For teams treating wallet security as compliance.',
}

interface FeatureItem {
  label: string
  included: boolean
}

function getPlanFeatures(plan: ConsumerPlan): FeatureItem[] {
  const limits = CONSUMER_PLAN_LIMITS[plan]
  return [
    { label: 'All 27 chains', included: true },
    { label: 'Batch revoke', included: limits.batchRevoke },
    { label: 'Export (CSV/PDF)', included: limits.export },
    { label: 'Risk email alerts', included: limits.alerts },
    {
      // "Continuous" overstated the implementation (default 12h cadence).
      // Honest framing: "Twice-daily monitoring".
      label: limits.maxMonitoredWallets > 0
        ? `Twice-daily monitoring (${limits.maxMonitoredWallets} wallets)`
        : 'Twice-daily monitoring',
      included: limits.monitoring,
    },
    { label: 'Time Machine', included: limits.timeMachine },
    { label: 'Team dashboard', included: limits.teams },
    { label: 'Automated rules', included: limits.automatedRules },
    { label: 'Webhooks', included: limits.webhooks },
    { label: 'Priority support', included: limits.prioritySupport },
  ]
}

function getYearlySavingsPercent(plan: PaidPlan): number {
  const prices = CONSUMER_PRICES[plan]
  const monthlyTotal = prices.monthlyPence * 12
  const yearlyTotal = prices.yearlyPence
  return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100)
}

export default function PricingCard({ plan, billingPeriod, highlighted = false }: PricingCardProps) {
  const displayName = getPlanDisplayName(plan)
  const features = getPlanFeatures(plan)
  const isPaid = plan !== 'free'

  const price = isPaid
    ? billingPeriod === 'monthly'
      ? formatPrice(CONSUMER_PRICES[plan as PaidPlan].monthlyPence)
      : formatPrice(CONSUMER_PRICES[plan as PaidPlan].yearlyPence)
    : '$0'

  const periodLabel = isPaid
    ? billingPeriod === 'monthly'
      ? '/mo'
      : '/yr'
    : ''

  const savingsPercent = isPaid ? getYearlySavingsPercent(plan as PaidPlan) : 0

  const { upgrade, loading, isSigningIn, error, isConnected } = useUpgradeFlow({
    plan,
    billingPeriod,
    displayName,
  })

  // CTA reflects what the next click will actually do
  const ctaText = (() => {
    if (plan === 'free') return 'Open the scanner'
    if (!isConnected) return `Connect wallet to subscribe`
    return `Upgrade to ${displayName}`
  })()

  return (
    <div
      className={cn(
        'group relative flex flex-col p-7 lg:p-8 transition-all duration-300',
        highlighted
          ? 'bg-paper-sub ring-2 ring-amber-deep/40 md:-mt-4 md:mb-4'
          : 'bg-paper-sub ring-1 ring-ink-rule'
      )}
    >
      {/* Highlighted glow — amber-deep at low opacity, on-canon */}
      {highlighted && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(133,79,8,0.06) 0%, transparent 60%)',
          }}
        />
      )}

      {/* Badge */}
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center bg-amber-deep px-3.5 py-1 text-xs font-semibold text-cream">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan name + description */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-ink tracking-tight mb-1">
          {displayName}
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed">
          {PLAN_DESCRIPTIONS[plan]}
        </p>
      </div>

      {/* Price — large scale contrast */}
      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight text-ink">
            {price}
          </span>
          {periodLabel && (
            <span className="text-base text-ink-whisper font-medium">{periodLabel}</span>
          )}
        </div>
        {!isPaid && (
          <p className="mt-1 text-sm text-ink-whisper">Free and open source</p>
        )}
        {isPaid && billingPeriod === 'yearly' && savingsPercent > 0 && (
          <p className="mt-1.5 text-sm font-medium text-amber-deep">
            Save {savingsPercent}% vs monthly
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="mb-8">
        {isPaid ? (
          <>
            <button
              onClick={upgrade}
              disabled={loading || isSigningIn}
              className={cn(
                'w-full px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-deep focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
                highlighted
                  ? 'bg-oxblood text-cream hover:bg-oxblood/90 active:bg-oxblood/80'
                  : 'bg-paper-sub text-ink hover:bg-paper-deep ring-1 ring-ink-rule active:bg-paper-sub',
              )}
            >
              {isSigningIn ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Waiting for signature…
                </span>
              ) : loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting…
                </span>
              ) : ctaText}
            </button>
            {isConnected && (
              <p className="mt-2 text-[11px] text-ink-whisper text-center">
                One wallet signature, then secure checkout via Stripe.
              </p>
            )}
            {error && (
              <p className="mt-2 text-xs text-red-800 text-center" role="alert">
                {error}
              </p>
            )}
          </>
        ) : (
          <Link
            href="/#scan"
            className="block w-full px-5 py-3 text-sm font-semibold text-center text-ink bg-paper-sub hover:bg-paper-deep ring-1 ring-ink-rule transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-deep"
          >
            {ctaText}
          </Link>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-paper-sub mb-6" aria-hidden="true" />

      {/* Features list */}
      <ul className="flex flex-col gap-3" role="list">
        {features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-2.5 text-sm">
            {feature.included ? (
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-deep"
                aria-hidden="true"
              />
            ) : (
              <X
                className="mt-0.5 h-4 w-4 shrink-0 text-ink-whisper"
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                feature.included ? 'text-ink-soft' : 'text-ink-whisper'
              )}
            >
              {feature.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
