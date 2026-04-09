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

  const userRank = PLAN_RANK[userPlan] ?? 0
  const requiredRank = PLAN_RANK[requiredPlan] ?? 1

  if (userRank >= requiredRank) {
    return <>{children}</>
  }

  return (
    <div className={cn('relative overflow-hidden rounded-xl', className)}>
      {/* Blurred content */}
      <div
        className="pointer-events-none select-none blur-sm"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-paper/70 backdrop-blur-[2px]">
        <div className="flex flex-col items-center gap-3 rounded-xl bg-paper-sub ring-1 ring-ink-rule px-6 py-5 shadow-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/20">
            <Lock className="h-5 w-5 text-amber-deep" />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-ink">
              Unlock with {planLabel}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              {feature} requires a {planLabel} plan
            </p>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-ink shadow-sm transition-all duration-150 hover:bg-amber-400"
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
