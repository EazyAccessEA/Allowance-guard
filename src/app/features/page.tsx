'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { Eye, Settings } from 'lucide-react'
import VideoBackground from '@/components/VideoBackground'

export default function FeaturesPage() {
  const { isConnected } = useAccount()


  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
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
          <H1 className="mb-6">Built for Clarity, Designed for Security</H1>
          <p className="text-lg text-stone leading-relaxed mb-8">
            Allowance Guard is engineered to solve one problem with ruthless efficiency: eliminating the hidden risk of token allowances. Every feature is designed to the PuredgeOS &apos;God-tier&apos; standard of clarity and performance, giving you unparalleled visibility and control over your wallet&apos;s permissions.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Comprehensive Allowance Dashboard */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-8">Comprehensive Allowance Dashboard</h2>
            <p className="text-lg text-stone leading-relaxed">
              See every token approval your wallet has ever granted in one unified, clear view. Our system continuously indexes the blockchain to present a real-time ledger of all spenders, tokens, and amounts. The benefit for you is a complete audit of your wallet&apos;s security posture, transforming invisible risks into a manageable list. This eliminates the tedious and error-prone process of manually checking allowances on a block explorer.
            </p>
          </div>
        </Container>
      </Section>

      {/* Intelligent Risk Assessment */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-8">Intelligent Risk Assessment</h2>
            <p className="text-lg text-stone leading-relaxed">
              Each allowance is automatically evaluated by our heuristic-based risk engine. We analyze key threat vectors including unlimited approvals, interactions with known malicious contracts, anomalously large amounts, and unverified contract code. The benefit for you is prioritized action; you immediately see which allowances pose the greatest threat, so you can focus your attention where it matters most. This is proactive security, not passive observation.
            </p>
          </div>
        </Container>
      </Section>

      {/* Gas-Efficient Revocation */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-8">Gas-Efficient Revocation</h2>
            <p className="text-lg text-stone leading-relaxed">
              Execute revocations directly from the dashboard with a single click. For individual approvals, we construct the optimal approve(spender, 0) transaction. For multiple revokes, we leverage a custom, gas-optimized BatchRevoke smart contract to bundle actions and save significantly on network fees. The benefit for you is maximum security with minimal effort and cost. You reclaim control of your wallet with one action, executed securely through your own wallet provider.
            </p>
          </div>
        </Container>
      </Section>

      {/* Time Machine Simulation */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-8">Time Machine Simulation</h2>
            <p className="text-lg text-stone leading-relaxed">
              Plan your security strategy without committing on-chain transactions. Our Time Machine feature allows you to hypothetically revoke allowances and instantly see the resulting change to your overall risk profile. The benefit for you is confidence and education. You can experiment with different actions risk-free, understand the impact of your decisions, and optimize for security before spending any gas.
            </p>
          </div>
        </Container>
      </Section>

      {/* Non-Custodial Architecture */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-8">Non-Custodial by Design</h2>
            <p className="text-lg text-stone leading-relaxed">
              This is a fundamental architecture, not just a feature. Your connection is read-only for allowance data. All revocation transactions are proposed, signed, and broadcasted directly from your own wallet (MetaMask, WalletConnect, etc.). The benefit for you is absolute security and control. We never hold, nor can we ever access, your private keys, seed phrases, or assets. Your sovereignty is non-negotiable.
            </p>
          </div>
        </Container>
      </Section>

      {/* Clarity-First User Experience */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-8">Clarity-First User Experience</h2>
            <p className="text-lg text-stone leading-relaxed">
              Every interface element adheres to the PuredgeOS philosophy. This means intentional information hierarchy, purposeful microcopy written to an ~8th-grade reading level, accessible color contrasts, and immediate system feedback. The benefit for you is instant comprehension and zero cognitive overload. You are never left wondering what a term means, what an action will do, or what the state of the system is.
            </p>
          </div>
        </Container>
      </Section>

      {/* Technical Specifications - Fireart Style */}
      <Section className="py-32 bg-mist/20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-semibold text-ink leading-tight mb-8">
                Built for security professionals
              </h2>
              <p className="text-xl text-stone leading-relaxed">
                Allowance Guard combines powerful security features with an intuitive interface. 
                No complex setup, no hidden costs, no compromises on privacy.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-ink mb-2">3</div>
                <div className="text-stone">Supported Networks</div>
                <div className="text-xs text-stone/60">Ethereum, Arbitrum, Base</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ink mb-2">4</div>
                <div className="text-stone">Token Standards</div>
                <div className="text-xs text-stone/60">ERC-20, ERC-721, ERC-1155, ERC-2612</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ink mb-2">100%</div>
                <div className="text-stone">Open Source</div>
                <div className="text-xs text-stone/60">Auditable & Self-hostable</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200 bg-electric text-white hover:bg-electric/90 focus:outline-none focus:ring-2 focus:ring-electric/30"
              >
                <Eye className="w-5 h-5 mr-2" />
                Start Scanning
              </Link>
              <Link 
                href="/docs" 
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200 bg-white text-ink border border-line hover:bg-mist focus:outline-none focus:ring-2 focus:ring-ink/30"
              >
                <Settings className="w-5 h-5 mr-2" />
                View Documentation
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}