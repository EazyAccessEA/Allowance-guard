'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Users, FileText, Zap, Globe, Database, Key, Clock, Target } from 'lucide-react'

export default function SecurityPage() {
  const { isConnected } = useAccount()

  const securityFeatures = [
    {
      icon: Key,
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
      icon: Database,
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
      icon: Lock,
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
      icon: FileText,
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
      icon: AlertTriangle,
      threat: 'Unlimited Approvals',
      description: 'Approvals that allow any amount to be taken from your wallet',
      risk: 'Critical',
      riskColor: 'bg-red-100 text-red-800 border-red-200',
      protection: 'Immediate identification and revoke recommendations',
      examples: ['ERC-20 approve(address, uint256(-1))', 'ERC-721 setApprovalForAll(address, true)']
    },
    {
      icon: Clock,
      threat: 'Stale Approvals',
      description: 'Old approvals to contracts you no longer use or trust',
      risk: 'High',
      riskColor: 'bg-orange-100 text-orange-800 border-orange-200',
      protection: 'Time-based analysis and cleanup suggestions',
      examples: ['Unused DeFi protocols', 'Abandoned NFT marketplaces', 'Old gaming contracts']
    },
    {
      icon: Target,
      threat: 'Unknown Contracts',
      description: 'Approvals to contracts with no reputation or verification data',
      risk: 'Medium',
      riskColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      protection: 'Contract verification and risk scoring',
      examples: ['Unverified smart contracts', 'New protocols without audits', 'Experimental dApps']
    },
    {
      icon: Zap,
      threat: 'Large Amount Approvals',
      description: 'Approvals for unusually large token amounts relative to your holdings',
      risk: 'Medium',
      riskColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      protection: 'Amount analysis and threshold warnings',
      examples: ['Approvals exceeding 50% of holdings', 'Suspiciously round numbers', 'Amounts larger than typical usage']
    },
    {
      icon: Users,
      threat: 'Phishing & Social Engineering',
      description: 'Malicious contracts disguised as legitimate services',
      risk: 'High',
      riskColor: 'bg-orange-100 text-orange-800 border-orange-200',
      protection: 'Contract verification and community warnings',
      examples: ['Fake airdrop contracts', 'Impersonated protocols', 'Malicious NFT collections']
    },
    {
      icon: Globe,
      threat: 'Cross-Chain Vulnerabilities',
      description: 'Approvals that may be exploited across multiple networks',
      risk: 'Medium',
      riskColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      protection: 'Multi-network monitoring and bridge analysis',
      examples: ['Bridge contract approvals', 'Cross-chain DeFi protocols', 'Multi-network tokens']
    }
  ]

  const bestPractices = [
    {
      icon: Clock,
      practice: 'Regular Scanning',
      description: 'Scan your wallet at least weekly to catch new approvals',
      frequency: 'Weekly',
      tips: [
        'Set up autonomous monitoring for automatic scans',
        'Check after every DeFi interaction',
        'Review approvals before major transactions'
      ]
    },
    {
      icon: AlertTriangle,
      practice: 'Immediate Revocation',
      description: 'Revoke unlimited approvals as soon as you find them',
      frequency: 'Immediate',
      tips: [
        'Use bulk revocation for multiple approvals',
        'Prioritize high-value tokens first',
        'Keep some gas ETH for emergency revocations'
      ]
    },
    {
      icon: Target,
      practice: 'Specific Amounts',
      description: 'Use specific token amounts instead of unlimited approvals',
      frequency: 'Always',
      tips: [
        'Only approve what you need for the transaction',
        'Set reasonable spending limits',
        'Review and adjust limits regularly'
      ]
    },
    {
      icon: Shield,
      practice: 'Contract Verification',
      description: 'Verify contract addresses before approving new dApps',
      frequency: 'Before Approval',
      tips: [
        'Check official project websites',
        'Verify contract addresses on Etherscan',
        'Look for audit reports and community reviews'
      ]
    },
    {
      icon: Users,
      practice: 'Team Security',
      description: 'Use team features for shared wallet management',
      frequency: 'Ongoing',
      tips: [
        'Assign appropriate roles to team members',
        'Regular security reviews with your team',
        'Monitor team wallet activity together'
      ]
    },
    {
      icon: Eye,
      practice: 'Stay Informed',
      description: 'Keep up with security best practices and threats',
      frequency: 'Regularly',
      tips: [
        'Subscribe to security alerts',
        'Follow DeFi security news',
        'Join security-focused communities'
      ]
    }
  ]

  const securityStats = [
    { label: 'DeFi Exploits from Approvals', value: '73%', description: 'In 2024' },
    { label: 'Total Losses', value: '$3.2B', description: 'From approval attacks' },
    { label: 'Average Attack Time', value: '< 1 hour', description: 'To drain unlimited approvals' },
    { label: 'Protected Wallets', value: '10,000+', description: 'Using Allowance Guard' }
  ]

  const emergencySteps = [
    {
      step: 1,
      title: 'Revoke All Approvals',
      description: 'Use Allowance Guard to identify and revoke all token approvals immediately',
      urgency: 'Critical',
      timeEstimate: '5-10 minutes'
    },
    {
      step: 2,
      title: 'Move Funds to New Wallet',
      description: 'Transfer all assets to a freshly created wallet with new private keys',
      urgency: 'Critical',
      timeEstimate: '15-30 minutes'
    },
    {
      step: 3,
      title: 'Change All Passwords',
      description: 'Update passwords for any connected services, exchanges, and accounts',
      urgency: 'High',
      timeEstimate: '30-60 minutes'
    },
    {
      step: 4,
      title: 'Report the Incident',
      description: 'Contact relevant authorities, exchanges, and document the breach',
      urgency: 'High',
      timeEstimate: '1-2 hours'
    },
    {
      step: 5,
      title: 'Monitor for Further Activity',
      description: 'Continue scanning for new suspicious approvals and transactions',
      urgency: 'Medium',
      timeEstimate: 'Ongoing'
    }
  ]

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
          <H1 className="mb-6">Security & Privacy</H1>
          <p className="text-base text-stone max-w-reading mb-8">
            Learn how Allowance Guard protects your wallet and maintains your privacy while keeping you secure.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Security Crisis Stats */}
      <Section className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold text-ink mb-4">
              The DeFi Security Crisis
            </h2>
            <p className="text-base text-stone max-w-3xl mx-auto mb-12">
              Token approvals represent the single largest attack vector in decentralized finance. 
              In 2024, approval-based attacks accounted for 73% of all DeFi exploits, resulting in over $3.2 billion in losses.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {securityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-ink mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-ink mb-1">{stat.label}</div>
                <div className="text-xs text-stone">{stat.description}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Security Features */}
      <Section className="py-20 bg-mist/30">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold text-ink mb-4">
              How We Protect You
            </h2>
            <p className="text-base text-stone max-w-2xl mx-auto">
              Our security-first approach ensures your wallet and data remain completely private and secure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="group">
                  <div className="flex items-start gap-4 p-6 border border-line rounded-lg hover:border-ink/20 transition-colors duration-200 bg-white">
                    <div className="w-12 h-12 bg-mist rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-ink/5 transition-colors duration-200">
                      <IconComponent className="w-6 h-6 text-ink" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-ink mb-2">{feature.title}</h3>
                      <p className="text-base text-stone leading-relaxed mb-4">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-sm text-stone flex items-start">
                            <CheckCircle className="w-4 h-4 text-ink mr-2 mt-0.5 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Threat Protection */}
      <Section className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold text-ink mb-4">
              Threats We Protect Against
            </h2>
            <p className="text-base text-stone max-w-2xl mx-auto">
              Comprehensive protection against the most common and dangerous wallet security threats.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {threatProtection.map((threat, index) => {
              const IconComponent = threat.icon
              return (
                <div key={index} className="group">
                  <div className="p-6 border border-line rounded-lg hover:border-ink/20 transition-colors duration-200 bg-white">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-mist rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-ink/5 transition-colors duration-200">
                        <IconComponent className="w-6 h-6 text-ink" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-ink">{threat.threat}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${threat.riskColor}`}>
                            {threat.risk} Risk
                          </span>
                        </div>
                        <p className="text-base text-stone leading-relaxed mb-3">{threat.description}</p>
                        <p className="text-sm font-medium text-ink mb-3">Protection: {threat.protection}</p>
                        {threat.examples && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-ink mb-2">Examples:</p>
                            <ul className="space-y-1">
                              {threat.examples.map((example, exampleIndex) => (
                                <li key={exampleIndex} className="text-xs text-stone">• {example}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Best Practices */}
      <Section className="py-20 bg-mist/30">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold text-ink mb-4">
              Security Best Practices
            </h2>
            <p className="text-base text-stone max-w-2xl mx-auto">
              Follow these practices to maximize your wallet security and stay protected.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestPractices.map((practice, index) => {
              const IconComponent = practice.icon
              return (
                <div key={index} className="group">
                  <div className="p-6 border border-line rounded-lg hover:border-ink/20 transition-colors duration-200 bg-white">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-mist rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-ink/5 transition-colors duration-200">
                        <IconComponent className="w-6 h-6 text-ink" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-ink">{practice.practice}</h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-mist text-ink">
                            {practice.frequency}
                          </span>
                        </div>
                        <p className="text-base text-stone leading-relaxed mb-3">{practice.description}</p>
                        {practice.tips && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-ink mb-2">Tips:</p>
                            <ul className="space-y-1">
                              {practice.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-xs text-stone">• {tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Privacy & Transparency */}
      <Section className="py-20 bg-mist/30">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold text-ink mb-4">
              Privacy & Transparency
            </h2>
            <p className="text-base text-stone max-w-2xl mx-auto">
              Your privacy is our priority. We believe in complete transparency about how we handle your data.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ink/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-ink" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">Public Data Only</h3>
              <p className="text-base text-stone leading-relaxed">
                We only read public blockchain data that anyone can access. No private information is involved.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ink/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-ink" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">Local Processing</h3>
              <p className="text-base text-stone leading-relaxed">
                All analysis happens in your browser. We don&apos;t send your data to our servers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ink/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-ink" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">Open Source</h3>
              <p className="text-base text-stone leading-relaxed">
                Our code is publicly available for community review and security audits.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Emergency Response */}
      <Section className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold text-ink mb-4">
              If Your Wallet is Compromised
            </h2>
            <p className="text-base text-stone max-w-2xl mx-auto">
              Follow these steps immediately if you suspect your wallet has been compromised.
            </p>
          </div>
          
          <div className="space-y-6">
            {emergencySteps.map((step, index) => (
              <div key={index} className="group">
                <div className="flex items-start gap-6 p-6 border border-line rounded-lg hover:border-ink/20 transition-colors duration-200 bg-white">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-ink text-white rounded-lg flex items-center justify-center text-lg font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        step.urgency === 'Critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                        step.urgency === 'High' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                        'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {step.urgency}
                      </span>
                      <span className="text-xs text-stone">({step.timeEstimate})</span>
                    </div>
                    <p className="text-base text-stone leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Security */}
      <Section className="py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-ink mb-4">
              Security Concerns?
            </h2>
            <p className="text-base text-stone leading-relaxed mb-8">
              If you discover a security vulnerability or have concerns about our security practices, 
              please contact us immediately. We take security seriously and respond to all reports promptly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200 bg-ink text-white hover:bg-ink/90 focus:outline-none focus:ring-2 focus:ring-ink/30"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Report Security Issue
              </a>
              <a 
                href="/privacy" 
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200 bg-white text-ink border border-line hover:bg-mist focus:outline-none focus:ring-2 focus:ring-ink/30"
              >
                <Shield className="w-5 h-5 mr-2" />
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