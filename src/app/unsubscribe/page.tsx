'use client'

/**
 * Unsubscribe — Ledger-canon, single-action.
 *
 * Replaces the previous fictional four-channel form (which silently
 * did nothing on submit — see git history) with one honest action:
 * remove the email from the AllowanceGuard waitlist + future marketing.
 *
 * Backend: POST /api/unsubscribe/by-email
 * Read-only enumeration defence: API returns ok regardless of whether
 * the email exists, so we surface a uniform success state.
 *
 * Council:
 *   #7 Maren / Kael (Design): paper canvas, ink text, hairline rule,
 *     sharp corners (no rounded-*), single oxblood beat for the action
 *   Noor (Accessibility VETO): ink on paper 17:1; focus-visible ring;
 *     aria-live on status; semantic form
 *   #13 UX writer: one action, plain language, no fluff
 *   #24 Data protection (VETO): opt-out actually works (PECR/GDPR)
 *   #11 Investor voice: brand polish on a high-trust surface
 */

import { useEffect, useState, type FormEvent } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Pre-fill the email from the URL when the user arrives via an
  // email-footer link (e.g. ?email=jane@example.com).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fromUrl = params.get('email')
    if (fromUrl) setEmail(fromUrl)
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/unsubscribe/by-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `Error ${res.status}`)
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Section className="py-20 sm:py-28">
        <Container className="max-w-xl">
          <span className="inline-block mb-4 text-xs uppercase tracking-[0.2em] font-semibold text-amber-deep">
            Unsubscribe
          </span>
          <H1 className="mb-6 text-ink">Stop receiving emails.</H1>
          <p className="text-base text-ink-soft mb-10 leading-relaxed">
            Confirm the email address below to remove yourself from the AllowanceGuard
            waitlist and future marketing emails. This won&rsquo;t affect transactional
            emails tied to a paid subscription, if you have one.
          </p>

          {status === 'success' ? (
            <div
              className="paper-card p-8 sm:p-10 text-left"
              role="status"
              aria-live="polite"
            >
              <h2 className="font-display-tight text-ink text-xl mb-2">
                Done. You&rsquo;re unsubscribed.
              </h2>
              <p className="font-plex text-ink-muted leading-relaxed mb-6">
                If you change your mind, you can re-subscribe at any time on the
                waitlist page.
              </p>
              <a
                href="/"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium font-plex bg-paper-deep text-ink border border-ink-rule hover:bg-paper-sub transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                Back to AllowanceGuard
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="paper-card p-8 sm:p-10">
              <label
                htmlFor="unsub-email"
                className="block text-sm font-medium text-ink mb-2"
              >
                Email address
              </label>
              <input
                id="unsub-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-paper border border-ink-rule px-4 py-3 text-sm text-ink placeholder:text-ink-whisper font-plex focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent transition-shadow duration-150"
                aria-describedby={status === 'error' ? 'unsub-error' : undefined}
              />

              {status === 'error' && errorMsg && (
                <p
                  id="unsub-error"
                  role="alert"
                  className="mt-3 text-sm font-plex text-crimson-paper"
                >
                  {errorMsg}
                </p>
              )}

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  type="submit"
                  disabled={status === 'submitting' || !email.trim()}
                  className="inline-flex items-center justify-center px-6 py-3 bg-oxblood text-cream border border-oxblood hover:bg-oxblood/90 active:bg-oxblood/80 disabled:opacity-50 disabled:cursor-not-allowed font-plex text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                >
                  {status === 'submitting' ? 'Unsubscribing…' : 'Unsubscribe'}
                </button>
                <p className="text-xs text-ink-whisper font-plex">
                  Changed your mind?{' '}
                  <a href="/preferences" className="text-amber-deep hover:underline">
                    Manage preferences
                  </a>
                </p>
              </div>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-ink-rule">
            <p className="text-sm text-ink-muted leading-relaxed">
              Need help with anything else?{' '}
              <a href="/contact" className="text-amber-deep hover:underline">
                Contact us
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>
    </div>
  )
}
