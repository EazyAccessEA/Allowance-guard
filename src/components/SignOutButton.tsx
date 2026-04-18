'use client'

/**
 * SignOutButton — clears the server session cookie and (optionally)
 * disconnects the wallet, then reloads so every server component
 * picks up the fresh anon state.
 *
 * Two variants:
 *   - "nav" (default): type-only link that sits in the header next to
 *     the Account link. Matches the header's type-only aesthetic.
 *   - "panel": outlined button for /account surfaces where space and
 *     affordance both argue for something clickier.
 *
 * Keeps wallet disconnect coupled to sign-out because that's the
 * intuitive expectation — "sign out" should leave nothing behind.
 * If a future use case needs wallet-preserving sign-out, pass
 * `disconnectWallet={false}`.
 */

import { useState } from 'react'
import { useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/Button'

export interface SignOutButtonProps {
  variant?: 'nav' | 'panel'
  disconnectWallet?: boolean
  className?: string
}

export default function SignOutButton({
  variant = 'nav',
  disconnectWallet = true,
  className = '',
}: SignOutButtonProps) {
  const { disconnect } = useDisconnect()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (signingOut) return
    setSigningOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Ignore — the reload below will still surface the anon state
      // if the cookie was cleared, and if it wasn't the user can
      // retry. No value to a toast here; the page reload is the tell.
    }
    if (disconnectWallet) {
      try {
        await disconnect()
      } catch {
        /* wagmi's disconnect already swallows most errors; nothing to do */
      }
    }
    // Hard navigation to the homepage — cheaper than a full reload
    // and lands the user somewhere useful instead of a post-auth page.
    window.location.href = '/'
  }

  if (variant === 'nav') {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        aria-label="Sign out of AllowanceGuard"
        className={`font-plex text-[13px] font-normal text-ink-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {signingOut ? 'Signing out…' : 'Sign out'}
      </button>
    )
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleSignOut}
      loading={signingOut}
      className={className}
    >
      {signingOut ? 'Signing out…' : 'Sign out'}
    </Button>
  )
}
