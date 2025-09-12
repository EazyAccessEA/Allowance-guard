'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
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
      
      <Section>
        <Container>
          <H1 className="mb-6">Features</H1>
          <p className="text-base text-stone max-w-reading">
            Discover all the powerful features that make Allowance Guard the most comprehensive wallet security tool available.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Core Features */}
      <Section>
        <Container>
          <H2 className="mb-6">Core Features</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreFeatures.map((feature) => (
              <div key={feature.title} className="border border-line rounded-md p-6">
                <h3 className="text-lg text-ink mb-3">{feature.title}</h3>
                <p className="text-base text-stone mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, index) => (
                    <li key={index} className="text-base text-stone flex items-center">
                      <CheckCircle className="w-4 h-4 text-ink mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Advanced Features */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Advanced Features</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advancedFeatures.map((feature) => (
              <div key={feature.title} className="border border-line rounded-md p-6 bg-white">
                <h3 className="text-lg text-ink mb-3">{feature.title}</h3>
                <p className="text-base text-stone mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, index) => (
                    <li key={index} className="text-base text-stone flex items-start">
                      <div className="w-2 h-2 bg-ink rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Supported Standards */}
      <Section>
        <Container>
          <H2 className="mb-6">Supported Token Standards</H2>
          <div className="border border-line rounded-md p-6 bg-mist">
            <p className="text-base text-stone mb-6">
              Allowance Guard supports all major Ethereum token standards:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportedStandards.map((standard) => (
                <div key={standard.standard} className="border border-line rounded-md p-4 text-center bg-white">
                  <h3 className="text-lg text-ink mb-2">{standard.standard}</h3>
                  <p className="text-base text-stone mb-3">{standard.description}</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-line text-ink">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {standard.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Integration Options */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Integration Options</H2>
          <div className="space-y-6">
            {integrationOptions.map((integration) => (
              <div key={integration.name} className="border border-line rounded-md p-6 bg-white">
                <h3 className="text-lg text-ink mb-3">{integration.name}</h3>
                <p className="text-base text-stone mb-4">{integration.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {integration.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-base text-stone">
                      <CheckCircle className="w-4 h-4 text-ink mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Performance Metrics */}
      <Section>
        <Container>
          <H2 className="mb-6">Performance & Reliability</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-line rounded-md p-6 text-center">
              <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg text-ink mb-2">Fast Scanning</h3>
              <p className="text-base text-stone">
                Scan thousands of approvals in seconds with our optimized blockchain queries.
              </p>
            </div>
            
            <div className="border border-line rounded-md p-6 text-center">
              <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg text-ink mb-2">99.9% Uptime</h3>
              <p className="text-base text-stone">
                Reliable service with enterprise-grade infrastructure and monitoring.
              </p>
            </div>
            
            <div className="border border-line rounded-md p-6 text-center">
              <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg text-ink mb-2">Zero Trust</h3>
              <p className="text-base text-stone">
                No data storage, no private key access, complete privacy protection.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Getting Started */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Ready to Get Started?</H2>
          <div className="border border-line rounded-md p-6 bg-white">
            <h3 className="text-lg text-ink mb-3">Start Protecting Your Wallet Today</h3>
            <p className="text-base text-stone mb-6">
              Join thousands of users who trust Allowance Guard to keep their wallets secure. 
              It&apos;s free, private, and takes just minutes to set up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-ink text-white font-medium rounded-md hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-ink/30"
              >
                <Eye className="w-4 h-4 mr-2" />
                Start Scanning
              </Link>
              <a 
                href="/docs" 
                className="inline-flex items-center px-6 py-3 bg-white text-ink font-medium rounded-md border border-line hover:bg-mist transition focus:outline-none focus:ring-2 focus:ring-ink/30"
              >
                <Settings className="w-4 h-4 mr-2" />
                View Documentation
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Comparison */}
      <Section>
        <Container>
          <H2 className="mb-6">Why Choose Allowance Guard?</H2>
          <div className="border border-line rounded-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg text-ink mb-2">Comprehensive</h3>
                <p className="text-base text-stone">
                  Supports all major networks and token standards with advanced risk analysis.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg text-ink mb-2">Private</h3>
                <p className="text-base text-stone">
                  Local processing ensures your data never leaves your browser.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg text-ink mb-2">Fast</h3>
                <p className="text-base text-stone">
                  Optimized for speed with real-time scanning and instant notifications.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}