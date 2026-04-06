'use client'

import React, { useState } from 'react'
import { Check, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type ApiPlan,
  API_PLAN_LIMITS,
  API_PRICES,
  getPlanDisplayName,
  formatPrice,
} from '@/lib/plans'
import { trackClientEvent } from '@/lib/analytics'
import PaymentMethodModal from './PaymentMethodModal'

type ApiPaidPlan = 'api_developer' | 'api_growth'
type ApiCardPlan = 'api_free' | ApiPaidPlan | 'api_enterprise'

interface ApiPricingCardProps {
  plan: ApiCardPlan
  highlighted?: boolean
}

const PLAN_DESCRIPTIONS: Record<ApiCardPlan, string> = {
  api_free: 'Get started with the AllowanceGuard API at no cost.',
  api_developer: 'For developers building DeFi integrations and tools.',
  api_growth: 'For teams and products that need high-volume access.',
  api_enterprise: 'Custom limits, SLA, and dedicated support for large-scale use.',
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
        : `${limits.burstPerMinute} requests/min burst`,
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

  const periodLabel = isEnterprise ? '' : '/month'

  const [modalOpen, setModalOpen] = useState(false)

  function handleUpgrade() {
    trackClientEvent('upgrade_clicked', { plan, billingPeriod: 'monthly' })
    setModalOpen(true)
  }

  const ctaClassName = cn(
    'inline-flex items-center justify-center rounded-base px-4 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2',
    highlighted
      ? 'bg-primary-700 text-white shadow-sm hover:bg-primary-800 active:bg-primary-900'
      : isPaid
        ? 'border border-primary-300 bg-primary-50 text-primary-800 hover:bg-primary-100 hover:border-primary-400'
        : 'border border-neutral-400 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-500',
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
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full border border-primary-700 bg-primary-700 px-3 py-0.5 text-xs font-medium text-white">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-medium tracking-tight text-text-primary">
          {displayName}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">
          {PLAN_DESCRIPTIONS[plan]}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-text-primary">
            {price}
          </span>
          {periodLabel && (
            <span className="text-sm text-text-secondary">{periodLabel}</span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mb-6">
        {isEnterprise ? (
          <a
            href="mailto:sales@allowanceguard.com?subject=Enterprise API Inquiry"
            className={ctaClassName}
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Sales
          </a>
        ) : isPaid ? (
          <>
            <button onClick={handleUpgrade} className={ctaClassName}>
              {`Get ${displayName}`}
            </button>
            <PaymentMethodModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              plan={plan}
              planDisplayName={displayName}
              billingPeriod="monthly"
            />
          </>
        ) : (
          <a href="/account/api-keys" className={ctaClassName}>
            Get Free API Key
          </a>
        )}
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-3" role="list">
        {features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-2 text-sm">
            <Check
              className={cn(
                'mt-0.5 h-4 w-4 shrink-0',
                feature.included ? 'text-green-600' : 'text-neutral-300'
              )}
              aria-hidden="true"
            />
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
