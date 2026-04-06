'use client'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import Link from 'next/link'
import { Eye, Settings, Puzzle, Globe } from 'lucide-react'
import VideoBackground from '@/components/VideoBackground'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-10 dark:hidden"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        <div className="absolute inset-0 z-10 hidden dark:block bg-secondary-900/90" />
        
        <Container className="relative text-left max-w-4xl z-10">
          <div>
            <H1 className="mb-6">One Problem. Every Angle Covered.</H1>
            <p className="text-base text-text-tertiary dark:text-secondary-400 max-w-reading mb-8">
              Token approvals are invisible attack surface. AllowanceGuard makes them visible, scores their risk, and lets you revoke them — across 10 chains, from one dashboard.
            </p>
          </div>
        </Container>
      </Section>

      <div className="border-t border-secondary-700" />

      {/* Core Features */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-12">Core Security Features</H2>
            
            <div className="space-y-8">
              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-4">Allowance Dashboard</h3>
                  <p className="text-base text-text-tertiary dark:text-secondary-400 leading-relaxed">
                    Every token approval your wallet has ever granted, in one view. Spender address, token, amount, and risk score — indexed from the chain in real time. No more hunting through block explorers to find what you approved six months ago.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-4">Risk Scoring Engine</h3>
                  <p className="text-base text-text-tertiary dark:text-secondary-400 leading-relaxed">
                    Each approval is scored against live threat intelligence. Unlimited amounts, unverified contract code, known exploit addresses, and anomalous patterns all increase the score. The riskiest approvals surface first so you act where it matters.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-4">Gas-Efficient Revocation</h3>
                  <p className="text-base text-text-tertiary dark:text-secondary-400 leading-relaxed">
                    Single-click revoke for individual approvals. Batch revoke for multiple — bundled into one transaction through an optimised contract that cuts gas costs. Every transaction executes from your own wallet. We construct it, you sign it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Advanced Features */}
      <Section className="py-32 bg-background-secondary">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-12">Advanced Security Tools</H2>
            
            <div className="space-y-8">
              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-4">Time Machine</h3>
                  <p className="text-base text-text-tertiary dark:text-secondary-400 leading-relaxed">
                    Simulate revocations before spending gas. Toggle approvals on and off to see how your risk score changes in real time. Plan your security strategy, then execute it with confidence.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-4">Non-Custodial Architecture</h3>
                  <p className="text-base text-text-tertiary dark:text-secondary-400 leading-relaxed">
                    Read-only connection for data. You sign every transaction in MetaMask, WalletConnect, or your preferred wallet. We never hold keys, seed phrases, or funds. This is architecture, not policy — we cannot access your assets even if we wanted to.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-4">Clarity-First Interface</h3>
                  <p className="text-base text-text-tertiary dark:text-secondary-400 leading-relaxed">
                    Intentional hierarchy, plain language, accessible contrast, and immediate feedback on every action. You should never wonder what a term means, what a button will do, or what state the system is in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Browser Extension */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-12">Browser Extension</H2>

            <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Puzzle className="w-6 h-6 text-primary-700" />
                  <h3 className="text-xl font-semibold text-text-primary dark:text-secondary-100">Real-Time Transaction Screening</h3>
                </div>
                <p className="text-base text-text-tertiary dark:text-secondary-400 leading-relaxed mb-6">
                  Get warned before you sign risky approvals — right in your browser. The extension analyses every approval request in real time, flagging unlimited amounts, suspicious contracts, and known threats before you confirm. Protection that travels with you across every dApp.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                    <Globe className="w-4 h-4" />
                    Chrome &middot; Pending Approval
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                    Firefox &middot; Pending Approval
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <div className="border-t border-secondary-700" />

      {/* Call to Action */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto text-left">
            <H2 className="mb-8">See What Your Wallet Has Approved</H2>
            <p className="text-base text-text-tertiary dark:text-secondary-400 max-w-reading mb-12">
              Connect your wallet or paste an address. Your first scan takes under a minute.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mobbin-fade-in mobbin-stagger-2">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring bg-primary-700 text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-700/30"
              >
                <Eye className="w-5 h-5 mr-2" />
                Start Scanning
              </Link>
              <Link 
                href="/docs" 
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring border border-primary-700 text-primary-700 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-700/30"
              >
                <Settings className="w-5 h-5 mr-2" />
                View Documentation
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}