'use client'

/**
 * OtpUpgradeModal — 2-step email sign-in used by the pricing cards.
 *
 * The upgrade funnel used to require a wallet connect + SIWE signature
 * before Stripe checkout. That taxed conversion at the worst possible
 * moment and broke entirely on mobile wallets. This modal replaces it:
 *
 *   Step 1 (email)  → POST /api/auth/otp-request  → emails a 6-digit code
 *   Step 2 (code)   → POST /api/auth/otp-verify   → sets session cookie
 *
 * On verify success the modal calls `onAuthenticated()` — the caller
 * (useUpgradeFlow) retries POST /api/billing/create-subscription which
 * now has a session and returns a Stripe URL.
 *
 * Lifted into a standalone component because both PricingCard and
 * ApiPricingCard need the same two-step flow; inlining it would drift.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Mail, Loader2, ArrowLeft } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

export interface OtpUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  /** Called after a verify succeeds and the session cookie is set. */
  onAuthenticated: () => void
  /** Plan name shown in the heading copy (e.g. "Pro"). */
  displayName: string
}

type Step = 'email' | 'code'

export default function OtpUpgradeModal({
  isOpen,
  onClose,
  onAuthenticated,
  displayName,
}: OtpUpgradeModalProps) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const codeInputRef = useRef<HTMLInputElement | null>(null)

  // Reset state when the modal closes so the next open is clean.
  useEffect(() => {
    if (!isOpen) {
      setStep('email')
      setEmail('')
      setCode('')
      setError(null)
      setLoading(false)
      setResending(false)
    }
  }, [isOpen])

  // Focus the code input when the step advances so mobile users don't
  // have to tap the field before the software keyboard appears.
  useEffect(() => {
    if (step === 'code' && codeInputRef.current) {
      codeInputRef.current.focus()
    }
  }, [step])

  const sendCode = useCallback(
    async (targetEmail: string): Promise<boolean> => {
      const res = await fetch('/api/auth/otp-request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: targetEmail.trim().toLowerCase() }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Could not send code. Please try again.')
        return false
      }
      return true
    },
    [],
  )

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email address.')
      return
    }
    setLoading(true)
    const ok = await sendCode(trimmed)
    setLoading(false)
    if (ok) {
      setEmail(trimmed)
      setStep('code')
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/otp-verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? 'The code is incorrect or has expired. Request a new one.')
        setLoading(false)
        return
      }
      // Let the cookie settle on the wire before the caller's retry
      // POSTs to a session-gated endpoint (mirrors useSiweSignIn's wait).
      await new Promise((resolve) => setTimeout(resolve, 250))
      onAuthenticated()
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resending || !email) return
    setError(null)
    setResending(true)
    const ok = await sendCode(email)
    setResending(false)
    if (ok) {
      setCode('')
      codeInputRef.current?.focus()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={step === 'email' ? `Continue to ${displayName}` : 'Enter your code'}
      description={
        step === 'email'
          ? "We'll email you a 6-digit code. No password, no wallet signature."
          : `We sent a 6-digit code to ${email}. It expires in 10 minutes.`
      }
    >
      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} noValidate>
          <label htmlFor="otp-email" className="mb-2 block text-sm font-medium text-ink">
            Email address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-whisper"
              aria-hidden="true"
            />
            <input
              id="otp-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-10 pl-9 pr-3 border border-ink-rule bg-paper text-sm text-ink placeholder:text-ink-whisper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-deep focus-visible:border-amber-deep"
            />
          </div>

          {error && (
            <p className="mt-3 text-xs text-crimson-paper" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" className="mt-5 w-full" loading={loading} disabled={loading}>
            {loading ? 'Sending…' : 'Send code'}
          </Button>

          <p className="mt-3 text-[11px] text-ink-whisper text-center">
            By continuing you agree to our{' '}
            <a href="/terms" className="underline underline-offset-2 hover:text-ink" target="_blank" rel="noopener noreferrer">
              Terms
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline underline-offset-2 hover:text-ink" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} noValidate>
          <label htmlFor="otp-code" className="mb-2 block text-sm font-medium text-ink">
            6-digit code
          </label>
          <input
            id="otp-code"
            ref={codeInputRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="••••••"
            className="w-full h-12 px-3 rounded-base border border-ink-rule bg-paper text-center text-2xl font-mono tracking-[0.5em] text-ink placeholder:text-ink-whisper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-deep focus-visible:border-amber-deep"
          />

          {error && (
            <p className="mt-3 text-xs text-crimson-paper" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" className="mt-5 w-full" loading={loading} disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying…
              </span>
            ) : (
              'Verify and continue'
            )}
          </Button>

          <div className="mt-4 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setStep('email')
                setError(null)
                setCode('')
              }}
              className="inline-flex items-center gap-1 text-ink-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Change email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-ink-muted hover:text-ink transition-colors disabled:opacity-50"
            >
              {resending ? 'Resending…' : 'Resend code'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
