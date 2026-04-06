'use client'

import React, { useState } from 'react'
import { Check, Loader2, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type ApiPlan,
  API_PLAN_LIMITS,
  API_PRICES,
  getPlanDisplayName,
  formatPrice,
} from '@/lib/plans'
import { trackClientEvent } from '@/lib/analytics'

type ApiPaidPlan = 'api_developer' | 'api_growth'
type ApiCardPlan = 'api_free' | ApiPaidPlan | 'api_enterprise'

interface ApiPricingCardProps {
  plan: ApiCardPlan
  highlighted?: boolean
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

export default function ApiPricingCard({ plan, highlighted = false }: ApiPricingCardProps) {
  const displayName = getPlanDisplayName(plan)
  const features = getApiFeatures(plan)
  const isPaid = plan === 'api_developer' || plan === 'api_growth'
  const isEnterprise = plan === 'api_enterprise'

  const price = isPaid
    ? formatPrice(API_PRICES[plan as ApiPaidPlan].monthlyPence)
    : isEnterprise
      ? 'Custom'
      : '$0'

  const periodLabel = isEnterprise ? '' : '/mo'

  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  async function handleUpgrade() {
    setCheckoutLoading(true)
    setCheckoutError(null)

    trackClientEvent('upgrade_clicked', { plan, billingPeriod: 'monthly' })

    try {
      const res = await fetch('/api/billing/create-subscription', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan, interval: 'monthly' }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login?redirect=/pricing'
          return
        }
        setCheckoutError(data.error ?? 'Something went wrong')
        return
      }

      if (data.checkoutUrl) {
        trackClientEvent('checkout_started', { plan, billingPeriod: 'monthly' })
        window.location.href = data.checkoutUrl
      }
    } catch {
      setCheckoutError('Network error. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl p-6 lg:p-7 transition-all duration-300',
        highlighted
          ? 'bg-white/[0.06] ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/5'
          : 'bg-white/[0.03] ring-1 ring-white/[0.08] hover:ring-white/[0.15] hover:bg-white/[0.05]'
      )}
    >
      {/* Highlighted glow */}
      {highlighted && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 60%)',
          }}
        />
      )}

      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center rounded-full bg-amber-500 px-3 py-0.5 text-xs font-semibold text-slate-900 shadow-md shadow-amber-500/20">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-base font-bold text-white tracking-tight mb-1">
          {displayName}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {PLAN_DESCRIPTIONS[plan]}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-white">
            {price}
          </span>
          {periodLabel && (
            <span className="text-sm text-slate-500 font-medium">{periodLabel}</span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mb-6">
        {isEnterprise ? (
          <a
            href="mailto:sales@allowanceguard.com?subject=Enterprise API Inquiry"
            className="flex items-center justify-center w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 bg-white/[0.06] hover:bg-white/10 ring-1 ring-white/[0.08] transition-all duration-200"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Sales
          </a>
        ) : isPaid ? (
          <button
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className={cn(
              'w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
              highlighted
                ? 'bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/10',
              checkoutLoading && 'opacity-70 cursor-wait',
            )}
          >
            {checkoutLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              `Get ${displayName}`
            )}
          </button>
        ) : (
          <a
            href="/account/api-keys"
            className="block w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-center text-slate-300 bg-white/[0.06] hover:bg-white/10 ring-1 ring-white/[0.08] transition-all duration-200"
          >
            Get Free API Key
          </a>
        )}
        {checkoutError && (
          <p className="mt-2 text-xs text-red-400">{checkoutError}</p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mb-5" aria-hidden="true" />

      {/* Features */}
      <ul className="flex flex-col gap-2.5" role="list">
        {features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-2 text-sm">
            <Check
              className={cn(
                'mt-0.5 h-4 w-4 shrink-0',
                feature.included ? 'text-emerald-400' : 'text-slate-600'
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                feature.included ? 'text-slate-300' : 'text-slate-600'
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
