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
  free: 'Core security scanning, always free and open source.',
  pro: 'Unlimited wallets, multi-chain monitoring, and export tools.',
  sentinel: 'Team dashboards, automated rules, and compliance-ready audit logs.',
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
      label: limits.maxChains === 1 ? '1 chain' : `${limits.maxChains} chains (multi-chain)`,
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
      ? '/month'
      : '/year'
    : '/forever'

  const savingsPercent = isPaid ? getYearlySavingsPercent(plan as PaidPlan) : 0

  const ctaText = plan === 'free' ? 'Get Started' : `Upgrade to ${displayName}`

  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  async function handleUpgrade() {
    setCheckoutLoading(true)
    setCheckoutError(null)

    // Track upgrade_clicked analytics event
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
          // User not logged in — redirect to login
          window.location.href = '/login?redirect=/pricing'
          return
        }
        setCheckoutError(data.error ?? 'Something went wrong')
        return
      }

      if (data.checkoutUrl) {
        // Track checkout_started before redirect
        trackClientEvent('checkout_started', { plan, billingPeriod })
        window.location.href = data.checkoutUrl
      }
    } catch {
      setCheckoutError('Network error. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const ctaClassName = cn(
    'mb-6 inline-flex items-center justify-center rounded-base px-4 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2',
    highlighted
      ? 'bg-primary-700 text-white shadow-sm hover:bg-primary-800 active:bg-primary-900'
      : isPaid
        ? 'border border-primary-300 bg-primary-50 text-primary-800 hover:bg-primary-100 hover:border-primary-400'
        : 'border border-neutral-400 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-500',
    checkoutLoading && 'opacity-70 cursor-wait',
  )

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-base border bg-background-primary p-6 shadow-sm transition-all duration-150',
        highlighted
          ? 'border-primary-700 shadow-md ring-1 ring-primary-700'
          : 'border-border-primary'
      )}
    >
      {/* Most Popular badge */}
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full border border-primary-700 bg-primary-700 px-3 py-0.5 text-xs font-medium text-white">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan name and description */}
      <div className="mb-4">
        <h3 className="text-xl font-medium tracking-tight text-text-primary">
          {displayName}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">
          {PLAN_DESCRIPTIONS[plan]}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-text-primary">
            {price}
          </span>
          <span className="text-sm text-text-secondary">{periodLabel}</span>
        </div>
        {isPaid && billingPeriod === 'yearly' && savingsPercent > 0 && (
          <p className="mt-1 text-sm font-medium text-green-700">
            Save {savingsPercent}% vs monthly
          </p>
        )}
      </div>

      {/* CTA */}
      {isPaid ? (
        <button
          onClick={handleUpgrade}
          disabled={checkoutLoading}
          className={ctaClassName}
        >
          {checkoutLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting to checkout...
            </>
          ) : (
            ctaText
          )}
        </button>
      ) : (
        <Link href="/" className={ctaClassName}>
          {ctaText}
        </Link>
      )}
      {checkoutError && (
        <p className="mb-4 -mt-4 text-xs text-red-600">{checkoutError}</p>
      )}

      {/* Features list */}
      <ul className="flex flex-col gap-3" role="list">
        {features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-2 text-sm">
            {feature.included ? (
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
                aria-hidden="true"
              />
            ) : (
              <X
                className="mt-0.5 h-4 w-4 shrink-0 text-neutral-300"
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                feature.included ? 'text-text-primary' : 'text-text-secondary'
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
