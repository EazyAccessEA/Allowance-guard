'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Lock, ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UpgradePromptProps {
  feature: string
  currentLimit?: number
  className?: string
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  currentLimit,
  className,
}) => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  return (
    <div
      className={cn(
        'relative rounded-xl bg-paper-sub ring-1 ring-amber-500/30 p-5',
        className
      )}
      role="alert"
      aria-label={`Upgrade prompt for ${feature}`}
    >
      {/* Subtle amber glow */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at 0% 50%, rgba(245,158,11,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 rounded-full p-1.5 text-ink-whisper transition-colors duration-150 hover:bg-paper-sub hover:text-ink-soft"
        aria-label="Dismiss upgrade prompt"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/20">
          <Lock className="h-5 w-5 text-amber-400" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-ink">
            Unlock {feature}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            {currentLimit !== undefined
              ? `You\u2019ve reached the free tier limit of ${currentLimit} wallets. `
              : ''}
            Upgrade to Pro for unlimited wallets, continuous monitoring,
            batch revoke, and more.
          </p>

          {/* CTAs */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-ink shadow-sm transition-all duration-150 hover:bg-amber-400"
            >
              View Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-ink-muted bg-paper-sub hover:bg-paper-sub transition-colors duration-150"
            >
              Continue with Free
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpgradePrompt
