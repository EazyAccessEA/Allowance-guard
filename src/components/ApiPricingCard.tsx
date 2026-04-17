'use client'

import React from 'react'
import { Check, Mail, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type ApiPlan,
  API_PLAN_LIMITS,
  API_PRICES,
  getPlanDisplayName,
  formatPrice,
} from '@/lib/plans'
import { useUpgradeFlow } from '@/hooks/useUpgradeFlow'

type ApiPaidPlan = 'api_developer' | 'api_growth'
type ApiCardPlan = 'api_free' | ApiPaidPlan | 'api_enterprise'
type BillingPeriod = 'monthly' | 'yearly'

interface ApiPricingCardProps {
  plan: ApiCardPlan
  billingPeriod?: BillingPeriod
  highlighted?: boolean
}

function getApiYearlySavingsPercent(plan: ApiPaidPlan): number {
  const prices = API_PRICES[plan]
  const monthlyTotal = prices.monthlyPence * 12
  const yearlyTotal = prices.yearlyPence
  return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100)
}

const PLAN_DESCRIPTIONS: Record<ApiCardPlan, string> = {
  api_free: 'Get started at no cost. 100 calls/day.',
  api_developer: 'For developers building DeFi tools and integrations.',
  api_growth: 'High-volume access for products and teams.',
  api_enterprise: 'Custom limits, SLA, and dedicated support.',
}

function getApiFeatures(plan: ApiCardPlan): { label: string; included: boolean }[] {
  const limits = API_PLAN_LIMITS[plan as ApiPlan]
  return [
    {
      label: limits.callsPerDay === -1
        ? 'Unlimited API calls/day'
        : `${limits.callsPerDay.toLocaleString()} calls/day`,
      included: true,
    },
    {
      label: limits.burstPerMinute === -1
        ? 'Unlimited burst rate'
        : `${limits.burstPerMinute} req/min burst`,
      included: true,
    },
    { label: 'Webhook integrations', included: limits.webhooksEnabled },
    { label: 'Priority processing', included: limits.priorityProcessing },
  ]
}

export default function ApiPricingCard({ plan, billingPeriod = 'monthly', highlighted = false }: ApiPricingCardProps) {
  const displayName = getPlanDisplayName(plan)
  const features = getApiFeatures(plan)
  const isPaid = plan === 'api_developer' || plan === 'api_growth'
  const isEnterprise = plan === 'api_enterprise'

  const price = isPaid
    ? billingPeriod === 'yearly'
      ? formatPrice(API_PRICES[plan as ApiPaidPlan].yearlyPence)
      : formatPrice(API_PRICES[plan as ApiPaidPlan].monthlyPence)
    : isEnterprise
      ? 'Custom'
      : '$0'

  const periodLabel = isEnterprise
    ? ''
    : isPaid && billingPeriod === 'yearly'
      ? '/yr'
      : '/mo'

  const savingsPercent = isPaid && billingPeriod === 'yearly'
    ? getApiYearlySavingsPercent(plan as ApiPaidPlan)
    : 0

  const { upgrade, loading, isSigningIn, error, isConnected } = useUpgradeFlow({
    plan,
    billingPeriod,
    displayName,
  })

  return (
    <div
      className={cn(
        'group relative flex flex-col p-6 lg:p-7 transition-all duration-300',
        highlighted
          ? 'bg-paper-sub ring-2 ring-amber-deep/40'
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

      <div className="mb-5">
        <h3 className="text-base font-bold text-ink tracking-tight mb-1">
          {displayName}
        </h3>
        <p className="text-xs text-ink-muted leading-relaxed">
          {PLAN_DESCRIPTIONS[plan]}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-ink">
            {price}
          </span>
          {periodLabel && (
            <span className="text-sm text-ink-whisper font-medium">{periodLabel}</span>
          )}
        </div>
        {savingsPercent > 0 && (
          <p className="mt-1.5 text-xs font-medium text-amber-deep">
            Save {savingsPercent}% vs monthly
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="mb-6">
        {isEnterprise ? (
          <a
            href="mailto:sales@allowanceguard.com?subject=Enterprise API Inquiry"
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-ink bg-paper-sub hover:bg-paper-deep ring-1 ring-ink-rule transition-all duration-200"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact sales
          </a>
        ) : isPaid ? (
          <>
            <button
              onClick={upgrade}
              disabled={loading || isSigningIn}
              className={cn(
                'w-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-deep disabled:opacity-60 disabled:cursor-not-allowed',
                highlighted
                  ? 'bg-oxblood text-cream hover:bg-oxblood/90'
                  : 'bg-paper-sub text-ink hover:bg-paper-deep ring-1 ring-ink-rule',
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
              ) : !isConnected ? `Connect wallet to subscribe` : `Upgrade to ${displayName}`}
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
          <a
            href="/account/api-keys"
            className="block w-full px-4 py-2.5 text-sm font-semibold text-center text-ink bg-paper-sub hover:bg-paper-deep ring-1 ring-ink-rule transition-all duration-200"
          >
            Get free API key
          </a>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-paper-sub mb-5" aria-hidden="true" />

      {/* Features */}
      <ul className="flex flex-col gap-2.5" role="list">
        {features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-2 text-sm">
            <Check
              className={cn(
                'mt-0.5 h-4 w-4 shrink-0',
                feature.included ? 'text-amber-deep' : 'text-ink-whisper'
              )}
              aria-hidden="true"
            />
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
