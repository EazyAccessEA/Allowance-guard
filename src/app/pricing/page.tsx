'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import { H1, H2 } from '@/components/ui/Heading'
import PricingCard from '@/components/PricingCard'
import PricingTable from '@/components/PricingTable'

type BillingPeriod = 'monthly' | 'yearly'

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'Is the core scanner really free?',
    answer:
      'Yes. The open-source core scanner is free and always will be. You can scan up to 3 wallets on a single chain, view risk labels, and revoke approvals at no cost. Premium features like multi-chain monitoring, batch revoke, and team dashboards require a paid plan.',
  },
  {
    question: 'Can I switch between monthly and yearly billing?',
    answer:
      'Absolutely. You can switch billing periods at any time from your account settings. When you switch to yearly billing, you will receive a prorated credit for the remaining time on your current monthly plan.',
  },
  {
    question: 'What happens if I cancel my subscription?',
    answer:
      'Your premium features remain active until the end of your current billing period. After that, your account reverts to the Free plan. All your data is retained, but access to premium features like monitoring and batch revoke will be paused.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a full refund within 14 days of your first subscription payment. After that, you can cancel at any time but refunds are not issued for partial billing periods.',
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
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2',
          billingPeriod === 'yearly' ? 'bg-primary-700' : 'bg-neutral-300 dark:bg-secondary-600'
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
        <span className="rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
          Save up to 34%
        </span>
      )}
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border-primary">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-text-primary transition-colors duration-150 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
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
          <H1 className="mb-4">Simple, transparent pricing</H1>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Core tool: free and open source. Always. Premium monitoring and API
            access for power users and teams.
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
