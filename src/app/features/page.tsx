'use client'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import Link from 'next/link'
import { Eye, Settings } from 'lucide-react'
import VideoBackground from '@/components/VideoBackground'

export default function FeaturesPage() {


  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <h1 className="mobbin-display-1 text-text-primary mb-6 mobbin-fade-in">Built for Clarity, Designed for Security</h1>
          <p className="mobbin-body-large text-text-secondary leading-relaxed mb-8 mobbin-fade-in mobbin-stagger-1">
            Allowance Guard is engineered to solve one problem with ruthless efficiency: eliminating the hidden risk of token allowances. Every feature is designed to the PuredgeOS &apos;God-tier&apos; standard of clarity and performance, giving you unparalleled visibility and control over your wallet&apos;s permissions.
          </p>
        </Container>
      </Section>

      <div className="border-t border-border-primary" />

      {/* Comprehensive Allowance Dashboard */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto mobbin-card mobbin-card-hover mobbin-fade-in">
            <div className="p-8">
              <h2 className="mobbin-heading-1 text-text-primary mb-6">Comprehensive Allowance Dashboard</h2>
              <p className="mobbin-body-large text-text-secondary leading-relaxed">
                See every token approval your wallet has ever granted in one unified, clear view. Our system continuously indexes the blockchain to present a real-time ledger of all spenders, tokens, and amounts. The benefit for you is a complete audit of your wallet&apos;s security posture, transforming invisible risks into a manageable list. This eliminates the tedious and error-prone process of manually checking allowances on a block explorer.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Intelligent Risk Assessment */}
      <Section className="py-32 bg-background-secondary">
        <Container>
          <div className="max-w-4xl mx-auto mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2">
            <div className="p-8">
              <h2 className="mobbin-heading-1 text-text-primary mb-6">Intelligent Risk Assessment</h2>
              <p className="mobbin-body-large text-text-secondary leading-relaxed">
                Each allowance is automatically evaluated by our heuristic-based risk engine. We analyze key threat vectors including unlimited approvals, interactions with known malicious contracts, anomalously large amounts, and unverified contract code. The benefit for you is prioritized action; you immediately see which allowances pose the greatest threat, so you can focus your attention where it matters most. This is proactive security, not passive observation.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Gas-Efficient Revocation */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3">
            <div className="p-8">
              <h2 className="mobbin-heading-1 text-text-primary mb-6">Gas-Efficient Revocation</h2>
              <p className="mobbin-body-large text-text-secondary leading-relaxed">
                Execute revocations directly from the dashboard with a single click. For individual approvals, we construct the optimal approve(spender, 0) transaction. For multiple revokes, we leverage a custom, gas-optimized BatchRevoke smart contract to bundle actions and save significantly on network fees. The benefit for you is maximum security with minimal effort and cost. You reclaim control of your wallet with one action, executed securely through your own wallet provider.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Time Machine Simulation */}
      <Section className="py-32 bg-background-secondary">
        <Container>
          <div className="max-w-4xl mx-auto mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-4">
            <div className="p-8">
              <h2 className="mobbin-heading-1 text-text-primary mb-6">Time Machine Simulation</h2>
              <p className="mobbin-body-large text-text-secondary leading-relaxed">
                Plan your security strategy without committing on-chain transactions. Our Time Machine feature allows you to hypothetically revoke allowances and instantly see the resulting change to your overall risk profile. The benefit for you is confidence and education. You can experiment with different actions risk-free, understand the impact of your decisions, and optimize for security before spending any gas.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Non-Custodial Architecture */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-5">
            <div className="p-8">
              <h2 className="mobbin-heading-1 text-text-primary mb-6">Non-Custodial by Design</h2>
              <p className="mobbin-body-large text-text-secondary leading-relaxed">
                This is a fundamental architecture, not just a feature. Your connection is read-only for allowance data. All revocation transactions are proposed, signed, and broadcasted directly from your own wallet (MetaMask, WalletConnect, etc.). The benefit for you is absolute security and control. We never hold, nor can we ever access, your private keys, seed phrases, or assets. Your sovereignty is non-negotiable.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Clarity-First User Experience */}
      <Section className="py-32 bg-background-secondary">
        <Container>
          <div className="max-w-4xl mx-auto mobbin-card mobbin-card-hover mobbin-fade-in">
            <div className="p-8">
              <h2 className="mobbin-heading-1 text-text-primary mb-6">Clarity-First User Experience</h2>
              <p className="mobbin-body-large text-text-secondary leading-relaxed">
                Every interface element adheres to the PuredgeOS philosophy. This means intentional information hierarchy, purposeful microcopy written to an ~8th-grade reading level, accessible color contrasts, and immediate system feedback. The benefit for you is instant comprehension and zero cognitive overload. You are never left wondering what a term means, what an action will do, or what the state of the system is.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Technical Specifications - Mobbin Style */}
      <Section className="py-32 bg-background-tertiary tech-data-bg relative">
        {/* Technical Data Flow Background Elements */}
        <div className="hex-pattern" />
        <div className="data-flow-lines" />
        <div className="data-points" />
        <div className="tech-panel" />
        
        <Container>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16 mobbin-fade-in">
              <h2 className="mobbin-display-2 text-text-primary leading-tight mb-8">
                Built for security professionals
              </h2>
              <p className="mobbin-body-large text-text-secondary leading-relaxed">
                Allowance Guard combines powerful security features with an intuitive interface. 
                No complex setup, no hidden costs, no compromises on privacy.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
                <div className="p-6">
                  <div className="mobbin-heading-2 text-text-primary mb-2">3</div>
                  <div className="mobbin-body text-text-secondary">Supported Networks</div>
                  <div className="mobbin-caption text-text-tertiary">Ethereum, Arbitrum, Base</div>
                </div>
              </div>
              <div className="text-center mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2">
                <div className="p-6">
                  <div className="mobbin-heading-2 text-text-primary mb-2">4</div>
                  <div className="mobbin-body text-text-secondary">Token Standards</div>
                  <div className="mobbin-caption text-text-tertiary">ERC-20, ERC-721, ERC-1155, ERC-2612</div>
                </div>
              </div>
              <div className="text-center mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3">
                <div className="p-6">
                  <div className="mobbin-heading-2 text-text-primary mb-2">100%</div>
                  <div className="mobbin-body text-text-secondary">Open Source</div>
                  <div className="mobbin-caption text-text-tertiary">Auditable & Self-hostable</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mobbin-fade-in">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              >
                <Eye className="w-5 h-5 mr-2" />
                Start Scanning
              </Link>
              <Link 
                href="/docs" 
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring bg-background-primary text-text-primary border border-border-primary hover:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-primary-500/30"
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