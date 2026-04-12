'use client'

import { useState, useRef } from 'react'

const INTERESTS = [
  { value: 'general', label: 'All updates' },
  { value: 'mobile', label: 'Mobile app' },
  { value: 'sdk', label: 'Developer SDK' },
  { value: 'api', label: 'B2B API' },
  { value: 'chains', label: 'New chains' },
] as const

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState('general')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

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
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Something went wrong.' }))
        throw new Error(data.error || `Error ${res.status}`)
      }

      setStatus('success')
      setEmail('')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="paper-card p-8 sm:p-10 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-ink mb-2 font-plex">You&apos;re on the list.</h3>
        <p className="text-ink-muted font-plex leading-relaxed">
          Check your inbox for a welcome email. We&apos;ll be in touch when there&apos;s news worth sharing.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="paper-card p-8 sm:p-10"
      noValidate
    >
      <h3 className="text-xl font-medium text-ink mb-1 font-plex">
        Get early access
      </h3>
      <p className="text-ink-muted text-sm mb-6 font-plex">
        Be the first to know when we launch. No spam — just the important stuff.
      </p>

      {/* Interest selector */}
      <fieldset className="mb-5">
        <legend className="text-xs uppercase tracking-[0.15em] text-ink-muted mb-2.5 font-plex font-medium">
          I&apos;m interested in
        </legend>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setInterest(opt.value)}
              className={`
                px-3.5 py-1.5 rounded-full text-sm font-medium font-plex transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                ${interest === opt.value
                  ? 'bg-ink text-paper'
                  : 'bg-paper-deep text-ink-soft hover:bg-paper-sub hover:text-ink border border-ink-rule'
                }
              `}
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
            className="
              flex-1 px-4 py-3 rounded-lg border border-ink-rule bg-white
              text-ink placeholder:text-ink-whisper font-plex text-[15px]
              focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent
              transition-shadow duration-150
            "
            aria-describedby={status === 'error' ? 'subscribe-error' : undefined}
          />
          <button
            type="submit"
            disabled={status === 'submitting' || !email.trim()}
            className="
              px-6 py-3 rounded-lg font-medium text-[15px] font-plex
              bg-oxblood text-cream
              hover:bg-oxblood/90 active:bg-oxblood/80
              disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-paper
              transition-all duration-150
              whitespace-nowrap
            "
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
      <p className="text-xs text-ink-whisper mt-4 font-plex leading-relaxed">
        We respect your privacy. Unsubscribe anytime.{' '}
        <a href="/privacy" className="underline hover:text-ink-muted transition-colors">
          Privacy policy
        </a>
      </p>
    </form>
  )
}
