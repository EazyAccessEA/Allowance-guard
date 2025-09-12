'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { Shield, Eye, Settings, Zap, Lock, CheckCircle } from 'lucide-react'

export default function FeaturesPage() {
  const { isConnected } = useAccount()

  const coreFeatures = [
    {
      title: 'Multi-Network Scanning',
      description: 'Scan your wallet across Ethereum, Arbitrum, and Base networks',
      details: [
        'Ethereum mainnet support',
        'Arbitrum Layer 2 integration',
        'Base network compatibility',
        'Unified cross-chain view'
      ]
    },
    {
      title: 'Risk Assessment',
      description: 'Advanced algorithms analyze approval risks and provide actionable insights',
      details: [
        'Unlimited approval detection',
        'Stale approval identification',
        'Contract reputation analysis',
        'Amount-based risk scoring'
      ]
    },
    {
      title: 'Real-Time Alerts',
      description: 'Get notified immediately when new risky approvals are detected',
      details: [
        'Email notifications',
        'Slack integration',
        'Customizable thresholds',
        'Multiple alert types'
      ]
    },
    {
      title: 'Privacy Protection',
      description: 'Complete privacy with local processing and no data storage',
      details: [
        'Local browser processing',
        'No private key access',
        'Minimal data collection',
        'Open source transparency'
      ]
    }
  ]

  const advancedFeatures = [
    {
      title: 'Smart Filtering',
      description: 'Filter approvals by risk level, amount, or contract type',
      benefits: [
        'Focus on high-risk approvals',
        'Hide safe, trusted contracts',
        'Sort by amount or date',
        'Custom risk thresholds'
      ]
    },
    {
      title: 'Batch Operations',
      description: 'Revoke multiple approvals at once to save time and gas',
      benefits: [
        'Bulk revocation support',
        'Gas-optimized transactions',
        'Progress tracking',
        'Error handling'
      ]
    },
    {
      title: 'Historical Tracking',
      description: 'Track approval changes over time to monitor your security',
      benefits: [
        'Approval history logs',
        'Change notifications',
        'Security trend analysis',
        'Audit trail maintenance'
      ]
    },
    {
      title: 'Team Collaboration',
      description: 'Share security insights with your team via Slack integration',
      benefits: [
        'Shared Slack channels',
        'Team-wide notifications',
        'Collaborative monitoring',
        'Centralized security dashboard'
      ]
    }
  ]

  const supportedStandards = [
    {
      standard: 'ERC-20',
      description: 'Fungible token approvals',
      status: 'Full Support'
    },
    {
      standard: 'ERC-721',
      description: 'NFT approvals',
      status: 'Full Support'
    },
    {
      standard: 'ERC-1155',
      description: 'Multi-token approvals',
      status: 'Full Support'
    },
    {
      standard: 'ERC-2612',
      description: 'Permit-based approvals',
      status: 'Full Support'
    }
  ]

  const integrationOptions = [
    {
      name: 'Email Alerts',
      description: 'Receive security notifications via email',
      features: ['Daily digests', 'Immediate alerts', 'Weekly summaries', 'Custom schedules']
    },
    {
      name: 'Slack Integration',
      description: 'Get real-time notifications in your workspace',
      features: ['Webhook support', 'Team channels', 'Custom formatting', 'Rich notifications']
    },
    {
      name: 'API Access',
      description: 'Integrate with your own applications',
      features: ['RESTful API', 'Webhook endpoints', 'Rate limiting', 'Documentation']
    }
  ]

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
      {/* Hero Section - Fireart Style */}
      <Section className="py-24 sm:py-32">
        <Container className="text-center max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-[1.1] tracking-tight mb-8">
            Features
          </h1>
          <p className="text-xl sm:text-2xl text-stone leading-relaxed max-w-3xl mx-auto">
            Discover all the powerful features that make Allowance Guard the most comprehensive wallet security tool available.
          </p>
        </Container>
      </Section>

      {/* Core Features - Fireart Style */}
      <Section className="py-24">
        <Container>
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Core Features
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Essential security features that protect your wallet across all major networks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {coreFeatures.map((feature) => (
              <div key={feature.title} className="bg-white border border-line rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-semibold text-ink mb-4">{feature.title}</h3>
                <p className="text-lg text-stone leading-relaxed mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.details.map((detail, index) => (
                    <li key={index} className="text-base text-stone flex items-start">
                      <CheckCircle className="w-5 h-5 text-cobalt mr-3 mt-0.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Advanced Features - Fireart Style */}
      <Section className="py-24 bg-mist/30">
        <Container>
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Advanced Features
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Powerful tools for advanced users and teams managing multiple wallets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {advancedFeatures.map((feature) => (
              <div key={feature.title} className="bg-white border border-line rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-semibold text-ink mb-4">{feature.title}</h3>
                <p className="text-lg text-stone leading-relaxed mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, index) => (
                    <li key={index} className="text-base text-stone flex items-start">
                      <div className="w-2 h-2 bg-cobalt rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Supported Standards - Fireart Style */}
      <Section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Supported Token Standards
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Allowance Guard supports all major Ethereum token standards with full compatibility.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportedStandards.map((standard) => (
              <div key={standard.standard} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-cobalt/10 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-cobalt" />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">{standard.standard}</h3>
                <p className="text-stone leading-relaxed mb-4">{standard.description}</p>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-cobalt/10 text-cobalt border border-cobalt/20">
                  {standard.status}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Integration Options - Fireart Style */}
      <Section className="py-24 bg-mist/30">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Integration Options
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Seamlessly integrate Allowance Guard into your existing workflow.
            </p>
          </div>
          <div className="space-y-8">
            {integrationOptions.map((integration) => (
              <div key={integration.name} className="bg-white border border-line rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-semibold text-ink mb-4">{integration.name}</h3>
                <p className="text-lg text-stone leading-relaxed mb-6">{integration.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {integration.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-base text-stone">
                      <CheckCircle className="w-5 h-5 text-cobalt mr-3 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Performance Metrics - Fireart Style */}
      <Section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Performance & Reliability
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Built for speed, security, and reliability with enterprise-grade infrastructure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-cobalt/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-cobalt" />
              </div>
              <h3 className="text-2xl font-semibold text-ink mb-4">Fast Scanning</h3>
              <p className="text-lg text-stone leading-relaxed">
                Scan thousands of approvals in seconds with our optimized blockchain queries.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-cobalt/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-cobalt" />
              </div>
              <h3 className="text-2xl font-semibold text-ink mb-4">99.9% Uptime</h3>
              <p className="text-lg text-stone leading-relaxed">
                Reliable service with enterprise-grade infrastructure and monitoring.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-cobalt/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-cobalt" />
              </div>
              <h3 className="text-2xl font-semibold text-ink mb-4">Zero Trust</h3>
              <p className="text-lg text-stone leading-relaxed">
                No data storage, no private key access, complete privacy protection.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Getting Started - Fireart Style */}
      <Section className="py-24 bg-mist/30">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Join thousands of users who trust Allowance Guard to keep their wallets secure.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-line rounded-2xl p-8 shadow-subtle text-center">
              <h3 className="text-2xl font-semibold text-ink mb-4">Start Protecting Your Wallet Today</h3>
              <p className="text-lg text-stone leading-relaxed mb-8">
                It&apos;s free, private, and takes just minutes to set up.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/" 
                  className="inline-flex items-center px-8 py-4 bg-ink text-white font-medium rounded-lg hover:bg-ink/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ink/30"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Start Scanning
                </Link>
                <a 
                  href="/docs" 
                  className="inline-flex items-center px-8 py-4 bg-white text-ink font-medium rounded-lg border border-line hover:bg-mist transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ink/30"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  View Documentation
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Why Choose - Fireart Style */}
      <Section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Why Choose Allowance Guard?
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Three key advantages that make us the leading wallet security solution.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-cobalt/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-cobalt" />
              </div>
              <h3 className="text-2xl font-semibold text-ink mb-4">Comprehensive</h3>
              <p className="text-lg text-stone leading-relaxed">
                Supports all major networks and token standards with advanced risk analysis.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-cobalt/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-cobalt" />
              </div>
              <h3 className="text-2xl font-semibold text-ink mb-4">Private</h3>
              <p className="text-lg text-stone leading-relaxed">
                Local processing ensures your data never leaves your browser.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-cobalt/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-cobalt" />
              </div>
              <h3 className="text-2xl font-semibold text-ink mb-4">Fast</h3>
              <p className="text-lg text-stone leading-relaxed">
                Optimized for speed with real-time scanning and instant notifications.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}