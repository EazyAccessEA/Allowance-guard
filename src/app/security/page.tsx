'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'
import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from 'lucide-react'

export default function SecurityPage() {
  const { isConnected } = useAccount()

  const securityFeatures = [
    {
      title: 'Read-Only Access',
      description: 'We never have access to your private keys or wallet funds',
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
      protection: 'Immediate identification and revoke recommendations'
    },
    {
      threat: 'Stale Approvals',
      description: 'Old approvals to contracts you no longer use',
      risk: 'High',
      protection: 'Time-based analysis and cleanup suggestions'
    },
    {
      threat: 'Unknown Contracts',
      description: 'Approvals to contracts with no reputation data',
      risk: 'Medium',
      protection: 'Contract verification and risk scoring'
    },
    {
      threat: 'Large Amount Approvals',
      description: 'Approvals for unusually large token amounts',
      risk: 'Medium',
      protection: 'Amount analysis and threshold warnings'
    }
  ]

  const bestPractices = [
    {
      practice: 'Regular Scanning',
      description: 'Scan your wallet at least weekly to catch new approvals',
      frequency: 'Weekly'
    },
    {
      practice: 'Immediate Revocation',
      description: 'Revoke unlimited approvals as soon as you find them',
      frequency: 'Immediate'
    },
    {
      practice: 'Specific Amounts',
      description: 'Use specific token amounts instead of unlimited approvals',
      frequency: 'Always'
    },
    {
      practice: 'Contract Verification',
      description: 'Verify contract addresses before approving new dApps',
      frequency: 'Before Approval'
    }
  ]

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
      {/* Hero Section - Fireart Style with Animated Background */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Video Background */}
        <VideoBackground 
          videoSrc="/V3AG.mp4"
        />
        {/* Gradient overlay for better text readability - 10% left, 45% right */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.3) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Security & Privacy</H1>
          <p className="text-base text-stone max-w-reading mb-6">
            Learn how Allowance Guard protects your wallet and maintains your privacy while keeping you secure.
          </p>
          <div className="border border-line rounded-md p-6 bg-mist">
            <h2 className="text-lg text-ink mb-2">The DeFi Security Crisis</h2>
            <p className="text-base text-stone">
              Token approvals represent the single largest attack vector in decentralized finance. In 2024, 
              approval-based attacks accounted for 73% of all DeFi exploits, resulting in over $3.2 billion in losses. 
              The average attack targets users with unlimited approvals, allowing malicious contracts to drain entire 
              token balances in a single transaction.
            </p>
          </div>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Security Features */}
      <Section>
        <Container>
          <H2 className="mb-6">How We Protect You</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature) => (
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

      {/* Threat Protection */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Threats We Protect Against</H2>
          <div className="space-y-4">
            {threatProtection.map((threat) => (
              <div key={threat.threat} className="border border-line rounded-md p-6 bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg text-ink mr-3">{threat.threat}</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-line text-ink">
                        {threat.risk} Risk
                      </span>
                    </div>
                    <p className="text-base text-stone mb-2">{threat.description}</p>
                    <p className="text-base font-medium text-ink">Protection: {threat.protection}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Best Practices */}
      <Section>
        <Container>
          <H2 className="mb-6">Security Best Practices</H2>
          <div className="border border-line rounded-md p-6 bg-mist">
            <p className="text-base text-stone mb-6">
              Follow these practices to maximize your wallet security:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bestPractices.map((practice) => (
                <div key={practice.practice} className="border border-line rounded-md p-4 bg-white">
                  <h3 className="text-lg text-ink mb-3">{practice.practice}</h3>
                  <p className="text-base text-stone mb-2">{practice.description}</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-line text-ink">
                    {practice.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Privacy Policy */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Your Privacy is Protected</H2>
          <div className="border border-line rounded-md p-6 bg-white">
            <h3 className="text-lg text-ink mb-3">What We Don&apos;t Collect</h3>
            <ul className="space-y-2 text-base text-stone">
              <li>• <strong>Private Keys:</strong> We never have access to your private keys or seed phrases</li>
              <li>• <strong>Transaction Data:</strong> We don&apos;t store your transaction history</li>
              <li>• <strong>Personal Information:</strong> No names, addresses, or personal details</li>
              <li>• <strong>Wallet Funds:</strong> We cannot and will never access your funds</li>
            </ul>
          </div>
        </Container>
      </Section>

      {/* Data Handling */}
      <Section>
        <Container>
          <H2 className="mb-6">How We Handle Your Data</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-line rounded-md p-6 text-center">
              <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg text-ink mb-2">Public Data Only</h3>
              <p className="text-base text-stone">
                We only read public blockchain data that anyone can access. No private information is involved.
              </p>
            </div>
            
            <div className="border border-line rounded-md p-6 text-center">
              <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg text-ink mb-2">Local Processing</h3>
              <p className="text-base text-stone">
                All analysis happens in your browser. We don&apos;t send your data to our servers.
              </p>
            </div>
            
            <div className="border border-line rounded-md p-6 text-center">
              <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg text-ink mb-2">Minimal Storage</h3>
              <p className="text-base text-stone">
                We only store your email address (if you subscribe) and nothing else.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Security Audit */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Security Audits & Transparency</H2>
          <div className="border border-line rounded-md p-6 bg-white">
            <h3 className="text-lg text-ink mb-3">Our Commitment to Security</h3>
            <ul className="space-y-2 text-base text-stone">
              <li>• <strong>Open Source:</strong> Our code is publicly available for community review</li>
              <li>• <strong>Regular Audits:</strong> We conduct regular security assessments</li>
              <li>• <strong>Community Feedback:</strong> We welcome security reports and improvements</li>
              <li>• <strong>Transparent Updates:</strong> All security updates are documented and communicated</li>
            </ul>
          </div>
        </Container>
      </Section>

      {/* Emergency Response */}
      <Section>
        <Container>
          <H2 className="mb-6">If Your Wallet is Compromised</H2>
          <div className="border border-line rounded-md p-6 bg-mist">
            <h3 className="text-lg text-ink mb-3">Immediate Action Required</h3>
            <ol className="space-y-2 text-base text-stone list-decimal list-inside">
              <li><strong>Revoke all approvals immediately</strong> - Use Allowance Guard to identify and revoke all token approvals</li>
              <li><strong>Move funds to a new wallet</strong> - Transfer all assets to a freshly created wallet</li>
              <li><strong>Change all passwords</strong> - Update passwords for any connected services</li>
              <li><strong>Report the incident</strong> - Contact relevant authorities and document the breach</li>
              <li><strong>Monitor for further activity</strong> - Continue scanning for new suspicious approvals</li>
            </ol>
          </div>
        </Container>
      </Section>

      {/* Contact Security */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Security Concerns?</H2>
          <div className="border border-line rounded-md p-6 bg-white">
            <p className="text-base text-stone mb-6">
              If you discover a security vulnerability or have concerns about our security practices, please contact us immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 bg-ink text-white font-medium rounded-md hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-ink/30"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Security Issue
              </a>
              <a 
                href="/privacy" 
                className="inline-flex items-center px-6 py-3 bg-white text-ink font-medium rounded-md border border-line hover:bg-mist transition focus:outline-none focus:ring-2 focus:ring-ink/30"
              >
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}