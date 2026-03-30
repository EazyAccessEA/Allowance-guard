'use client'

import React, { useState } from 'react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import PlanBadge from '@/components/PlanBadge'
import { cn } from '@/lib/utils'
import {
  ConsumerPlan,
  getPlanDisplayName,
  formatPrice,
  CONSUMER_PRICES,
  CONSUMER_PLAN_LIMITS,
  isPaidPlan,
  isUnlimited,
} from '@/lib/plans'
import {
  ArrowLeft,
  ExternalLink,
  Check,
  Clock,
  CreditCard,
} from 'lucide-react'

const PLANS: { key: ConsumerPlan; features: string[] }[] = [
  {
    key: 'free',
    features: [
      'Scan up to 3 wallets',
      'Single-chain view',
      'Manual revocation',
      'Basic risk labels',
    ],
  },
  {
    key: 'pro',
    features: [
      'Unlimited wallets',
      'Multi-chain portfolio view',
      'Continuous monitoring',
      'Batch revocation',
      'Export audit reports',
    ],
  },
  {
    key: 'sentinel',
    features: [
      'Everything in Pro',
      'Monitor up to 50 wallets',
      'Automated revocation rules',
      'Team dashboard',
      'Compliance audit logs',
      'Webhook integrations',
      'Priority support',
    ],
  },
]

export default function BillingPage() {
  const [currentPlan] = useState<ConsumerPlan>('free')
  const [portalLoading, setPortalLoading] = useState(false)

  async function openBillingPortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/billing/manage', { method: 'POST' })
      if (res.ok) {
        const { url } = await res.json()
        if (url) window.location.href = url
      }
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <Section size="sm" background="muted">
      <Container size="lg">
        <div className="space-y-8">
          {/* Back link */}
          <a
            href="/account"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account
          </a>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Billing</h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage your subscription and payment method.
            </p>
          </div>

          {/* Current plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Plan</CardTitle>
                <PlanBadge plan={currentPlan} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-secondary">
                You are currently on the{' '}
                <span className="font-semibold text-text-primary">
                  {getPlanDisplayName(currentPlan)}
                </span>{' '}
                plan.
              </p>
              {isPaidPlan(currentPlan) && (
                <Button
                  variant="secondary"
                  size="sm"
                  loading={portalLoading}
                  rightIcon={<ExternalLink className="h-4 w-4" />}
                  onClick={openBillingPortal}
                >
                  Billing Portal
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Change Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Change Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map(({ key, features }) => {
                  const isCurrent = key === currentPlan
                  const price =
                    key === 'free'
                      ? null
                      : CONSUMER_PRICES[key as Exclude<ConsumerPlan, 'free'>]

                  return (
                    <div
                      key={key}
                      className={cn(
                        'rounded-lg border p-5 space-y-4 transition-all duration-150',
                        isCurrent
                          ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-200'
                          : 'border-border-primary bg-background-primary hover:border-primary-200'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-text-primary">
                          {getPlanDisplayName(key)}
                        </h3>
                        {isCurrent && (
                          <Badge variant="primary" size="sm">
                            Current
                          </Badge>
                        )}
                      </div>

                      <div className="text-text-primary">
                        {price ? (
                          <>
                            <span className="text-2xl font-bold">
                              {formatPrice(price.monthlyPence, price.currency)}
                            </span>
                            <span className="text-sm text-text-secondary">
                              /month
                            </span>
                            <p className="text-xs text-text-secondary mt-0.5">
                              or{' '}
                              {formatPrice(price.yearlyPence, price.currency)}
                              /year
                            </p>
                          </>
                        ) : (
                          <span className="text-2xl font-bold">Free</span>
                        )}
                      </div>

                      <ul className="space-y-2">
                        {features.map((feat) => (
                          <li
                            key={feat}
                            className="flex items-start gap-2 text-sm text-text-secondary"
                          >
                            <Check className="h-4 w-4 text-semantic-success-500 flex-shrink-0 mt-0.5" />
                            {feat}
                          </li>
                        ))}
                      </ul>

                      {!isCurrent && (
                        <Button
                          variant={key === 'free' ? 'outline' : 'primary'}
                          size="sm"
                          fullWidth
                          onClick={() =>
                            (window.location.href = '/pricing')
                          }
                        >
                          {key === 'free' ? 'Downgrade' : 'Upgrade'}
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Payment history */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Clock className="h-8 w-8 text-text-secondary mb-2" />
                <p className="text-sm font-medium text-text-primary">
                  Coming soon
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Payment history and invoices will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
