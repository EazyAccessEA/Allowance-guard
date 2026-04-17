'use client'

/**
 * useUpgradeFlow — shared upgrade / checkout flow for paid plans.
 *
 * Both PricingCard (consumer plans) and ApiPricingCard (API plans)
 * had the same four-stage flow inlined:
 *
 *   1. wallet not connected → open Reown AppKit modal, return
 *   2. POST /api/billing/create-subscription
 *   3. if 401 → SIWE inline → retry POST
 *   4. redirect to Stripe checkout URL on success, surface error otherwise
 *
 * Extracted here so a fix (the nonce-error humanisation in commit
 * 2af81cb) lands in both surfaces automatically.
 *
 * Council:
 *   #15 Staff engineer: single source of truth for upgrade flow;
 *     prevents drift between consumer + API cards
 *   #4 Security: SIWE behaviour unchanged — still relies on
 *     useSiweSignIn for the canonical flow
 *   #34 Debug: structured analytics event names preserved
 *     (`upgrade_clicked` with stage)
 */

import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { trackClientEvent } from '@/lib/analytics'
import { useSiweSignIn, SiweCancelledError } from '@/hooks/useSiweSignIn'

export interface UseUpgradeFlowOptions {
  /** The paid plan slug being upgraded to. */
  plan: string
  /** Billing period selected on the page. */
  billingPeriod: 'monthly' | 'yearly'
  /** Display name used in the SIWE wallet-popup statement. */
  displayName: string
}

export interface UseUpgradeFlowResult {
  /**
   * Trigger the upgrade. Handles wallet-connect → SIWE → checkout
   * end-to-end. Resolves silently after redirect; sets `error` and
   * resolves on failure. Caller should disable the trigger button
   * when `loading || isSigningIn` is true.
   */
  upgrade: () => Promise<void>
  /** True while waiting for the Stripe checkout URL or redirecting. */
  loading: boolean
  /** True while waiting for the wallet signature (SIWE step). */
  isSigningIn: boolean
  /** Last user-visible error message; null when no error. */
  error: string | null
  /** Whether the wallet is currently connected (mirrors wagmi). */
  isConnected: boolean
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
  const { plan, billingPeriod, displayName } = opts
  const { isConnected } = useAccount()
  const { open } = useAppKit()
  const { signIn, isSigningIn } = useSiweSignIn({
    statement: `Sign in to subscribe to AllowanceGuard ${displayName}.`,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upgrade = useCallback(async () => {
    if (loading || isSigningIn) return
    setError(null)

    // Step 1 — wallet must be connected before SIWE is possible.
    if (!isConnected) {
      trackClientEvent('upgrade_clicked', { plan, billingPeriod, stage: 'connect_wallet' })
      try {
        await open()
      } catch {
        /* user closed the modal */
      }
      return
    }

    setLoading(true)
    trackClientEvent('upgrade_clicked', { plan, billingPeriod })

    try {
      // Step 2 — try checkout. Skip SIWE if a session already exists.
      let result = await postCheckout(plan, billingPeriod)

      // Step 3 — 401 means no session: run SIWE inline, then retry once.
      if (result.status === 401) {
        try {
          await signIn()
        } catch (signErr) {
          if (signErr instanceof SiweCancelledError) {
            setError('Signature cancelled. Try again when ready.')
          } else {
            setError(signErr instanceof Error ? signErr.message : 'Sign-in failed.')
          }
          setLoading(false)
          return
        }
        result = await postCheckout(plan, billingPeriod)
      }

      // Step 4 — redirect to Stripe, or surface a clear error.
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
  }, [billingPeriod, isConnected, isSigningIn, loading, open, plan, signIn])

  return { upgrade, loading, isSigningIn, error, isConnected }
}
