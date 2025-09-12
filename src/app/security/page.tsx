'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Users, FileText, Zap, Database, Key, Clock, Target, Bell } from 'lucide-react'

export default function SecurityPage() {
  const { isConnected } = useAccount()




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

      {/* Security Features - Fireart Style */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-semibold text-ink leading-tight mb-8">
                How We Protect You
              </h2>
              <p className="text-xl text-stone leading-relaxed">
                Our security-first approach ensures your wallet and data remain completely private and secure.
              </p>
            </div>
            
            <div className="space-y-16">
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-electric/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Key className="w-8 h-8 text-electric" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-ink mb-4">Read-Only Access</h3>
                  <p className="text-lg text-stone leading-relaxed mb-6">
                    We never have access to your private keys or wallet funds, ensuring your assets remain safe.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">No private key access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">No seed phrase storage</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">No transaction signing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">Local browser processing only</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-electric/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Database className="w-8 h-8 text-electric" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-ink mb-4">Local Processing</h3>
                  <p className="text-lg text-stone leading-relaxed mb-6">
                    All analysis happens in your browser, not on our servers, for maximum privacy.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">Blockchain data fetched locally</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">Risk analysis in your browser</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">No data sent to our servers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">Complete privacy protection</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-electric/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-8 h-8 text-electric" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-ink mb-4">Encrypted Storage</h3>
                  <p className="text-lg text-stone leading-relaxed mb-6">
                    Any minimal data we store is encrypted using industry standards.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">AES-256 encryption</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">Secure data transmission</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">Minimal data retention</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">Regular security audits</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-electric/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-8 h-8 text-electric" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-ink mb-4">Open Source & Auditable</h3>
                  <p className="text-lg text-stone leading-relaxed mb-6">
                    Our code is publicly available for community review, fostering transparency and trust.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">Public GitHub repository</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">Community code reviews</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">Transparent development</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-electric flex-shrink-0" />
                      <span className="text-stone">Regular security updates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Threat Protection - Fireart Style */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-semibold text-ink leading-tight mb-8">
                Threats We Protect Against
              </h2>
              <p className="text-xl text-stone leading-relaxed">
                Comprehensive protection against the most common and dangerous wallet security threats.
              </p>
            </div>
            
            <div className="space-y-12">
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-electric/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-8 h-8 text-electric" />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-semibold text-ink">Unlimited Approvals</h3>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                      Critical Risk
                    </span>
                  </div>
                  <p className="text-lg text-stone leading-relaxed mb-4">
                    Approvals that allow any amount to be taken from your wallet, posing the highest security risk.
                  </p>
                  <p className="text-base font-medium text-ink mb-4">
                    <strong>Protection:</strong> Immediate identification and revoke recommendations
                  </p>
                  <div className="bg-mist/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-ink mb-2">Examples:</p>
                    <ul className="space-y-1 text-sm text-stone">
                      <li>• ERC-20 approve(address, uint256(-1))</li>
                      <li>• ERC-721 setApprovalForAll(address, true)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-electric/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-8 h-8 text-electric" />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-semibold text-ink">Stale Approvals</h3>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200">
                      High Risk
                    </span>
                  </div>
                  <p className="text-lg text-stone leading-relaxed mb-4">
                    Old approvals to contracts you no longer use or trust, increasing your attack surface.
                  </p>
                  <p className="text-base font-medium text-ink mb-4">
                    <strong>Protection:</strong> Time-based analysis and cleanup suggestions
                  </p>
                  <div className="bg-mist/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-ink mb-2">Examples:</p>
                    <ul className="space-y-1 text-sm text-stone">
                      <li>• Unused DeFi protocols</li>
                      <li>• Abandoned NFT marketplaces</li>
                      <li>• Old gaming contracts</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-electric/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-8 h-8 text-electric" />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-semibold text-ink">Unknown Contracts</h3>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                      Medium Risk
                    </span>
                  </div>
                  <p className="text-lg text-stone leading-relaxed mb-4">
                    Approvals to contracts with no reputation or verification data, making risk assessment difficult.
                  </p>
                  <p className="text-base font-medium text-ink mb-4">
                    <strong>Protection:</strong> Contract verification and risk scoring
                  </p>
                  <div className="bg-mist/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-ink mb-2">Examples:</p>
                    <ul className="space-y-1 text-sm text-stone">
                      <li>• Unverified smart contracts</li>
                      <li>• New protocols without audits</li>
                      <li>• Experimental dApps</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-electric/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-8 h-8 text-electric" />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-semibold text-ink">Large Amount Approvals</h3>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                      Medium Risk
                    </span>
                  </div>
                  <p className="text-lg text-stone leading-relaxed mb-4">
                    Approvals for unusually large token amounts relative to your holdings, potentially risky.
                  </p>
                  <p className="text-base font-medium text-ink mb-4">
                    <strong>Protection:</strong> Amount analysis and threshold warnings
                  </p>
                  <div className="bg-mist/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-ink mb-2">Examples:</p>
                    <ul className="space-y-1 text-sm text-stone">
                      <li>• Approvals exceeding 50% of holdings</li>
                      <li>• Suspiciously round numbers</li>
                      <li>• Amounts larger than typical usage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Best Practices - Fireart Style */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-semibold text-ink leading-tight mb-8">
                Security Best Practices
              </h2>
              <p className="text-xl text-stone leading-relaxed">
                Follow these practices to maximize your wallet security and stay protected.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-ink">Regular Scanning</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-electric/10 text-electric">
                        Weekly
                      </span>
                    </div>
                    <p className="text-stone leading-relaxed">
                      Scan your wallet at least weekly to catch new approvals and monitor existing ones.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-ink">Immediate Revocation</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-electric/10 text-electric">
                        Immediate
                      </span>
                    </div>
                    <p className="text-stone leading-relaxed">
                      Revoke unlimited or high-risk approvals as soon as you identify them.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-ink">Specific Amounts</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-electric/10 text-electric">
                        Always
                      </span>
                    </div>
                    <p className="text-stone leading-relaxed">
                      Always use specific token amounts for approvals instead of granting unlimited access.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-ink">Contract Verification</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-electric/10 text-electric">
                        Before Approval
                      </span>
                    </div>
                    <p className="text-stone leading-relaxed">
                      Verify contract addresses and understand their purpose before approving new dApps.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-ink">Enable Monitoring</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-electric/10 text-electric">
                        Recommended
                      </span>
                    </div>
                    <p className="text-stone leading-relaxed">
                      Set up email or Slack alerts to be notified of new approvals immediately.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-electric" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-ink">Team Collaboration</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-electric/10 text-electric">
                        For Teams
                      </span>
                    </div>
                    <p className="text-stone leading-relaxed">
                      Use team features to share wallet monitoring responsibilities and maintain security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
              <div className="w-16 h-16 bg-electric/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-electric" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">Public Data Only</h3>
              <p className="text-base text-stone leading-relaxed">
                We only read public blockchain data that anyone can access. No private information is involved.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-electric/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-electric" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">Local Processing</h3>
              <p className="text-base text-stone leading-relaxed">
                All analysis happens in your browser. We don&apos;t send your data to our servers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-electric/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-electric" />
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