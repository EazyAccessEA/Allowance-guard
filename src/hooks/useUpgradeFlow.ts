'use client'

/**
 * useUpgradeFlow — shared upgrade / checkout flow for paid plans.
 *
 * Both PricingCard (consumer plans) and ApiPricingCard (API plans)
 * render this. The flow matches consumer-SaaS norms — no wallet, no
 * signature, just email + 6-digit code → Stripe. Wallet connect is
 * available elsewhere for the features that need it (scanning,
 * allowance revocation) but is never a gate on paying.
 *
 *   1. click upgrade
 *   2. POST /api/billing/create-subscription
 *   3. if 401 → open the OTP modal (email → code) → retry POST
 *   4. redirect to Stripe on success; surface error otherwise
 *
 * Replaces the SIWE flow that previously gated this funnel and
 * accumulated four production bugs (domain mismatch, cached 429,
 * rate-limit exhaustion, mobile signature failures).
 *
 * Council:
 *   #30 Payment systems: no change to the billing route contract;
 *     the switch is purely on the identity side
 *   #4 Security: OTP endpoints enforce HMAC-hashed codes, replay-safe
 *     verify, rate limits; no session is set until verify succeeds
 *   Sable (UX): wallet no longer blocks payment — the single biggest
 *     conversion tax in the old flow is gone
 */

import { useCallback, useState } from 'react'
import { trackClientEvent } from '@/lib/analytics'

export interface UseUpgradeFlowOptions {
  /** The paid plan slug being upgraded to. */
  plan: string
  /** Billing period selected on the page. */
  billingPeriod: 'monthly' | 'yearly'
  /** Display name used in the OTP modal heading (e.g. "Pro"). */
  displayName: string
}

export interface UseUpgradeFlowResult {
  /**
   * Trigger the upgrade. Resolves after redirect to Stripe or after
   * surfacing an error. Caller should disable the trigger button
   * when `loading || isAuthenticating` is true.
   */
  upgrade: () => Promise<void>
  /** True while waiting for the Stripe checkout URL or redirecting. */
  loading: boolean
  /** True while the OTP modal is open and the user is mid-sign-in. */
  isAuthenticating: boolean
  /** Last user-visible error message; null when no error. */
  error: string | null
  /** Whether the OTP modal should be rendered. */
  otpModalOpen: boolean
  /** Close handler for the OTP modal (cancel path). */
  closeOtpModal: () => void
  /**
   * Called by the OTP modal after a successful verify. The session
   * cookie is set; retry the checkout call and redirect to Stripe.
   */
  onAuthenticated: () => Promise<void>
}

interface CheckoutResult {
  ok: boolean
  url?: string
  error?: string
  status: number
}

async function postCheckout(plan: string, interval: string): Promise<CheckoutResult> {
  const res = await fetch('/api/billing/create-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, interval }),
  })
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
  return { ok: res.ok, url: data.url, error: data.error, status: res.status }
}

export function useUpgradeFlow(opts: UseUpgradeFlowOptions): UseUpgradeFlowResult {
  const { plan, billingPeriod } = opts

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [otpModalOpen, setOtpModalOpen] = useState(false)

  const finishCheckout = useCallback(async () => {
    const result = await postCheckout(plan, billingPeriod)
    if (result.ok && result.url) {
      window.location.href = result.url
      return
    }
    setError(result.error ?? 'Could not start checkout. Please try again.')
    setLoading(false)
  }, [plan, billingPeriod])

  const upgrade = useCallback(async () => {
    if (loading) return
    setError(null)
    setLoading(true)
    trackClientEvent('upgrade_clicked', { plan, billingPeriod })

    try {
      const result = await postCheckout(plan, billingPeriod)

      // 401 → no session, open the OTP modal. useUpgradeFlow's caller
      // renders OtpUpgradeModal bound to `otpModalOpen`; on successful
      // verify the modal calls onAuthenticated, which retries.
      if (result.status === 401) {
        setOtpModalOpen(true)
        // Keep `loading` true so the CTA stays disabled while the
        // modal is open — prevents double-submit on re-click.
        return
      }

      if (result.ok && result.url) {
        window.location.href = result.url
        return
      }

      setError(result.error ?? 'Could not start checkout. Please try again.')
      setLoading(false)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }, [billingPeriod, loading, plan])

  const closeOtpModal = useCallback(() => {
    setOtpModalOpen(false)
    // User bailed on sign-in — release the CTA so they can retry.
    setLoading(false)
  }, [])

  const onAuthenticated = useCallback(async () => {
    setOtpModalOpen(false)
    await finishCheckout()
  }, [finishCheckout])

  return {
    upgrade,
    loading,
    isAuthenticating: otpModalOpen,
    error,
    otpModalOpen,
    closeOtpModal,
    onAuthenticated,
  }
}
