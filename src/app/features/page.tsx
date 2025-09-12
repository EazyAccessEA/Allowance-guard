'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { Shield, Eye, Settings, Zap, Users, Bell, Globe, AlertTriangle } from 'lucide-react'
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
          <H1 className="mb-6">Features</H1>
          <p className="text-base text-stone max-w-reading mb-8">
            Everything you need to secure your wallet. Free, open source, and built for privacy.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Core Features - Fireart Style */}
      <Section className="py-32">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-12">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-4">Multi-Network Support</h3>
                    <p className="text-stone leading-relaxed">
                      Scan across Ethereum, Arbitrum, and Base networks with unified results. 
                      Comprehensive coverage ensures no approval goes unnoticed.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-4">Advanced Risk Assessment</h3>
                    <p className="text-stone leading-relaxed">
                      Intelligent algorithms identify unlimited and stale approvals automatically. 
                      Risk scoring helps prioritize the most critical security issues.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-4">Autonomous Monitoring</h3>
                    <p className="text-stone leading-relaxed">
                      Continuous monitoring with instant alerts when new approvals appear. 
                      Email and Slack notifications keep you informed of changes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-12">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-4">Team Collaboration</h3>
                    <p className="text-stone leading-relaxed">
                      Share wallet monitoring with role-based access control and invites. 
                      Perfect for teams, institutions, and security professionals.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-4">One-Click Revocation</h3>
                    <p className="text-stone leading-relaxed">
                      Revoke risky approvals instantly with gas-optimized transactions. 
                      Direct links to explorers and guided revocation flows.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-4">Privacy First</h3>
                    <p className="text-stone leading-relaxed">
                      Local processing ensures your data never leaves your browser. 
                      No private keys, no data storage, complete privacy protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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