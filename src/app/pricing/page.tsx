'use client'

import React, { useState } from 'react'
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import { H1, H2 } from '@/components/ui/Heading'
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
    <div className="flex items-center justify-center gap-3">
      <span
        className={cn(
          'text-sm font-medium transition-colors duration-150',
          billingPeriod === 'monthly' ? 'text-text-primary' : 'text-text-secondary'
        )}
      >
        Monthly
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={billingPeriod === 'yearly'}
        aria-label="Toggle yearly billing"
        onClick={() =>
          onChange(billingPeriod === 'monthly' ? 'yearly' : 'monthly')
        }
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
          billingPeriod === 'yearly' ? 'bg-amber-500' : 'bg-secondary-600'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-150',
            billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
      <span
        className={cn(
          'text-sm font-medium transition-colors duration-150',
          billingPeriod === 'yearly' ? 'text-text-primary' : 'text-text-secondary'
        )}
      >
        Yearly
      </span>
      {billingPeriod === 'yearly' && (
        <span className="rounded-full bg-green-900/40 px-2 py-0.5 text-xs font-medium text-green-300">
          Save up to 34%
        </span>
      )}
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-secondary-700">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-text-primary transition-colors duration-150 hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        aria-expanded={open}
      >
        {question}
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
        )}
      </button>
      {open && (
        <div className="pb-4 text-sm leading-relaxed text-text-secondary">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

  return (
    <main>
      {/* Hero */}
      <Section size="lg" background="default" center>
        <Container size="lg">
          <H1 className="mb-4">Pricing that respects your wallet</H1>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            The core scanner is free and open source. Premium plans unlock monitoring,
            batch operations, team tools, and API access.
          </p>

          {/* Billing toggle */}
          <div className="mt-8">
            <BillingToggle
              billingPeriod={billingPeriod}
              onChange={setBillingPeriod}
            />
          </div>
        </Container>
      </Section>

      {/* Pricing cards */}
      <Section size="sm" background="default">
        <Container size="lg">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <PricingCard plan="free" billingPeriod={billingPeriod} />
            <PricingCard
              plan="pro"
              billingPeriod={billingPeriod}
              highlighted
            />
            <PricingCard plan="sentinel" billingPeriod={billingPeriod} />
          </div>
        </Container>
      </Section>

      {/* Comparison table */}
      <Section size="default" background="muted" center>
        <Container size="lg">
          <H2 className="mb-8">Feature comparison</H2>
          <PricingTable />
        </Container>
      </Section>

      {/* API Plans */}
      <Section size="default" background="default" center>
        <Container size="lg">
          <H2 className="mb-2">API Plans</H2>
          <p className="mx-auto mb-8 max-w-2xl text-text-secondary">
            Build on AllowanceGuard. Scan wallets, query allowances, and score risk
            through a REST API with predictable rate limits.
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <ApiPricingCard plan="api_free" />
            <ApiPricingCard plan="api_developer" highlighted />
            <ApiPricingCard plan="api_growth" />
            <ApiPricingCard plan="api_enterprise" />
          </div>
        </Container>
      </Section>

      {/* API comparison table */}
      <Section size="sm" background="muted" center>
        <Container size="lg">
          <H2 className="mb-8">API feature comparison</H2>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-secondary-700">
                  <th className="py-4 pr-4 text-sm font-medium text-text-secondary">Feature</th>
                  <th className="px-4 py-4 text-center text-sm font-medium text-text-primary">Free</th>
                  <th className="px-4 py-4 text-center text-sm font-medium text-amber-400">Developer</th>
                  <th className="px-4 py-4 text-center text-sm font-medium text-text-primary">Growth</th>
                  <th className="px-4 py-4 text-center text-sm font-medium text-text-primary">Enterprise</th>
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
                      'border-b border-secondary-700',
                      idx % 2 === 1 && 'bg-secondary-800/50'
                    )}
                  >
                    <td className="py-3 pr-4 text-sm text-text-primary">{row.label}</td>
                    {row.values.map((val, i) => (
                      <td key={i} className="px-4 py-3 text-center text-sm">
                        {typeof val === 'boolean' ? (
                          val ? (
                            <Check className="mx-auto h-5 w-5 text-emerald-400" aria-label="Included" />
                          ) : (
                            <X className="mx-auto h-5 w-5 text-secondary-600" aria-label="Not included" />
                          )
                        ) : (
                          <span className="font-medium text-text-primary">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section size="default" background="default">
        <Container size="sm">
          <H2 className="mb-8 text-center">Frequently asked questions</H2>
          <div className="divide-y-0">
            {FAQ_ITEMS.map((item) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  )
}
