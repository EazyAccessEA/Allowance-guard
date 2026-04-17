'use client'

/**
 * SaveWalletButton — drop-in "Save this wallet" action.
 *
 * Used on scan results / dashboard surfaces where the user has a
 * specific wallet in view and we want to offer one-click save to
 * their address book.
 *
 * Flow:
 *   1. User clicks button.
 *   2. POST /api/account/wallets with the address.
 *   3. If 401 (not signed in) → run SIWE inline → retry once.
 *   4. If 200 → "Saved ✓" (button disabled).
 *   5. If 403 (quota) → "Limit reached — upgrade?" with link.
 *   6. If 409 (already saved) → "Saved ✓" (idempotent UX).
 *
 * Council:
 *   #4 Security: SIWE flow reused via useSiweSignIn (no duplicate
 *     auth code; same 4-step path as useUpgradeFlow)
 *   #15 Staff engineer: drop-in component, no parent state plumbing —
 *     parent passes address + optional callback
 *   #13 UX writer: button label tells the truth at every state;
 *     "Saved" is honest after an idempotent 409 too
 *   #22 Conversion: quota-cap message points to /pricing for the
 *     natural upgrade decision
 */

import { useCallback, useState } from 'react'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { useSiweSignIn, SiweCancelledError } from '@/hooks/useSiweSignIn'
import { cn } from '@/lib/utils'

interface SaveWalletButtonProps {
  /** The wallet address to save. Validated server-side. */
  walletAddress: string
  /** Optional label to attach on save. */
  label?: string
  /** Optional callback after a successful save. */
  onSaved?: () => void
  /** Optional starting state — pass true if the parent already knows the wallet is in the user's address book. */
  initialSaved?: boolean
  /** Visual variant — 'default' (oxblood pill) or 'subtle' (paper-deep). */
  variant?: 'default' | 'subtle'
  className?: string
}

type SaveState = 'idle' | 'siwe' | 'saving' | 'saved' | 'limit' | 'error'

export default function SaveWalletButton({
  walletAddress,
  label,
  onSaved,
  initialSaved = false,
  variant = 'subtle',
  className,
}: SaveWalletButtonProps) {
  const [state, setState] = useState<SaveState>(initialSaved ? 'saved' : 'idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { signIn } = useSiweSignIn({
    statement: 'Sign in to save this wallet to your AllowanceGuard address book.',
  })

  const post = useCallback(async () => {
    return fetch('/api/account/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, label }),
    })
  }, [walletAddress, label])

  const handleClick = useCallback(async () => {
    if (state === 'saved' || state === 'saving' || state === 'siwe') return
    setState('saving')
    setErrorMsg(null)
    try {
      let res = await post()

      if (res.status === 401) {
        // Not signed in — run SIWE inline, then retry once.
        setState('siwe')
        try {
          await signIn()
        } catch (signErr) {
          if (signErr instanceof SiweCancelledError) {
            setErrorMsg('Signature cancelled.')
          } else {
            setErrorMsg(signErr instanceof Error ? signErr.message : 'Sign-in failed.')
          }
          setState('error')
          return
        }
        res = await post()
      }

      if (res.status === 409) {
        // Already saved — idempotent success from the user's POV.
        setState('saved')
        onSaved?.()
        return
      }

      if (res.status === 403) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        setErrorMsg(data.error ?? 'Wallet limit reached on your plan.')
        setState('limit')
        return
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        setErrorMsg(data.error ?? `Error ${res.status}`)
        setState('error')
        return
      }

      setState('saved')
      onSaved?.()
    } catch {
      setErrorMsg('Network error. Please try again.')
      setState('error')
    }
  }, [post, signIn, state, onSaved])

  const baseStyles =
    variant === 'default'
      ? 'bg-oxblood text-cream hover:bg-oxblood/90 disabled:opacity-50'
      : 'bg-paper-sub text-ink ring-1 ring-ink-rule hover:bg-paper-deep disabled:opacity-50'

  return (
    <div className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={handleClick}
        disabled={state === 'saved' || state === 'saving' || state === 'siwe'}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-deep focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed',
          baseStyles,
          className,
        )}
        aria-label={state === 'saved' ? 'Wallet saved' : 'Save wallet to address book'}
      >
        {state === 'saved' ? (
          <>
            <BookmarkCheck className="h-4 w-4" />
            Saved
          </>
        ) : state === 'saving' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : state === 'siwe' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Waiting for signature…
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4" />
            Save wallet
          </>
        )}
      </button>
      {state === 'limit' && errorMsg && (
        <p className="mt-1 text-xs text-amber-deep" role="alert">
          {errorMsg}{' '}
          <a href="/pricing" className="underline hover:text-amber-deep">
            Upgrade
          </a>
        </p>
      )}
      {state === 'error' && errorMsg && (
        <p className="mt-1 text-xs text-crimson-paper" role="alert">
          {errorMsg}
        </p>
      )}
    </div>
  )
}
