'use client'

/**
 * TurnstileWidget — Cloudflare Turnstile, client side.
 *
 * Lazy-loads the Cloudflare Turnstile script once per page, renders a
 * widget in the mount ref, and calls `onVerify(token)` when the user
 * completes the challenge. Fires `onExpire()` when the token expires.
 *
 * Graceful no-op: if NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set, the
 * component renders nothing and does not load the script. This lets
 * the waitlist form work in local development and in deployments that
 * haven't yet provisioned Turnstile keys. Server-side verification in
 * src/lib/turnstile.ts has the matching fallback.
 *
 * Council:
 *  #4 Security: widget appearance is visible (not invisible mode); user
 *   consent is implicit in solving the challenge
 *  Noor: container has role and aria-label so screen readers announce it
 *  Thane: script tag is injected once per page, cached by the browser
 *  Kael: theme="light" matches Ledger paper; no fiddling with internals
 *  #24 Data protection: must be disclosed in the privacy policy before
 *   the key is turned on in production
 */

import { useEffect, useRef, useState } from 'react'

// The Turnstile namespace Cloudflare's script attaches to window.
interface TurnstileOptions {
  sitekey: string
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact' | 'flexible'
  action?: string
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

interface TurnstileAPI {
  render: (container: HTMLElement, options: TurnstileOptions) => string
  reset: (widgetId?: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI
    onloadTurnstileCallback?: () => void
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback'
const SCRIPT_ID = 'cf-turnstile-script'

/** Promise that resolves once window.turnstile is available. */
let readyPromise: Promise<void> | null = null
function ensureTurnstileLoaded(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  if (window.turnstile) return Promise.resolve()
  if (readyPromise) return readyPromise

  readyPromise = new Promise<void>((resolve) => {
    window.onloadTurnstileCallback = () => resolve()

    if (document.getElementById(SCRIPT_ID)) return

    const s = document.createElement('script')
    s.id = SCRIPT_ID
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    document.head.appendChild(s)
  })

  return readyPromise
}

interface Props {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  action?: string
  theme?: 'light' | 'dark' | 'auto'
  className?: string
}

export default function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
  action = 'waitlist',
  theme = 'light',
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [unavailable, setUnavailable] = useState(false)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey) return
    if (!containerRef.current) return

    let cancelled = false

    ensureTurnstileLoaded()
      .then(() => {
        if (cancelled || !window.turnstile || !containerRef.current) return

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size: 'flexible',
          action,
          callback: (token: string) => onVerify(token),
          'expired-callback': () => {
            onExpire?.()
          },
          'error-callback': () => {
            onError?.()
          },
        })
      })
      .catch(() => {
        setUnavailable(true)
      })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          /* no-op on double-remove */
        }
      }
    }
    // onVerify/onExpire/onError are expected to be stable; we intentionally
    // exclude them to avoid re-rendering the widget on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, theme, action])

  // Not configured — render nothing. Server-side verifier has the matching
  // dev fallback, so the form stays usable.
  if (!siteKey) return null

  if (unavailable) {
    return (
      <p className={`font-plex text-xs text-ink-whisper ${className}`}>
        Bot verification failed to load. Refresh and try again.
      </p>
    )
  }

  return (
    <div
      ref={containerRef}
      className={className}
      role="region"
      aria-label="Bot verification"
    />
  )
}
