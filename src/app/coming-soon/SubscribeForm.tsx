'use client'

/**
 * SubscribeForm — waitlist email capture
 *
 * Council:
 *  Kael: uses paper-card, paper-pill active pattern, no ad-hoc rounding
 *  Maren: no bg-white (Ledger rule #1), amber-deep success indicator
 *  Noor: semantic form, aria-live, focus-visible, sr-only label
 *  #4 Security: Cloudflare Turnstile token required for submission when
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY is configured. Honeypot retained as
 *   a second line of defence.
 *  #13 UX: terse microcopy, no fluff
 */

import { useCallback, useRef, useState } from 'react'
import TurnstileWidget from '@/components/TurnstileWidget'

const INTERESTS = [
  { value: 'general', label: 'All updates' },
  { value: 'mobile', label: 'Mobile app' },
  { value: 'sdk', label: 'Developer SDK' },
  { value: 'api', label: 'B2B API' },
  { value: 'chains', label: 'New chains' },
] as const

type Status = 'idle' | 'submitting' | 'success' | 'error'
type SuccessKind = 'new' | 'resubscribed' | 'already_subscribed'
type ResendStatus = 'idle' | 'sending' | 'sent'

const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

const SUCCESS_COPY: Record<SuccessKind, { title: string; body: string }> = {
  new: {
    title: "You're on the list.",
    body: "Check your inbox for a welcome email. We'll be in touch when there's news worth sharing.",
  },
  resubscribed: {
    title: 'Welcome back.',
    body: "You're back on the list. Check your inbox for a welcome email.",
  },
  already_subscribed: {
    title: "You're already on the list.",
    body: "No need to sign up again. Didn't get the welcome email? Check your spam folder, or resend it below.",
  },
}

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState('general')
  const [status, setStatus] = useState<Status>('idle')
  const [successKind, setSuccessKind] = useState<SuccessKind>('new')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [resendStatus, setResendStatus] = useState<ResendStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    if (TURNSTILE_ENABLED && !turnstileToken) {
      setErrorMsg('Please complete the bot check, then try again.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement)?.value

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          interest,
          referrer: window.location.href,
          website: honeypot,
          turnstileToken,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Something went wrong.' }))
        throw new Error(data.error || `Error ${res.status}`)
      }

      const data = (await res.json().catch(() => ({}))) as { status?: SuccessKind }
      setSuccessKind(data.status ?? 'new')
      setSubmittedEmail(email.trim())
      setResendStatus('idle')
      setStatus('success')
      setEmail('')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    const copy = SUCCESS_COPY[successKind]
    const showResend = successKind === 'already_subscribed' && submittedEmail.length > 0

    async function handleResend() {
      if (resendStatus !== 'idle') return
      setResendStatus('sending')
      try {
        await fetch('/api/subscribe/resend-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: submittedEmail }),
        })
        // The endpoint always returns 200 (don't-leak posture). We surface
        // a uniform "sent" state to the user; rate-limited / not-found cases
        // are silently no-ops server-side.
        setResendStatus('sent')
      } catch {
        // Network error — surface as a neutral message, leave button enabled.
        setResendStatus('idle')
      }
    }

    return (
      <div
        className="paper-card p-8 sm:p-10 text-center"
        role="status"
        aria-live="polite"
      >
        {/* Amber check — on-palette */}
        <div className="w-14 h-14 border-2 border-amber-deep/30 bg-paper-sub flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-amber-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display-tight text-ink text-xl mb-2">{copy.title}</h3>
        <p className="font-plex text-ink-muted leading-relaxed">{copy.body}</p>

        {showResend && (
          <div className="mt-6">
            {resendStatus === 'sent' ? (
              <p className="font-plex text-sm text-ink-soft">
                Sent. Check your inbox in a minute (and your spam folder).
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendStatus === 'sending'}
                className={[
                  'inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium font-plex',
                  'bg-paper-deep text-ink border border-ink-rule',
                  'hover:bg-paper-sub disabled:opacity-50 disabled:cursor-not-allowed',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                  'transition-colors duration-150',
                ].join(' ')}
              >
                {resendStatus === 'sending' ? 'Sending…' : 'Resend welcome email'}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="paper-card p-8 sm:p-10"
      noValidate
    >
      <h3 className="font-display-tight text-ink text-xl mb-1">
        Get early access
      </h3>
      <p className="font-plex text-ink-muted text-sm mb-6">
        Be the first to know when we launch. No spam — just the important stuff.
      </p>

      {/* Interest selector — paper-pill pattern */}
      <fieldset className="mb-5">
        <legend className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper mb-3">
          I&apos;m interested in
        </legend>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setInterest(opt.value)}
              className={[
                'px-3.5 py-1.5 text-sm font-medium font-plex transition-colors duration-150',
                'border border-ink-rule',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                interest === opt.value
                  ? 'bg-ink text-paper'
                  : 'bg-paper-deep text-ink-soft hover:bg-paper-sub hover:text-ink',
              ].join(' ')}
              aria-pressed={interest === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Email input */}
      <div className="mb-5">
        <label htmlFor="waitlist-email" className="sr-only">
          Email address
        </label>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            id="waitlist-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={[
              'flex-1 px-4 py-3 border border-ink-rule bg-paper',
              'text-ink placeholder:text-ink-whisper font-plex text-[15px]',
              'focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent',
              'transition-shadow duration-150',
            ].join(' ')}
            aria-describedby={status === 'error' ? 'subscribe-error' : undefined}
          />
          <button
            type="submit"
            disabled={
              status === 'submitting' ||
              !email.trim() ||
              (TURNSTILE_ENABLED && !turnstileToken)
            }
            className={[
              'px-6 py-3 font-medium text-[15px] font-plex whitespace-nowrap',
              'bg-oxblood text-cream border border-oxblood',
              'hover:bg-oxblood/90 active:bg-oxblood/80',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
              'transition-all duration-150',
            ].join(' ')}
          >
            {status === 'submitting' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Joining…
              </span>
            ) : (
              'Notify me'
            )}
          </button>
        </div>
      </div>

      {/* Honeypot — hidden from real users, bots fill it in */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Cloudflare Turnstile — bot verification. Renders nothing when
          NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set (dev / preview fallback). */}
      {TURNSTILE_ENABLED && (
        <div className="mt-4">
          <TurnstileWidget
            action="waitlist"
            onVerify={handleTurnstileVerify}
            onExpire={handleTurnstileExpire}
            onError={handleTurnstileExpire}
          />
        </div>
      )}

      {/* Error message */}
      {status === 'error' && (
        <p
          id="subscribe-error"
          role="alert"
          className="text-sm text-crimson-paper font-plex mt-1"
        >
          {errorMsg}
        </p>
      )}

      {/* Privacy note */}
      <p className="font-plex text-xs text-ink-whisper mt-4 leading-relaxed">
        We respect your privacy. Unsubscribe anytime.{' '}
        <a href="/privacy" className="underline hover:text-ink-muted transition-colors">
          Privacy policy
        </a>
      </p>
    </form>
  )
}
