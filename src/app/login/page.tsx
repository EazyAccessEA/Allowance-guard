'use client'

/**
 * Login — Sign-In with Ethereum (EIP-4361)
 *
 * Replaces the old magic-link flow with SIWE. User connects their
 * wallet (if not already), clicks "Sign in", signs a canonical EIP-4361
 * message in-wallet, server verifies + issues a 30-day session cookie.
 *
 * The wagmi wallet connection is already established on most pages
 * (the scanner uses it), so for most visitors clicking "Sign in" is
 * a single wallet signature popup — no email detour.
 */

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAccount, useChainId, useSignMessage } from 'wagmi'
import { Loader2, CheckCircle, Wallet } from 'lucide-react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ClientConnectButton from '@/components/ClientConnectButton'

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

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') ?? '/account'
  const urlError = params.get('error')

  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()

  const [loading, setLoading] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignIn() {
    if (!address) {
      setError('Connect your wallet first.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      // 1. Request a nonce
      const nonceRes = await fetch('/api/auth/nonce')
      if (!nonceRes.ok) throw new Error('Could not request a nonce')
      const { nonce } = (await nonceRes.json()) as { nonce: string }

      // 2. Build the canonical SIWE message
      const domain = window.location.host
      const uri = window.location.origin
      const message = buildSiweMessage({
        domain,
        address,
        uri,
        chainId,
        nonce,
        statement:
          'Sign in to AllowanceGuard. This signature proves you control this wallet and is not a transaction.',
      })

      // 3. Ask the wallet to sign it
      const signature = await signMessageAsync({ message })

      // 4. Post to /api/auth/siwe for verification + session creation
      const verifyRes = await fetch('/api/auth/siwe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      })
      const data = await verifyRes.json()
      if (!verifyRes.ok) {
        throw new Error(data.error ?? 'Sign-in failed')
      }

      setSignedIn(true)
      // Let the cookie settle, then navigate
      setTimeout(() => router.push(redirect), 500)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed'
      // Friendlier message for wallet cancellations
      if (/user rejected|denied|cancelled/i.test(msg)) {
        setError('Signature cancelled in your wallet.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="py-10 px-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-ink">Sign in to AllowanceGuard</h1>
          <p className="text-sm text-ink-muted">
            Sign a message with your wallet — no password, no email, no magic link.
          </p>
        </div>

        {signedIn ? (
          <div className="text-center space-y-3 py-4">
            <CheckCircle className="h-12 w-12 text-green-800 mx-auto" />
            <p className="text-sm font-medium text-ink">Signed in</p>
            <p className="text-xs text-ink-muted">Redirecting…</p>
          </div>
        ) : !isConnected ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-ink-muted">
              Connect your wallet to continue.
            </p>
            <div className="flex justify-center">
              <ClientConnectButton variant="primary" size="lg" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-base border border-ink-rule bg-paper-sub px-4 py-3 text-xs text-ink-muted">
              <span className="font-mono">
                {address?.slice(0, 6)}…{address?.slice(-4)}
              </span>
              <span className="mx-2">·</span>
              Chain {chainId}
            </div>

            {(error || urlError) && (
              <p className="text-xs text-red-800" role="alert">
                {error ??
                  (urlError === 'invalid_or_expired'
                    ? 'Your previous session expired. Please sign in again.'
                    : 'Something went wrong. Please try again.')}
              </p>
            )}

            <Button
              type="button"
              variant="primary"
              disabled={loading}
              className="w-full"
              onClick={handleSignIn}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Waiting for signature…
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" /> Sign in with wallet
                </>
              )}
            </Button>

            <p className="text-[11px] text-ink-whisper text-center">
              You&rsquo;ll be asked to sign a message. This is a free, off-chain
              signature — no transaction, no gas, no token movement.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <main>
      <Section size="sm" background="muted">
        <Container size="sm">
          <Suspense fallback={<div className="text-center py-10">Loading…</div>}>
            <LoginForm />
          </Suspense>
        </Container>
      </Section>
    </main>
  )
}
