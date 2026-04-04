'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
  isPaidPlan,
} from '@/lib/plans'
import {
  ArrowLeft,
  ExternalLink,
  Check,
  Clock,
  Receipt,
  Download,
  FileText,
  Loader2,
} from 'lucide-react'
import { useUserPlan } from '@/hooks/useUserPlan'
import { InlineError } from '@/components/ErrorBoundary'
import EmptyState from '@/components/EmptyState'

interface Invoice {
  stripeInvoiceId: string
  amountDue: number
  amountPaid: number
  currency: string
  status: string
  plan: string | null
  periodStart: string | null
  periodEnd: string | null
  hostedInvoiceUrl: string | null
  invoicePdfUrl: string | null
  invoiceNumber: string | null
  description: string | null
  attemptCount: number
  paidAt: string | null
  createdAt: string
}

function formatInvoiceAmount(minorUnits: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minorUnits / 100)
}

function invoiceStatusBadge(status: string) {
  switch (status) {
    case 'paid':
      return <Badge variant="success" size="sm">Paid</Badge>
    case 'open':
      return <Badge variant="warning" size="sm">Open</Badge>
    case 'past_due':
      return <Badge variant="warning" size="sm">Past Due</Badge>
    case 'draft':
      return <Badge variant="secondary" size="sm">Draft</Badge>
    case 'uncollectible':
    case 'void':
      return <Badge variant="destructive" size="sm">{status === 'void' ? 'Void' : 'Uncollectible'}</Badge>
    default:
      return <Badge variant="secondary" size="sm">{status}</Badge>
  }
}

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
  const { plan: currentPlan, status: planStatus, currentPeriodEnd } = useUserPlan()
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState<string | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invoicesLoading, setInvoicesLoading] = useState(true)
  const [invoicesError, setInvoicesError] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    setInvoicesLoading(true)
    setInvoicesError(null)
    try {
      const res = await fetch('/api/billing/invoices')
      if (res.ok) {
        const data = await res.json()
        setInvoices(data.invoices ?? [])
      } else if (res.status === 401) {
        setInvoices([])
      } else {
        setInvoicesError('Failed to load invoices.')
      }
    } catch {
      setInvoicesError('Network error loading invoices.')
    } finally {
      setInvoicesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  async function openBillingPortal() {
    setPortalLoading(true)
    setPortalError(null)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      if (res.ok) {
        const { url } = await res.json()
        if (url) window.location.href = url
      } else if (res.status === 404) {
        window.location.href = '/pricing'
      } else {
        setPortalError('Failed to open billing portal. Please try again.')
      }
    } catch {
      setPortalError('Network error. Please check your connection and try again.')
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
                {planStatus === 'trialing' && (
                  <span className="ml-1 text-primary-600 font-medium">(Trial)</span>
                )}
                {planStatus === 'past_due' && (
                  <span className="ml-1 text-semantic-warning-600 font-medium">(Payment past due)</span>
                )}
              </p>
              {currentPeriodEnd && isPaidPlan(currentPlan) && (
                <p className="text-xs text-text-secondary mt-1">
                  {planStatus === 'trialing' ? 'Trial ends' : 'Renews'}{' '}
                  {new Date(currentPeriodEnd).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
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
              {portalError && (
                <InlineError message={portalError} onRetry={openBillingPortal} />
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
              <div className="flex items-center justify-between">
                <CardTitle>Payment History</CardTitle>
                {invoices.length > 0 && (
                  <span className="text-xs text-text-secondary">
                    {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-text-secondary" />
                  <span className="ml-2 text-sm text-text-secondary">Loading invoices…</span>
                </div>
              ) : invoicesError ? (
                <InlineError message={invoicesError} onRetry={fetchInvoices} />
              ) : invoices.length === 0 ? (
                <EmptyState
                  icon={<Receipt className="h-8 w-8" />}
                  title="No payment history yet"
                  description="Payment history and invoices will appear here once you have an active subscription."
                />
              ) : (
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border-primary text-left text-text-secondary">
                        <th className="px-2 py-2 font-medium">Invoice</th>
                        <th className="px-2 py-2 font-medium">Date</th>
                        <th className="px-2 py-2 font-medium">Amount</th>
                        <th className="px-2 py-2 font-medium">Status</th>
                        <th className="px-2 py-2 font-medium">Plan</th>
                        <th className="px-2 py-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.stripeInvoiceId} className="border-b border-border-primary last:border-0 hover:bg-background-secondary transition-colors">
                          <td className="px-2 py-3 font-mono text-xs">
                            {inv.invoiceNumber ?? inv.stripeInvoiceId.slice(0, 12)}
                          </td>
                          <td className="px-2 py-3 text-text-secondary">
                            {new Date(inv.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-2 py-3 font-medium">
                            {formatInvoiceAmount(
                              inv.status === 'paid' ? inv.amountPaid : inv.amountDue,
                              inv.currency,
                            )}
                          </td>
                          <td className="px-2 py-3">
                            {invoiceStatusBadge(inv.status)}
                          </td>
                          <td className="px-2 py-3 text-text-secondary">
                            {inv.plan ? getPlanDisplayName(inv.plan as ConsumerPlan) : '—'}
                          </td>
                          <td className="px-2 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {inv.invoicePdfUrl && (
                                <a
                                  href={inv.invoicePdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors"
                                  title="Download PDF"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  PDF
                                </a>
                              )}
                              {inv.hostedInvoiceUrl && (
                                <a
                                  href={inv.hostedInvoiceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors"
                                  title="View invoice"
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                  View
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
