'use client'

import React, { useState } from 'react'
import { CreditCard, Bitcoin, Loader2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import { trackClientEvent } from '@/lib/analytics'

type BillingPeriod = 'monthly' | 'yearly'
type Method = 'stripe' | 'coinbase'

interface PaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  plan: string
  planDisplayName: string
  billingPeriod: BillingPeriod
}

export default function PaymentMethodModal({
  isOpen,
  onClose,
  plan,
  planDisplayName,
  billingPeriod,
}: PaymentMethodModalProps) {
  const [loading, setLoading] = useState<Method | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function startCheckout(method: Method) {
    setLoading(method)
    setError(null)

    trackClientEvent('checkout_started', { plan, billingPeriod, method })

    const endpoint =
      method === 'stripe'
        ? '/api/billing/create-subscription'
        : '/api/billing/create-crypto-subscription'

    try {
      const res = await fetch(endpoint, {
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
        setError(data.error ?? 'Something went wrong')
        return
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
        return
      }
      setError('No checkout URL returned')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Upgrade to ${planDisplayName}`}
      description="Choose how you'd like to pay"
    >
      <div className="space-y-3">
        <MethodButton
          icon={<CreditCard className="h-5 w-5" />}
          title="Credit or debit card"
          subtitle="Powered by Stripe. Auto-renews each period."
          loading={loading === 'stripe'}
          disabled={loading !== null}
          onClick={() => startCheckout('stripe')}
        />
        <MethodButton
          icon={<Bitcoin className="h-5 w-5" />}
          title="Cryptocurrency"
          subtitle="Pay with BTC, ETH, USDC via Coinbase Commerce. Manual renewal."
          loading={loading === 'coinbase'}
          disabled={loading !== null}
          onClick={() => startCheckout('coinbase')}
        />

        {error && (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}

        <p className="pt-2 text-center text-xs text-ink-muted">
          You&apos;ll be redirected to complete payment securely.
        </p>
      </div>
    </Modal>
  )
}

function MethodButton({
  icon,
  title,
  subtitle,
  loading,
  disabled,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  loading: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-4 rounded-base border border-ink-rule bg-paper p-4 text-left transition-all',
        'hover:border-primary-400 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700',
        disabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-base bg-primary-50 text-primary-700">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink">{title}</div>
        <div className="text-xs text-ink-muted">{subtitle}</div>
      </div>
    </button>
  )
}
