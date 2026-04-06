'use client'

import React, { useState } from 'react'
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
import { trackClientEvent } from '@/lib/analytics'

interface PricingCardProps {
  plan: 'free' | 'pro' | 'sentinel'
  billingPeriod: 'monthly' | 'yearly'
  highlighted?: boolean
}

type PaidPlan = Exclude<ConsumerPlan, 'free'>

const PLAN_DESCRIPTIONS: Record<ConsumerPlan, string> = {
  free: 'Scan, score, and revoke — open source, no account required.',
  pro: 'Unlimited wallets, continuous monitoring, and batch revoke.',
  sentinel: 'Team dashboards, automated rules, and compliance audit logs.',
}

interface FeatureItem {
  label: string
  included: boolean
}

function getPlanFeatures(plan: ConsumerPlan): FeatureItem[] {
  const limits = CONSUMER_PLAN_LIMITS[plan]
  return [
    {
      label: limits.maxWallets === -1 ? 'Unlimited wallets' : `${limits.maxWallets} wallets`,
      included: true,
    },
    {
      label: limits.maxChains === 1 ? '1 chain' : `${limits.maxChains} chains`,
      included: true,
    },
    { label: 'Batch revoke', included: limits.batchRevoke },
    { label: 'Export (CSV/PDF)', included: limits.export },
    { label: 'Email alerts', included: limits.alerts },
    { label: 'Continuous monitoring', included: limits.monitoring },
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

  const ctaText = plan === 'free' ? 'Start Scanning' : `Upgrade to ${displayName}`

  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  async function handleUpgrade() {
    setCheckoutLoading(true)
    setCheckoutError(null)

    trackClientEvent('upgrade_clicked', { plan, billingPeriod })

    try {
      const res = await fetch('/api/billing/create-subscription', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan, interval: billingPeriod }),
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
        trackClientEvent('checkout_started', { plan, billingPeriod })
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
        'group relative flex flex-col rounded-2xl p-7 lg:p-8 transition-all duration-300',
        highlighted
          ? 'bg-white/[0.06] ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/5 md:-mt-4 md:mb-4'
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

      {/* Badge */}
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center rounded-full bg-amber-500 px-3.5 py-1 text-xs font-semibold text-slate-900 shadow-md shadow-amber-500/20">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan name + description */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight mb-1">
          {displayName}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {PLAN_DESCRIPTIONS[plan]}
        </p>
      </div>

      {/* Price — large scale contrast */}
      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight text-white">
            {price}
          </span>
          {periodLabel && (
            <span className="text-base text-slate-500 font-medium">{periodLabel}</span>
          )}
        </div>
        {!isPaid && (
          <p className="mt-1 text-sm text-slate-500">Free and open source</p>
        )}
        {isPaid && billingPeriod === 'yearly' && savingsPercent > 0 && (
          <p className="mt-1.5 text-sm font-medium text-emerald-400">
            Save {savingsPercent}% vs monthly
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="mb-8">
        {isPaid ? (
          <button
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className={cn(
              'w-full rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E1A]',
              highlighted
                ? 'bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-md shadow-amber-500/20 active:bg-amber-600'
                : 'bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/10 active:bg-white/20',
              checkoutLoading && 'opacity-70 cursor-wait',
            )}
          >
            {checkoutLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              ctaText
            )}
          </button>
        ) : (
          <Link
            href="/"
            className="block w-full rounded-xl px-5 py-3 text-sm font-semibold text-center text-slate-300 bg-white/[0.06] hover:bg-white/10 ring-1 ring-white/[0.08] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            {ctaText}
          </Link>
        )}
        {checkoutError && (
          <p className="mt-2 text-xs text-red-400">{checkoutError}</p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mb-6" aria-hidden="true" />

      {/* Features list */}
      <ul className="flex flex-col gap-3" role="list">
        {features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-2.5 text-sm">
            {feature.included ? (
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                aria-hidden="true"
              />
            ) : (
              <X
                className="mt-0.5 h-4 w-4 shrink-0 text-slate-600"
                aria-hidden="true"
              />
            )}
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
