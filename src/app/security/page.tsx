import Image from 'next/image'
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, XCircle, Zap, Users } from 'lucide-react'

export default function SecurityPage() {
  const securityFeatures = [
    {
      title: 'Read-Only Access',
      description: 'We never have access to your private keys or wallet funds',
      icon: Lock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      details: [
        'No private key access',
        'No seed phrase storage',
        'No transaction signing',
        'Local browser processing only'
      ]
    },
    {
      title: 'Local Processing',
      description: 'All analysis happens in your browser, not on our servers',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      details: [
        'Blockchain data fetched locally',
        'Risk analysis in your browser',
        'No data sent to our servers',
        'Complete privacy protection'
      ]
    },
    {
      title: 'Encrypted Storage',
      description: 'Any data we store is encrypted using industry standards',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      details: [
        'AES-256 encryption',
        'Secure data transmission',
        'Minimal data retention',
        'Regular security audits'
      ]
    },
    {
      title: 'Open Source',
      description: 'Our code is open source and auditable by the community',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      details: [
        'Public GitHub repository',
        'Community code reviews',
        'Transparent development',
        'Regular security updates'
      ]
    }
  ]

  const threatProtection = [
    {
      threat: 'Unlimited Approvals',
      description: 'Approvals that allow any amount to be taken',
      risk: 'Critical',
      protection: 'Immediate identification and revoke recommendations',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      threat: 'Stale Approvals',
      description: 'Old approvals to contracts you no longer use',
      risk: 'High',
      protection: 'Time-based analysis and cleanup suggestions',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      threat: 'Unknown Contracts',
      description: 'Approvals to contracts with no reputation data',
      risk: 'Medium',
      protection: 'Contract verification and risk scoring',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      threat: 'Large Amount Approvals',
      description: 'Approvals for unusually large token amounts',
      risk: 'Medium',
      protection: 'Amount analysis and threshold warnings',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  const bestPractices = [
    {
      practice: 'Regular Scanning',
      description: 'Scan your wallet at least weekly to catch new approvals',
      frequency: 'Weekly',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      practice: 'Immediate Revocation',
      description: 'Revoke unlimited approvals as soon as you find them',
      frequency: 'Immediate',
      icon: XCircle,
      color: 'text-red-600'
    },
    {
      practice: 'Specific Amounts',
      description: 'Use specific token amounts instead of unlimited approvals',
      frequency: 'Always',
      icon: Shield,
      color: 'text-blue-600'
    },
    {
      practice: 'Contract Verification',
      description: 'Verify contract addresses before approving new dApps',
      frequency: 'Before Approval',
      icon: Eye,
      color: 'text-purple-600'
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
            <Shield className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Security & Privacy</h1>
          </div>
          <p className="text-gray-600">
            Learn how Allowance Guard protects your wallet and maintains your privacy while keeping you secure.
          </p>
        </div>

        {/* Security Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How We Protect You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature) => {
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

        {/* Threat Protection */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Threats We Protect Against</h2>
          <div className="space-y-4">
            {threatProtection.map((threat) => {
              const Icon = threat.icon
              return (
                <div key={threat.threat} className={`${threat.bgColor} border border-gray-200 rounded-lg p-6`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <Icon className={`w-6 h-6 ${threat.color} mr-4 mt-1`} />
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">{threat.threat}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            threat.risk === 'Critical' ? 'bg-red-100 text-red-800' :
                            threat.risk === 'High' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {threat.risk} Risk
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{threat.description}</p>
                        <p className="text-sm font-medium text-gray-700">Protection: {threat.protection}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Best Practices</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600 mb-6">
              Follow these practices to maximize your wallet security:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bestPractices.map((practice) => {
                const Icon = practice.icon
                return (
                  <div key={practice.practice} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Icon className={`w-5 h-5 ${practice.color} mr-3`} />
                      <h3 className="text-lg font-semibold text-gray-900">{practice.practice}</h3>
                    </div>
                    <p className="text-gray-600 mb-2">{practice.description}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {practice.frequency}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Privacy is Protected</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <Lock className="w-6 h-6 text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-3">What We Don&apos;t Collect</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• <strong>Private Keys:</strong> We never have access to your private keys or seed phrases</li>
                  <li>• <strong>Transaction Data:</strong> We don&apos;t store your transaction history</li>
                  <li>• <strong>Personal Information:</strong> No names, addresses, or personal details</li>
                  <li>• <strong>Wallet Funds:</strong> We cannot and will never access your funds</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Data Handling */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How We Handle Your Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Public Data Only</h3>
              <p className="text-gray-600 text-sm">
                We only read public blockchain data that anyone can access. No private information is involved.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Processing</h3>
              <p className="text-gray-600 text-sm">
                All analysis happens in your browser. We don&apos;t send your data to our servers.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Minimal Storage</h3>
              <p className="text-gray-600 text-sm">
                We only store your email address (if you subscribe) and nothing else.
              </p>
            </div>
          </div>
        </section>

        {/* Security Audit */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Audits & Transparency</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-3">Our Commitment to Security</h3>
                <ul className="space-y-2 text-green-800">
                  <li>• <strong>Open Source:</strong> Our code is publicly available for community review</li>
                  <li>• <strong>Regular Audits:</strong> We conduct regular security assessments</li>
                  <li>• <strong>Community Feedback:</strong> We welcome security reports and improvements</li>
                  <li>• <strong>Transparent Updates:</strong> All security updates are documented and communicated</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Response */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">If Your Wallet is Compromised</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-3">Immediate Action Required</h3>
                <ol className="space-y-2 text-red-800 list-decimal list-inside">
                  <li><strong>Revoke all approvals immediately</strong> - Use Allowance Guard to identify and revoke all token approvals</li>
                  <li><strong>Move funds to a new wallet</strong> - Transfer all assets to a freshly created wallet</li>
                  <li><strong>Change all passwords</strong> - Update passwords for any connected services</li>
                  <li><strong>Report the incident</strong> - Contact relevant authorities and document the breach</li>
                  <li><strong>Monitor for further activity</strong> - Continue scanning for new suspicious approvals</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Concerns?</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              If you discover a security vulnerability or have concerns about our security practices, please contact us immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/contact" 
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Security Issue
              </a>
              <a 
                href="/privacy" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </a>
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
