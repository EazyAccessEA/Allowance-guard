import Image from 'next/image'
import Link from 'next/link'
import { Shield, Eye, Mail, Settings, Zap, Lock, CheckCircle, AlertTriangle, Clock, Users, BarChart3, Bell, Coins, Image, Package, FileText } from 'lucide-react'

export default function FeaturesPage() {
  const coreFeatures = [
    {
      title: 'Multi-Network Scanning',
      description: 'Scan your wallet across Ethereum, Arbitrum, and Base networks',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
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
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
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
      icon: Bell,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
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
      icon: Lock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
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
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
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
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
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
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
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
      icon: Users,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
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
      icon: Coins,
      status: 'Full Support'
    },
    {
      standard: 'ERC-721',
      description: 'NFT approvals',
      icon: Image,
      status: 'Full Support'
    },
    {
      standard: 'ERC-1155',
      description: 'Multi-token approvals',
      icon: Package,
      status: 'Full Support'
    },
    {
      standard: 'ERC-2612',
      description: 'Permit-based approvals',
      icon: FileText,
      status: 'Full Support'
    }
  ]

  const integrationOptions = [
    {
      name: 'Email Alerts',
      description: 'Receive security notifications via email',
      icon: Mail,
      color: 'text-blue-600',
      features: ['Daily digests', 'Immediate alerts', 'Weekly summaries', 'Custom schedules']
    },
    {
      name: 'Slack Integration',
      description: 'Get real-time notifications in your workspace',
      icon: Settings,
      color: 'text-green-600',
      features: ['Webhook support', 'Team channels', 'Custom formatting', 'Rich notifications']
    },
    {
      name: 'API Access',
      description: 'Integrate with your own applications',
      icon: Zap,
      color: 'text-purple-600',
      features: ['RESTful API', 'Webhook endpoints', 'Rate limiting', 'Documentation']
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex items-center justify-center">
            <div className="relative w-12 h-12 mr-3">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Allowance Guard</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Features</h1>
          </div>
          <p className="text-gray-600">
            Discover all the powerful features that make Allowance Guard the most comprehensive wallet security tool available.
          </p>
        </div>

        {/* Core Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreFeatures.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className={`${feature.bgColor} border border-gray-200 rounded-lg p-6`}>
                  <div className="flex items-center mb-4">
                    <Icon className={`w-6 h-6 ${feature.color} mr-3`} />
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-1">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        {/* Advanced Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Advanced Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advancedFeatures.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Icon className={`w-6 h-6 ${feature.color} mr-3`} />
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className={`w-2 h-2 ${feature.bgColor} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        {/* Supported Standards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Supported Token Standards</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600 mb-6">
              Allowance Guard supports all major Ethereum token standards:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportedStandards.map((standard) => {
                const Icon = standard.icon
                return (
                  <div key={standard.standard} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{standard.standard}</h3>
                    <p className="text-sm text-gray-600 mb-3">{standard.description}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {standard.status}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Integration Options */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Integration Options</h2>
          <div className="space-y-6">
            {integrationOptions.map((integration) => {
              const Icon = integration.icon
              return (
                <div key={integration.name} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Icon className={`w-6 h-6 ${integration.color} mr-3`} />
                    <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{integration.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {integration.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Performance & Reliability</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Scanning</h3>
              <p className="text-gray-600 text-sm">
                Scan thousands of approvals in seconds with our optimized blockchain queries.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">99.9% Uptime</h3>
              <p className="text-gray-600 text-sm">
                Reliable service with enterprise-grade infrastructure and monitoring.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero Trust</h3>
              <p className="text-gray-600 text-sm">
                No data storage, no private key access, complete privacy protection.
              </p>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ready to Get Started?</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Start Protecting Your Wallet Today</h3>
                <p className="text-blue-800 mb-4">
                  Join thousands of users who trust Allowance Guard to keep their wallets secure. 
                  It&apos;s free, private, and takes just minutes to set up.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Start Scanning
                  </Link>
                  <a 
                    href="/docs" 
                    className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg border border-blue-200 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    View Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Choose Allowance Guard?</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive</h3>
                <p className="text-gray-600 text-sm">
                  Supports all major networks and token standards with advanced risk analysis.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Private</h3>
                <p className="text-gray-600 text-sm">
                  Local processing ensures your data never leaves your browser.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast</h3>
                <p className="text-gray-600 text-sm">
                  Optimized for speed with real-time scanning and instant notifications.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Allowance Guard. All rights reserved.
            </p>
            <div className="mt-4 space-x-6">
              <a href="/terms" className="text-blue-600 hover:text-blue-800 text-sm">Terms of Service</a>
              <a href="/privacy" className="text-blue-600 hover:text-blue-800 text-sm">Privacy Policy</a>
              <a href="/cookies" className="text-blue-600 hover:text-blue-800 text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
