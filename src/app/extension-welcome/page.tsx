'use client'

import Link from 'next/link'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import { Shield, Eye, Bell, Zap, ArrowRight, CheckCircle, Chrome } from 'lucide-react'

const steps = [
  {
    number: '1',
    title: 'Visit any dApp',
    description:
      'Go to Uniswap, OpenSea, or any Web3 site. AllowanceGuard runs silently in the background.',
  },
  {
    number: '2',
    title: 'Trigger a transaction',
    description:
      'When a dApp asks you to approve, permit, or setApprovalForAll, we intercept it before your wallet signs.',
  },
  {
    number: '3',
    title: 'Review the risk report',
    description:
      'A popup shows the risk level, spender details, and any issues found. You decide whether to proceed.',
  },
]

const features = [
  {
    icon: Eye,
    title: 'Pre-signing Detection',
    description: 'Catches approve(), permit(), permit2(), and setApprovalForAll() before you sign.',
  },
  {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Every approval is scored against our risk engine — unlimited amounts, unverified contracts, known scams.',
  },
  {
    icon: Bell,
    title: 'Real-time Alerts',
    description: 'High-risk approvals trigger an immediate warning with actionable details.',
  },
  {
    icon: Zap,
    title: 'Amount Modifier',
    description: 'Change unlimited approvals to exact amounts you actually need. Less exposure, same functionality.',
  },
]

export default function ExtensionWelcomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        <div
          className="absolute inset-0 z-10 dark:hidden"
          style={{
            background:
              'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)',
          }}
        />
        <div className="absolute inset-0 z-10 hidden dark:block bg-secondary-900/90" />

        <Container className="relative text-center max-w-3xl z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-sm font-medium mb-8">
            <CheckCircle className="w-4 h-4" />
            Extension installed successfully
          </div>

          <H1 className="mb-6">Welcome to AllowanceGuard</H1>

          <p className="text-lg text-text-tertiary dark:text-secondary-400 max-w-reading mx-auto mb-8">
            Your wallet now has a bodyguard. Every time a dApp asks you to approve
            tokens, AllowanceGuard checks whether it&apos;s safe — before you sign.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary-700 hover:bg-primary-800 text-white font-medium transition-colors"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border-primary hover:border-primary-700 text-text-primary dark:text-secondary-100 font-medium transition-colors"
            >
              View Pro Features
            </Link>
          </div>
        </Container>
      </Section>

      <div className="border-t border-border-primary" />

      {/* How it works */}
      <Section className="py-20 sm:py-28">
        <Container className="max-w-4xl">
          <H2 className="text-center mb-16">How It Works</H2>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="mobbin-card mobbin-card-hover text-center"
              >
                <div className="p-8">
                  <div className="w-12 h-12 rounded-full bg-primary-700/10 dark:bg-primary-400/10 text-primary-700 dark:text-primary-400 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary dark:text-secondary-100 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-tertiary dark:text-secondary-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <div className="border-t border-border-primary" />

      {/* Features */}
      <Section className="py-20 sm:py-28 bg-background-secondary dark:bg-secondary-900/50">
        <Container className="max-w-4xl">
          <H2 className="text-center mb-16">What the Extension Does</H2>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="mobbin-card mobbin-card-hover"
              >
                <div className="p-6">
                  <feature.icon className="w-8 h-8 text-primary-700 dark:text-primary-400 mb-4" />
                  <h3 className="text-base font-semibold text-text-primary dark:text-secondary-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-tertiary dark:text-secondary-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <div className="border-t border-border-primary" />

      {/* Quick settings */}
      <Section className="py-20 sm:py-28">
        <Container className="max-w-2xl text-center">
          <Chrome className="w-12 h-12 text-text-tertiary dark:text-secondary-400 mx-auto mb-6" />
          <H2 className="mb-4">You&apos;re All Set</H2>
          <p className="text-text-tertiary dark:text-secondary-400 mb-8">
            The extension is active and running. Click the AllowanceGuard icon in your
            browser toolbar to check your protection status or adjust settings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/settings"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border-primary hover:border-primary-700 text-text-primary dark:text-secondary-100 font-medium transition-colors"
            >
              Extension Settings
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border-primary hover:border-primary-700 text-text-primary dark:text-secondary-100 font-medium transition-colors"
            >
              Read the Docs
            </Link>
          </div>
        </Container>
      </Section>

      {/* Upgrade prompt */}
      <Section className="py-16 sm:py-20 bg-gradient-to-r from-primary-700 to-primary-600">
        <Container className="max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Want Enhanced Protection?
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Pro users get exploit database checks, contract audit status, scam pattern
            detection, and email alerts when risky contracts target their wallets.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
          >
            See Plans &amp; Pricing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Container>
      </Section>
    </div>
  )
}
