'use client'

/**
 * useSiweSignIn — reusable Sign-In with Ethereum (EIP-4361) hook.
 *
 * Wraps the four-step SIWE flow that was previously inlined into
 * /login/page.tsx so it can be triggered from anywhere (e.g. PricingCard's
 * one-click "Sign & subscribe" path):
 *
 *   1. fetch /api/auth/nonce
 *   2. build canonical SIWE message
 *   3. wallet signMessage()
 *   4. POST /api/auth/siwe to verify and create the session cookie
 *
 * The hook does NOT trigger wallet connection — callers must ensure
 * `useAccount().isConnected === true` first (typically by opening the
 * Reown AppKit modal).
 *
 * Council:
 *   #17 Thane: single source of truth for SIWE — /login and PricingCard
 *     both use this. Behaviour drift between flows is impossible.
 *   #16 Security: SIWE message construction unchanged — domain, URI, chainId,
 *     nonce all sourced the same way as the original /login implementation.
 *   Idris: no React state churn — the hook returns booleans + a memoized
 *     signIn() so consumers can compose their own UI.
 */

import { useCallback, useState } from 'react'
import { useAccount, useChainId, useSignMessage } from 'wagmi'

function buildSiweMessage(args: {
  domain: string
  address: string
  uri: string
  chainId: number
  nonce: string
  statement: string
}): string {
  const issuedAt = new Date().toISOString()
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000).toISOString()
  return [
    `${args.domain} wants you to sign in with your Ethereum account:`,
    args.address,
    '',
    args.statement,
    '',
    `URI: ${args.uri}`,
    'Version: 1',
    `Chain ID: ${args.chainId}`,
    `Nonce: ${args.nonce}`,
    `Issued At: ${issuedAt}`,
    `Expiration Time: ${expirationTime}`,
  ].join('\n')
}

export class SiweCancelledError extends Error {
  constructor() {
    super('Signature cancelled in your wallet.')
    this.name = 'SiweCancelledError'
  }
}

export interface UseSiweSignInOptions {
  /**
   * Statement shown inside the wallet signature popup. Defaults to a
   * generic sign-in copy. Override to give context (e.g. "Sign in to
   * subscribe to Pro.").
   */
  statement?: string
}

export interface UseSiweSignInResult {
  /**
   * Run the full SIWE flow. Resolves once the session cookie is set,
   * rejects on cancel/failure. Caller is responsible for ensuring a
   * wallet is connected first.
   */
  signIn: () => Promise<void>
  isSigningIn: boolean
  error: string | null
  /** Reset error state without signing in again. */
  clearError: () => void
}

const DEFAULT_STATEMENT =
  'Sign in to AllowanceGuard. This signature proves you control this wallet and is not a transaction.'

export function useSiweSignIn(options: UseSiweSignInOptions = {}): UseSiweSignInResult {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()

  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const signIn = useCallback(async () => {
    if (!isConnected || !address) {
      const msg = 'Connect your wallet first.'
      setError(msg)
      throw new Error(msg)
    }

    setError(null)
    setIsSigningIn(true)
    try {
      // 1. Nonce
      const nonceRes = await fetch('/api/auth/nonce')
      if (!nonceRes.ok) {
        if (nonceRes.status === 429) {
          throw new Error('Too many sign-in attempts. Please wait a moment and try again.')
        }
        throw new Error('Sign-in is temporarily unavailable. Please try again in a few seconds.')
      }
      const { nonce } = (await nonceRes.json()) as { nonce: string }

      // 2. Canonical SIWE message
      const domain = window.location.host
      const uri = window.location.origin
      const message = buildSiweMessage({
        domain,
        address,
        uri,
        chainId,
        nonce,
        statement: options.statement ?? DEFAULT_STATEMENT,
      })

      // 3. Wallet signature
      let signature: `0x${string}`
      try {
        signature = await signMessageAsync({ message })
      } catch (signErr) {
        const msg = signErr instanceof Error ? signErr.message : 'Signature failed'
        if (/user rejected|denied|cancelled/i.test(msg)) {
          throw new SiweCancelledError()
        }
        throw new Error(msg)
      }

      // 4. Verify + create session
      const verifyRes = await fetch('/api/auth/siwe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      })
      const data = (await verifyRes.json().catch(() => ({}))) as { error?: string }
      if (!verifyRes.ok) {
        throw new Error(data.error ?? 'Sign-in failed')
      }

      // Let the cookie settle before any subsequent fetch needs it.
      await new Promise((resolve) => setTimeout(resolve, 250))
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed'
      setError(msg)
      throw e
    } finally {
      setIsSigningIn(false)
    }
  }, [address, chainId, isConnected, options.statement, signMessageAsync])

  return { signIn, isSigningIn, error, clearError }
}
