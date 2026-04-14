'use client'

/**
 * Login — Sign-In with Ethereum (EIP-4361)
 *
 * The user connects their wallet (if not already), clicks "Sign in",
 * signs a canonical EIP-4361 message in-wallet, server verifies + issues
 * a 30-day session cookie.
 *
 * The actual SIWE flow lives in src/hooks/useSiweSignIn.ts so it can be
 * reused from PricingCard's one-click "Sign & subscribe" path.
 */

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAccount, useChainId } from 'wagmi'
import { Loader2, CheckCircle, Wallet } from 'lucide-react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ClientConnectButton from '@/components/ClientConnectButton'
import { useSiweSignIn } from '@/hooks/useSiweSignIn'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') ?? '/account'
  const urlError = params.get('error')

  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { signIn, isSigningIn, error } = useSiweSignIn()

  const [signedIn, setSignedIn] = React.useState(false)

  async function handleSignIn() {
    try {
      await signIn()
      setSignedIn(true)
      // Let the cookie settle, then navigate
      setTimeout(() => router.push(redirect), 300)
    } catch {
      // useSiweSignIn already exposes the error via `error`
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
              disabled={isSigningIn}
              className="w-full"
              onClick={handleSignIn}
            >
              {isSigningIn ? (
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
