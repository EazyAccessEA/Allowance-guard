'use client'

/**
 * Pricing page — Ledger aesthetic.
 *
 * Must remain 'use client' — billing toggle + FAQ accordion state.
 *
 * Council:
 *  Kael: font-display-tight (no inline fontFamily), no rounded-full/2xl/xl, no gradient text
 *  Maren: grain on sections, Highlight on headline, amber hairlines
 *  Idris: CascadingScrollAnimation on card sections
 *  Noor: FAQ buttons have aria-expanded, feature lists have role=list
 *  #22 Conversion: Free CTA → "Join the waitlist" (product not live)
 *  #20 Brand: "Pricing that respects your wallet" → editorial, not playful
 */

import React, { useState } from 'react'
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Container from '@/components/ui/Container'
import Highlight from '@/components/ui/Highlight'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'
import PricingCard from '@/components/PricingCard'
import PricingTable from '@/components/PricingTable'
import ApiPricingCard from '@/components/ApiPricingCard'

type BillingPeriod = 'monthly' | 'yearly'

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'Is the core scanner really free?',
    answer:
      'Yes. The open-source core scanner is free and will stay free. Scan up to 3 wallets on a single chain, view risk scores, and revoke approvals \u2014 no account required. Premium features like continuous monitoring, batch revoke, and team dashboards are paid.',
  },
  {
    question: 'Can I switch between monthly and yearly?',
    answer:
      'Yes, from your account settings at any time. Switching to yearly billing applies a prorated credit for your remaining monthly period.',
  },
  {
    question: 'What happens when I cancel?',
    answer:
      'Your premium features stay active until the end of the current billing period. After that, your account reverts to the Free plan. Your data is kept \u2014 premium features are paused, not deleted.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'Full refund within 14 days of your first payment. After that, cancel any time \u2014 your access continues through the billing period, but partial refunds are not issued.',
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
    <div className="inline-flex items-center gap-1 bg-paper-sub border border-ink-rule p-1">
      <button
        type="button"
        onClick={() => onChange('monthly')}
        className={cn(
          'px-4 py-2 text-sm font-medium font-plex transition-all duration-150',
          billingPeriod === 'monthly'
            ? 'bg-ink text-paper'
            : 'text-ink-muted hover:text-ink'
        )}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange('yearly')}
        className={cn(
          'px-4 py-2 text-sm font-medium font-plex transition-all duration-150 flex items-center gap-2',
          billingPeriod === 'yearly'
            ? 'bg-ink text-paper'
            : 'text-ink-muted hover:text-ink'
        )}
      >
        Yearly
        <span className="bg-paper-sub border border-ink-rule px-2 py-0.5 text-xs font-bold font-mono text-emerald-800">
          Save 34%
        </span>
      </button>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-ink-rule">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left text-sm font-medium font-plex text-ink transition-colors duration-150 hover:text-amber-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        aria-expanded={open}
      >
        {question}
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-ink-whisper" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-ink-whisper" aria-hidden="true" />
        )}
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed font-plex text-ink-muted">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

  return (
    <main className="min-h-screen bg-paper">

      {/* ── Hero ── */}
      <section className="paper grain relative overflow-hidden border-b border-ink-rule">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(245,158,11,0.10) 0%, transparent 55%),' +
              'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(250,244,230,0.6) 0%, transparent 80%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.4) 50%, transparent 90%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-amber-deep/40" aria-hidden="true" />
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
              Pricing
            </span>
            <span className="h-px w-8 bg-amber-deep/40" aria-hidden="true" />
          </div>

          <h1 className="font-display-tight text-ink leading-[0.95] text-4xl sm:text-5xl lg:text-6xl mb-5">
            Pricing that respects
            <br />
            <Highlight>your wallet.</Highlight>
          </h1>
          <p className="mx-auto max-w-xl font-plex text-lg text-ink-muted mb-10 leading-relaxed">
            The core scanner is free and open source. Premium plans unlock
            monitoring, batch operations, team tools, and API access.
          </p>

          <BillingToggle
            billingPeriod={billingPeriod}
            onChange={setBillingPeriod}
          />
        </div>
      </section>

      {/* ── Consumer pricing cards ── */}
      <section className="paper-sub grain relative py-16 sm:py-20">
        <Container className="relative max-w-5xl">
          <CascadingScrollAnimation direction="up" distance={40} delay={0}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
              <PricingCard plan="free" billingPeriod={billingPeriod} />
              <PricingCard
                plan="pro"
                billingPeriod={billingPeriod}
                highlighted
              />
              <PricingCard plan="sentinel" billingPeriod={billingPeriod} />
            </div>
          </CascadingScrollAnimation>
        </Container>
      </section>

      {/* ── Comparison table ── */}
      <section className="paper grain py-16 sm:py-20 border-t border-ink-rule">
        <Container className="max-w-5xl">
          <CascadingScrollAnimation direction="up" distance={40} delay={0}>
            <h2 className="font-display-tight text-ink text-2xl sm:text-3xl mb-10 text-center">
              Compare plans.
            </h2>
            <PricingTable />
          </CascadingScrollAnimation>
        </Container>
      </section>

      {/* ── API Plans ── */}
      <section className="paper-sub grain py-16 sm:py-20 border-t border-ink-rule">
        <Container className="max-w-5xl text-center">
          <CascadingScrollAnimation direction="up" distance={40} delay={0}>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-amber-deep/40" aria-hidden="true" />
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
                For developers
              </span>
              <span className="h-px w-8 bg-amber-deep/40" aria-hidden="true" />
            </div>

            <h2 className="font-display-tight text-ink text-2xl sm:text-3xl mb-3">
              API plans.
            </h2>
            <p className="mx-auto mb-10 max-w-xl font-plex text-ink-muted">
              Build on AllowanceGuard. Scan wallets, query allowances, and score risk
              through a REST API with predictable rate limits.
            </p>
          </CascadingScrollAnimation>

          <CascadingScrollAnimation direction="up" distance={40} delay={100}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ApiPricingCard plan="api_free" />
              <ApiPricingCard plan="api_developer" highlighted />
              <ApiPricingCard plan="api_growth" />
              <ApiPricingCard plan="api_enterprise" />
            </div>
          </CascadingScrollAnimation>
        </Container>
      </section>

      {/* ── API comparison table ── */}
      <section className="paper grain py-16 sm:py-20 border-t border-ink-rule">
        <Container className="max-w-5xl text-center">
          <CascadingScrollAnimation direction="up" distance={40} delay={0}>
            <h2 className="font-display-tight text-ink text-2xl sm:text-3xl mb-10">
              API feature comparison.
            </h2>
            <div className="w-full overflow-x-auto bg-paper-sub border border-ink-rule p-1">
              <table className="w-full min-w-[600px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-ink-rule">
                    <th className="py-4 px-4 font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">Feature</th>
                    <th className="px-4 py-4 text-center font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">Free</th>
                    <th className="px-4 py-4 text-center font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">Developer</th>
                    <th className="px-4 py-4 text-center font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">Growth</th>
                    <th className="px-4 py-4 text-center font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="font-plex">
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
                        'border-b border-ink-rule/30',
                        idx % 2 === 1 && 'bg-paper-sub'
                      )}
                    >
                      <td className="py-3.5 px-4 text-sm text-ink-soft">{row.label}</td>
                      {row.values.map((val, i) => (
                        <td key={i} className="px-4 py-3.5 text-center text-sm">
                          {typeof val === 'boolean' ? (
                            val ? (
                              <Check className="mx-auto h-5 w-5 text-emerald-800" aria-label="Included" />
                            ) : (
                              <X className="mx-auto h-5 w-5 text-ink-whisper" aria-label="Not included" />
                            )
                          ) : (
                            <span className="font-medium text-ink">{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CascadingScrollAnimation>
        </Container>
      </section>

      {/* ── FAQ ── */}
      <section className="paper-sub grain py-16 sm:py-20 border-t border-ink-rule">
        <Container className="max-w-2xl">
          <CascadingScrollAnimation direction="up" distance={40} delay={0}>
            <h2 className="font-display-tight text-ink text-2xl sm:text-3xl mb-10 text-center">
              Questions.
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
          </CascadingScrollAnimation>
        </Container>
      </section>

      {/* ── Trust line ── */}
      <section className="paper grain pb-16 sm:pb-20 pt-8">
        <Container className="max-w-2xl text-center">
          <p className="font-mono text-xs text-ink-whisper tracking-wider uppercase">
            Open source core &middot; AGPL-3.0 license &middot; Independently operated &middot; 14-day refund policy
          </p>
        </Container>
      </section>
    </main>
  )
}
