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
        'relative rounded-lg bg-secondary-800 p-[1px]',
        'bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600',
        className
      )}
      role="alert"
      aria-label={`Upgrade prompt for ${feature}`}
    >
      <div className="relative rounded-lg bg-secondary-800 p-6">
        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-3 rounded-full p-1 text-neutral-400 transition-colors duration-150 hover:bg-neutral-100 hover:text-slate-400"
          aria-label="Dismiss upgrade prompt"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          {/* Icon */}
          <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 sm:mb-0 sm:mr-4">
            <Lock className="h-6 w-6 text-primary-700" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900">
              Upgrade to unlock {feature}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {currentLimit !== undefined
                ? `You've reached the free tier limit of ${currentLimit} wallets. `
                : ''}
              Upgrade to Pro for unlimited wallets, multi-chain portfolio view,
              continuous monitoring, batch revocation, and more.
            </p>

            {/* CTAs */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-primary-800 hover:shadow-md"
              >
                View Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <button
                onClick={() => setDismissed(true)}
                className="inline-flex items-center justify-center rounded-lg border border-secondary-700 bg-secondary-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors duration-150 hover:bg-secondary-800"
              >
                Continue with Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpgradePrompt
