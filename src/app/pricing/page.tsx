'use client'

import React, { useState } from 'react'
import { Check, ChevronDown, ChevronUp, X, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import Container from '@/components/ui/Container'
import PricingCard from '@/components/PricingCard'
import PricingTable from '@/components/PricingTable'
import ApiPricingCard from '@/components/ApiPricingCard'

type BillingPeriod = 'monthly' | 'yearly'

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'Is the core scanner really free?',
    answer:
      'Yes. The open-source core scanner is free and will stay free. Scan up to 3 wallets on a single chain, view risk scores, and revoke approvals — no account required. Premium features like continuous monitoring, batch revoke, and team dashboards are paid.',
  },
  {
    question: 'Can I switch between monthly and yearly?',
    answer:
      'Yes, from your account settings at any time. Switching to yearly billing applies a prorated credit for your remaining monthly period.',
  },
  {
    question: 'What happens when I cancel?',
    answer:
      'Your premium features stay active until the end of the current billing period. After that, your account reverts to the Free plan. Your data is kept — premium features are paused, not deleted.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'Full refund within 14 days of your first payment. After that, cancel any time — your access continues through the billing period, but partial refunds are not issued.',
  },
]

function BillingToggle({
  billingPeriod,
  onChange,
}: {
  billingPeriod: BillingPeriod
  onChange: (period: BillingPeriod) => void
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-slate-800/60 border border-slate-700/50 px-4 py-2">
      <button
        type="button"
        onClick={() => onChange('monthly')}
        className={cn(
          'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
          billingPeriod === 'monthly'
            ? 'bg-white/10 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-300'
        )}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange('yearly')}
        className={cn(
          'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 flex items-center gap-2',
          billingPeriod === 'yearly'
            ? 'bg-white/10 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-300'
        )}
      >
        Yearly
        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
          Save 34%
        </span>
      </button>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-slate-700/50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left text-sm font-medium text-slate-200 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        aria-expanded={open}
      >
        {question}
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
        )}
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed text-slate-400">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

  return (
    <main className="min-h-screen bg-[#0A0E1A]">

      {/* Hero — Midnight Amber treatment */}
      <section className="relative overflow-hidden border-b border-slate-700/30">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A] via-[#0F172A] to-[#0A0E1A]" />
        {/* Amber glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 60% 50%, rgba(245,158,11,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Signature amber line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.3) 50%, transparent 90%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-[0.15em]">
              Pricing
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-5 leading-[1.1]"
            style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
          >
            Pricing that respects
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
              your wallet
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-400 mb-10 leading-relaxed">
            The core scanner is free and open source. Premium plans unlock
            monitoring, batch operations, team tools, and API access.
          </p>

          {/* Billing toggle */}
          <BillingToggle
            billingPeriod={billingPeriod}
            onChange={setBillingPeriod}
          />
        </div>
      </section>

      {/* Consumer pricing cards */}
      <section className="relative py-16 sm:py-20">
        {/* Subtle ambient glow behind Pro card */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 60%)',
          }}
        />

        <Container className="relative max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
            <PricingCard plan="free" billingPeriod={billingPeriod} />
            <PricingCard
              plan="pro"
              billingPeriod={billingPeriod}
              highlighted
            />
            <PricingCard plan="sentinel" billingPeriod={billingPeriod} />
          </div>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="py-16 sm:py-20 border-t border-slate-700/30">
        <Container className="max-w-5xl">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-10 text-center"
            style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
          >
            Compare plans
          </h2>
          <PricingTable />
        </Container>
      </section>

      {/* API Plans */}
      <section className="py-16 sm:py-20 border-t border-slate-700/30">
        <Container className="max-w-5xl text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3"
            style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
          >
            API Plans
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-slate-400">
            Build on AllowanceGuard. Scan wallets, query allowances, and score risk
            through a REST API with predictable rate limits.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ApiPricingCard plan="api_free" />
            <ApiPricingCard plan="api_developer" highlighted />
            <ApiPricingCard plan="api_growth" />
            <ApiPricingCard plan="api_enterprise" />
          </div>
        </Container>
      </section>

      {/* API comparison table */}
      <section className="py-16 sm:py-20 border-t border-slate-700/30">
        <Container className="max-w-5xl text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-10"
            style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
          >
            API feature comparison
          </h2>
          <div className="w-full overflow-x-auto rounded-xl bg-white/[0.02] ring-1 ring-white/[0.06] p-1">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="py-4 px-4 text-sm font-medium text-slate-400">Feature</th>
                  <th className="px-4 py-4 text-center text-sm font-medium text-slate-300">Free</th>
                  <th className="px-4 py-4 text-center text-sm font-medium text-amber-400">Developer</th>
                  <th className="px-4 py-4 text-center text-sm font-medium text-slate-300">Growth</th>
                  <th className="px-4 py-4 text-center text-sm font-medium text-slate-300">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'API calls/day', values: ['100', '10,000', '100,000', 'Unlimited'] },
                  { label: 'Burst rate (req/min)', values: ['10', '60', '300', 'Unlimited'] },
                  { label: 'Webhook integrations', values: [false, true, true, true] },
                  { label: 'Priority processing', values: [false, false, true, true] },
                  { label: 'Price', values: ['Free', '$39/mo', '$149/mo', 'Custom'] },
                ].map((row, idx) => (
                  <tr
                    key={row.label}
                    className={cn(
                      'border-b border-slate-700/30',
                      idx % 2 === 1 && 'bg-white/[0.02]'
                    )}
                  >
                    <td className="py-3.5 px-4 text-sm text-slate-300">{row.label}</td>
                    {row.values.map((val, i) => (
                      <td key={i} className="px-4 py-3.5 text-center text-sm">
                        {typeof val === 'boolean' ? (
                          val ? (
                            <Check className="mx-auto h-5 w-5 text-emerald-400" aria-label="Included" />
                          ) : (
                            <X className="mx-auto h-5 w-5 text-slate-600" aria-label="Not included" />
                          )
                        ) : (
                          <span className="font-medium text-slate-200">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 border-t border-slate-700/30">
        <Container className="max-w-2xl">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-10 text-center"
            style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
          >
            Questions
          </h2>
          <div>
            {FAQ_ITEMS.map((item) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Trust line */}
      <section className="pb-16 sm:pb-20">
        <Container className="max-w-2xl text-center">
          <p className="text-sm text-slate-500">
            Open source core &middot; AGPL-3.0 license &middot; No VC &middot; No token &middot; 14-day refund policy
          </p>
        </Container>
      </section>
    </main>
  )
}
