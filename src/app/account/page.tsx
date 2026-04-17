'use client'

/**
 * Account landing page — unified Ledger canon.
 *
 * Canon: `projects/allowanceguard/DESIGN.md` + ADR 0007
 * (`projects/allowanceguard/decisions/0007-unified-ledger-canon.md`).
 * Glass / Midnight Amber is retired; this page runs on paper + ink +
 * amber-deep accent like every other AllowanceGuard surface.
 *
 * Audit structural fixes preserved from `context/design/audits/2026-04-17-account-surface.md`:
 *   - No `primary-*` / `secondary-*` / `neutral-*` legacy scales
 *   - No `bg-gray-*` / `bg-neutral-*` raw greys
 *   - No `dark:` branches
 *   - Header avatar uses `rounded-lg` not `rounded-full`
 */

import React, { useEffect, useState } from 'react'
import PlanCard from '@/components/account/PlanCard'
import UsageChart from '@/components/account/UsageChart'
import PortfolioRiskScore from '@/components/PortfolioRiskScore'
import InsuranceIntegration from '@/components/InsuranceIntegration'
import { cn } from '@/lib/utils'
import {
  CreditCard,
  Key,
  BarChart3,
  ArrowRight,
  User,
} from 'lucide-react'
import type { ConsumerPlan } from '@/lib/plans'

interface AccountData {
  plan: ConsumerPlan
  currentPeriodEnd?: string
  status?: 'active' | 'trialing' | 'past_due' | 'canceled'
  walletsUsed: number
  walletsLimit: number
  apiCallsUsed: number
  apiCallsLimit: number
  chainsUsed: number
  chainsLimit: number
}

const PLACEHOLDER: AccountData = {
  plan: 'free',
  status: 'active',
  walletsUsed: 1,
  walletsLimit: 3,
  apiCallsUsed: 12,
  apiCallsLimit: 50,
  chainsUsed: 1,
  chainsLimit: 1,
}

export default function AccountPage() {
  const [data, setData] = useState<AccountData>(PLACEHOLDER)
  const [, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchAccount() {
      try {
        const res = await fetch('/api/billing/manage', { credentials: 'include' })
        if (res.ok) {
          const json = await res.json()
          if (!cancelled) setData(json)
        }
      } catch {
        // Use placeholder data on error
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAccount()
    return () => {
      cancelled = true
    }
  }, [])

  const quickLinks = [
    {
      href: '/account/billing',
      icon: CreditCard,
      label: 'Billing',
      description: 'Manage your subscription and payment method',
    },
    {
      href: '/account/keys',
      icon: Key,
      label: 'API Keys',
      description: 'Create and manage API keys',
    },
    {
      href: '/account/usage',
      icon: BarChart3,
      label: 'Usage',
      description: 'View your API calls, wallets, and resource usage',
    },
  ]

  return (
    <main className="min-h-screen paper grain">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-paper-sub border border-ink-rule">
              <User className="h-5 w-5 text-amber-deep" />
            </div>
            <div>
              <h1 className="font-display-tight text-2xl text-ink">
                Account
              </h1>
              <p className="font-plex text-sm text-ink-muted">
                Manage your plan, usage, and settings.
              </p>
            </div>
          </div>

          {/* Plan + Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlanCard
              plan={data.plan}
              currentPeriodEnd={data.currentPeriodEnd}
              status={data.status}
            />
            <UsageChart
              walletsUsed={data.walletsUsed}
              walletsLimit={data.walletsLimit}
              apiCallsUsed={data.apiCallsUsed}
              apiCallsLimit={data.apiCallsLimit}
              chainsUsed={data.chainsUsed}
              chainsLimit={data.chainsLimit}
            />
          </div>

          {/* Portfolio Risk Score */}
          <PortfolioRiskScore />

          {/* Insurance Integration */}
          <InsuranceIntegration userTier={data.plan} />

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'group paper-card flex items-center gap-4 p-5',
                  'transition-all duration-150 hover:border-amber-deep/40',
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-paper-sub border border-ink-rule text-amber-deep transition-colors group-hover:bg-paper-deep">
                  <link.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-plex text-sm font-semibold text-ink">
                    {link.label}
                  </p>
                  <p className="font-plex text-xs text-ink-muted">
                    {link.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-ink-muted group-hover:text-amber-deep transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
