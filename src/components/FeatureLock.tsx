'use client'

import React from 'react'
import Link from 'next/link'
import { Lock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUserPlan } from '@/hooks/useUserPlan'

interface FeatureLockProps {
  children: React.ReactNode
  feature: string
  requiredPlan?: 'pro' | 'sentinel'
  className?: string
}

const planLabels: Record<string, string> = {
  pro: 'Pro',
  sentinel: 'Sentinel',
}

const PLAN_RANK: Record<string, number> = {
  free: 0,
  pro: 1,
  sentinel: 2,
}

export const FeatureLock: React.FC<FeatureLockProps> = ({
  children,
  feature,
  requiredPlan = 'pro',
  className,
}) => {
  const { plan: userPlan } = useUserPlan()
  const planLabel = planLabels[requiredPlan]

  // If user's plan meets or exceeds the required plan, show content unlocked
  const userRank = PLAN_RANK[userPlan] ?? 0
  const requiredRank = PLAN_RANK[requiredPlan] ?? 1

  if (userRank >= requiredRank) {
    return <>{children}</>
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      {/* Blurred content */}
      <div
        className="pointer-events-none select-none blur-sm"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-secondary-900/70 backdrop-blur-[2px]">
        <div className="flex flex-col items-center gap-3 rounded-xl bg-white/90 dark:bg-secondary-800/90 px-6 py-5 shadow-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-secondary-700">
            <Lock className="h-5 w-5 text-neutral-500 dark:text-secondary-400" />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-neutral-900 dark:text-secondary-100">
              Unlock with {planLabel}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-secondary-400">
              {feature} requires a {planLabel} plan
            </p>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-primary-800 hover:shadow-md"
          >
            Upgrade
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FeatureLock
