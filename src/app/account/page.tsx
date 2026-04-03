'use client'

import React, { useEffect, useState } from 'react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
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
  const [loading, setLoading] = useState(true)

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
    <Section size="sm" background="muted">
      <Container size="lg">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
              <User className="h-5 w-5 text-primary-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Account
              </h1>
              <p className="text-sm text-text-secondary">
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
                  'group flex items-center gap-4 rounded-lg border border-border-primary bg-background-primary p-5',
                  'transition-all duration-150 hover:border-primary-300 hover:shadow-md'
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700 group-hover:bg-primary-100">
                  <link.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">
                    {link.label}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {link.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-text-secondary group-hover:text-primary-700 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
