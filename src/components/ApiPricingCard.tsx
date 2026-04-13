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

  const [modalOpen, setModalOpen] = useState(false)

  function handleUpgrade() {
    trackClientEvent('upgrade_clicked', { plan, billingPeriod: 'monthly' })
    setModalOpen(true)
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col  p-6 lg:p-7 transition-all duration-300',
        highlighted
          ? 'bg-paper-sub ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/5'
          : 'bg-paper-sub ring-1 ring-ink-rule hover:ring-ink-rule hover:bg-paper-sub'
      )}
    >
      {/* Highlighted glow */}
      {highlighted && (
        <div
          className="absolute inset-0  pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 60%)',
          }}
        />
      )}

      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center  bg-amber-500 px-3 py-0.5 text-xs font-semibold text-ink shadow-md shadow-amber-500/20">
            Most Popular
          </span>
        </div>
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
      </div>

      {/* CTA */}
      <div className="mb-6">
        {isEnterprise ? (
          <a
            href="mailto:sales@allowanceguard.com?subject=Enterprise API Inquiry"
            className="flex items-center justify-center w-full  px-4 py-2.5 text-sm font-semibold text-ink-soft bg-paper-sub hover:bg-paper-sub ring-1 ring-ink-rule transition-all duration-200"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Sales
          </a>
        ) : isPaid ? (
          <>
            <button
              onClick={handleUpgrade}
              className={cn(
                'w-full  px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                highlighted
                  ? 'bg-amber-500 text-ink hover:bg-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-paper-sub text-ink hover:bg-white/15 ring-1 ring-ink-rule',
              )}
            >
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
          <a
            href="/account/api-keys"
            className="block w-full  px-4 py-2.5 text-sm font-semibold text-center text-ink-soft bg-paper-sub hover:bg-paper-sub ring-1 ring-ink-rule transition-all duration-200"
          >
            Get Free API Key
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
                feature.included ? 'text-emerald-800' : 'text-ink-whisper'
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
