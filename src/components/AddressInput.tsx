'use client'

/**
 * AddressInput — the reciprocity moment.
 *
 * Above-the-fold input for the Scared Retail persona. Lets a visitor
 * paste any 0x address and trigger a scan WITHOUT connecting a wallet.
 * Wires directly into useDashboard.startScan(addr) so the existing
 * scan job + dashboard render flow takes over.
 *
 * Council:
 *  #4 Security: read-only public-chain data, /api/scan rate-limited
 *  #3 Web3 expert: validates address client-side, no insider jargon
 *  #5 Marketing: zero-friction first action — no wallet connect required
 *  #13 UX writer: error copy in plain English, no "0x" technobabble
 */

import { useState, useEffect, useRef, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'

interface AddressInputProps {
  onSubmit: (addr: string) => void
  pending?: boolean
  className?: string
}

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/

export default function AddressInput({ onSubmit, pending = false, className = '' }: AddressInputProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus when arriving via /#scan deep link (from pricing Free CTA)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#scan') {
      inputRef.current?.focus()
    }
  }, [])

  const handle = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    setTouched(true)
    if (!trimmed) {
      setError('Paste a wallet address to scan it.')
      return
    }
    if (!ADDRESS_RE.test(trimmed)) {
      setError("That doesn't look like a wallet address. It should start with 0x and have 42 characters total.")
      return
    }
    setError(null)
    onSubmit(trimmed)
  }

  const showError = touched && error

  return (
    <form onSubmit={handle} className={`w-full ${className}`} noValidate>
      <label htmlFor="address-input" className="sr-only">
        Wallet address
      </label>
      <div
        className={`flex items-stretch overflow-hidden border-2 transition-colors bg-paper-sub
          ${showError ? 'border-crimson-paper' : 'border-ink hover:border-amber-deep focus-within:border-amber-deep'}
        `}
        style={{
          boxShadow: '4px 4px 0 rgba(20, 18, 16, 0.10)',
        }}
      >
        <input
          ref={inputRef}
          id="address-input"
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError(null)
          }}
          onBlur={() => setTouched(true)}
          placeholder="Paste any wallet address (0x…)"
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? 'address-input-error' : 'address-input-help'}
          className="flex-1 min-w-0 bg-transparent px-5 py-4 sm:py-5 font-mono text-sm sm:text-base text-ink placeholder:text-ink-whisper outline-none"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 bg-ink text-paper px-5 sm:px-7 py-4 sm:py-5 font-plex text-sm sm:text-base font-semibold tracking-tight hover:bg-amber-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {pending ? 'Scanning…' : 'Scan free'}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Trust micro-row */}
      <div
        id="address-input-help"
        className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] font-semibold tracking-wider uppercase text-ink-muted"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-amber-deep" aria-hidden="true" />
          Read-only
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-amber-deep" aria-hidden="true" />
          We can&rsquo;t move tokens
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-amber-deep" aria-hidden="true" />
          No connection required
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-amber-deep" aria-hidden="true" />
          Open source
        </span>
      </div>

      {showError && (
        <p id="address-input-error" role="alert" className="mt-3 font-plex text-sm text-crimson-paper">
          {error}
        </p>
      )}
    </form>
  )
}
