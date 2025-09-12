'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'
import { useState } from 'react'
import { 
  FileText, 
  Rocket, 
  Globe, 
  AlertTriangle, 
  Mail, 
  Lock, 
  Settings, 
  Wrench, 
  HelpCircle,
  Search,
  Shield,
  Bell,
  Zap
} from 'lucide-react'

export default function DocsPage() {
  const { isConnected } = useAccount()
  const [activeSection, setActiveSection] = useState('overview')

  const menuItems = [
    { id: 'overview', title: 'Overview', icon: FileText },
    { id: 'getting-started', title: 'Getting Started', icon: Rocket },
    { id: 'networks', title: 'Supported Networks', icon: Globe },
    { id: 'risk-scoring', title: 'Risk Scoring', icon: AlertTriangle },
    { id: 'alerts', title: 'Alerts & Notifications', icon: Mail },
    { id: 'revoking', title: 'Revoking Approvals', icon: Lock },
    { id: 'api', title: 'Settings & API', icon: Settings },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: Wrench },
    { id: 'faq', title: 'FAQ', icon: HelpCircle }
  ]

  const supportedNetworks = [
    { name: "Ethereum", chainId: 1, status: "Full Support" },
    { name: "Arbitrum", chainId: 42161, status: "Full Support" },
    { name: "Base", chainId: 8453, status: "Full Support" }
  ]

  const riskFactors = [
    { factor: "Unlimited Approvals", score: "+50", description: "Contract can spend any amount" },
    { factor: "Stale Approvals", score: "+10", description: "Unused for extended periods" },
    { factor: "High Value", score: "Variable", description: "Significant financial exposure" },
    { factor: "Unknown Spenders", score: "Variable", description: "Unverified contracts" }
  ]

  const alertFeatures = [
    { type: "Email Alerts", description: "Daily digests via Microsoft SMTP", features: ["Risk-only filtering", "HTML templates", "Customizable preferences"] },
    { type: "Slack Integration", description: "Real-time webhook notifications", features: ["Team collaboration", "Custom webhooks", "Rich formatting"] },
    { type: "Job Processing", description: "Automated background scanning", features: ["5-minute intervals", "Queue management", "Status tracking"] }
  ]

  const apiEndpoints = [
    { endpoint: "/api/scan", method: "POST", description: "Queue wallet scan job" },
    { endpoint: "/api/allowances", method: "GET", description: "Get paginated allowances" },
    { endpoint: "/api/jobs/[id]", method: "GET", description: "Check job status" },
    { endpoint: "/api/alerts/subscribe", method: "POST", description: "Subscribe to alerts" },
    { endpoint: "/api/alerts/daily", method: "GET", description: "Trigger daily digest" },
    { endpoint: "/api/jobs/process", method: "GET", description: "Process queued jobs" }
  ]

  const faqItems = [
    {
      question: "How does AllowanceGuard work?",
      answer: "AllowanceGuard scans your wallet across Ethereum, Arbitrum, and Base networks using direct RPC calls. It identifies ERC-20 and ERC-721 approvals, calculates risk scores, and provides one-click revocation through your connected wallet."
    },
    {
      question: "What makes an approval risky?",
      answer: "Unlimited approvals (+50 points) and stale approvals (+10 points) are the main risk factors. The system also considers token value and spender reputation to provide comprehensive risk assessment."
    },
    {
      question: "How do I revoke approvals?",
      answer: "Click the 'Revoke' button next to any approval in your dashboard. This will construct a transaction to set the allowance to zero, which you'll need to sign and pay gas for."
    },
    {
      question: "Are my private keys safe?",
      answer: "Yes. AllowanceGuard never sees your private keys. All transactions are signed locally by your wallet, and we only read public blockchain data."
    },
    {
      question: "How often should I check my approvals?",
      answer: "We recommend setting up email alerts for daily monitoring. The system can automatically notify you of new risky approvals as they're detected."
    },
    {
      question: "What if a scan fails?",
      answer: "Scans are processed in the background using a job queue system. If a scan fails, you'll see an error message and can retry. The system automatically retries failed jobs."
    }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
  return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-ink mb-4">What is AllowanceGuard?</h2>
              <p className="text-base text-stone mb-6">
                AllowanceGuard is a free and open source security platform that helps you discover, understand, and control every token approval associated with your wallets. It scans across multiple blockchain networks to identify risky permissions and provides tools to revoke them safely.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-mist border border-line rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-ink" />
                    <h4 className="font-medium text-ink">Real-time Monitoring</h4>
                  </div>
                  <p className="text-sm text-stone">Track token approvals across Ethereum, Arbitrum, and Base</p>
                </div>
                <div className="p-4 bg-mist border border-line rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-ink" />
                    <h4 className="font-medium text-ink">Risk Assessment</h4>
                  </div>
                  <p className="text-sm text-stone">Advanced algorithms identify unlimited and stale approvals</p>
                </div>
                <div className="p-4 bg-mist border border-line rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-ink" />
                    <h4 className="font-medium text-ink">Email Alerts</h4>
                  </div>
                  <p className="text-sm text-stone">Get notified about risky approvals via Microsoft SMTP</p>
                </div>
                <div className="p-4 bg-mist border border-line rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-ink" />
                    <h4 className="font-medium text-ink">One-Click Revoke</h4>
                  </div>
                  <p className="text-sm text-stone">Instantly revoke risky approvals with gas optimization</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-ink mb-4">Quick Start Guide</h2>
          <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-ink text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">1</div>
                  <div>
                    <h4 className="font-medium text-ink mb-1">Connect Your Wallet</h4>
                    <p className="text-sm text-stone">Click &quot;Connect Wallet&quot; and select your preferred wallet provider (MetaMask, WalletConnect, etc.)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-ink text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">2</div>
                  <div>
                    <h4 className="font-medium text-ink mb-1">Scan for Approvals</h4>
                    <p className="text-sm text-stone">Click &quot;Scan wallet&quot; to discover all your token approvals across supported networks</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-ink text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">3</div>
                  <div>
                    <h4 className="font-medium text-ink mb-1">Review Results</h4>
                    <p className="text-sm text-stone">Examine your approvals, paying special attention to unlimited approvals and high-risk spenders</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-ink text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">4</div>
                  <div>
                    <h4 className="font-medium text-ink mb-1">Revoke Risky Approvals</h4>
                    <p className="text-sm text-stone">Use the &quot;Revoke&quot; button to set risky allowances to zero</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-ink text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">5</div>
                  <div>
                    <h4 className="font-medium text-ink mb-1">Set Up Alerts</h4>
                    <p className="text-sm text-stone">Configure email or Slack alerts to monitor for new risky approvals</p>
               </div>
            </div>
          </div>
        </div>
          </div>
        )

      case 'networks':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-ink mb-4">Supported Networks</h2>
            <p className="text-base text-stone mb-6">
                AllowanceGuard currently supports the following blockchain networks:
            </p>
            <div className="space-y-4">
              {supportedNetworks.map((network) => (
                  <div key={network.chainId} className="flex items-center justify-between p-4 bg-mist border border-line rounded-md">
              <div>
                      <h4 className="font-medium text-ink">{network.name}</h4>
                    <p className="text-sm text-stone">Chain ID: {network.chainId}</p>
              </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-line text-ink">
                    {network.status}
                  </span>
            </div>
              ))}
            </div>
          </div>
          </div>
        )

      case 'risk-scoring':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-ink mb-4">Risk Scoring System</h2>
              <p className="text-base text-stone mb-6">
                AllowanceGuard uses a comprehensive risk scoring system to help you prioritize which approvals need immediate attention:
              </p>
          <div className="space-y-4">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-mist border border-line rounded-md">
                  <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                      {factor.score}
        </div>
                    <div>
                      <h4 className="font-medium text-ink mb-1">{factor.factor}</h4>
                      <p className="text-sm text-stone">{factor.description}</p>
      </div>
      </div>
            ))}
          </div>
            </div>
          </div>
        )

      case 'alerts':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-ink mb-4">Alerts & Notifications</h2>
              <p className="text-base text-stone mb-6">
                Stay informed about your wallet security with automated alerts:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {alertFeatures.map((alert, index) => (
                  <div key={index} className="border border-line rounded-md p-4 bg-mist">
                    <h4 className="font-medium text-ink mb-2">{alert.type}</h4>
                    <p className="text-sm text-stone mb-3">{alert.description}</p>
                    <ul className="space-y-1 text-sm text-stone">
                      {alert.features.map((feature, fIndex) => (
                        <li key={fIndex}>• {feature}</li>
                      ))}
                    </ul>
          </div>
                ))}
        </div>
    </div>
          </div>
        )

      case 'revoking':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-ink mb-4">How to Revoke Approvals</h2>
              <p className="text-base text-stone mb-6">
                Revoking an approval means setting the allowance to zero, preventing the spender from accessing your tokens:
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-mist border border-line rounded-md">
                  <h4 className="font-medium text-ink mb-2">Using AllowanceGuard</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-stone">
                    <li>Connect your wallet and scan for approvals</li>
                    <li>Find the approval you want to revoke</li>
                    <li>Click the &quot;Revoke&quot; button</li>
                    <li>Sign the transaction in your wallet</li>
                    <li>Pay the gas fee to complete the revocation</li>
                  </ol>
                </div>
                <div className="p-4 bg-mist border border-line rounded-md">
                  <h4 className="font-medium text-ink mb-2">Important Notes</h4>
                  <ul className="space-y-1 text-sm text-stone">
                    <li>• Each revocation requires a separate transaction and gas fee</li>
                    <li>• Revoking doesn&apos;t affect already deposited or staked tokens</li>
                    <li>• Some dApps may require you to re-approve for continued functionality</li>
                    <li>• Revocation is preventative, not restorative for already stolen funds</li>
              </ul>
    </div>
      </div>
            </div>
          </div>
        )

      case 'api':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-ink mb-4">Settings & Configuration</h2>
              <p className="text-base text-stone mb-6">
                AllowanceGuard provides comprehensive settings to customize your security monitoring experience:
              </p>
              
              <div className="space-y-6">
                {/* Email Alerts */}
                <div className="border border-line rounded-md p-6 bg-mist">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-ink" />
                    <h3 className="text-lg font-semibold text-ink">Email Alerts</h3>
                  </div>
                  <p className="text-sm text-stone mb-4">
                    Get notified when new approvals are detected on your wallets via Microsoft SMTP.
                  </p>
                  <ul className="space-y-2 text-sm text-stone">
                    <li>• Daily digest emails with risky approval summaries</li>
                    <li>• Risk-only filtering to reduce notification noise</li>
                    <li>• HTML templates with professional formatting</li>
                    <li>• Customizable preferences per wallet address</li>
                  </ul>
                </div>

                {/* Risk Policy */}
                <div className="border border-line rounded-md p-6 bg-mist">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-ink" />
                    <h3 className="text-lg font-semibold text-ink">Risk Policy Configuration</h3>
                  </div>
                  <p className="text-sm text-stone mb-4">
                    Configure what counts as alert-worthy for your specific needs.
                  </p>
                  <ul className="space-y-2 text-sm text-stone">
                    <li>• Set minimum risk score thresholds</li>
                    <li>• Focus on unlimited approvals only</li>
                    <li>• Include/exclude specific spender addresses</li>
                    <li>• Filter by token addresses</li>
                    <li>• Chain-specific policies</li>
                  </ul>
                </div>

                {/* Slack Integration */}
                <div className="border border-line rounded-md p-6 bg-mist">
                  <div className="flex items-center gap-3 mb-3">
                    <Bell className="w-5 h-5 text-ink" />
                    <h3 className="text-lg font-semibold text-ink">Slack Integration</h3>
                  </div>
                  <p className="text-sm text-stone mb-4">
                    Get daily digests directly in your Slack workspace.
                  </p>
                  <ul className="space-y-2 text-sm text-stone">
                    <li>• Webhook-based notifications</li>
                    <li>• Rich formatting with approval details</li>
                    <li>• Team collaboration features</li>
                    <li>• Custom channel routing</li>
                  </ul>
                </div>

                {/* Public Sharing */}
                <div className="border border-line rounded-md p-6 bg-mist">
                  <div className="flex items-center gap-3 mb-3">
                    <Settings className="w-5 h-5 text-ink" />
                    <h3 className="text-lg font-semibold text-ink">Public Share Links</h3>
                  </div>
                  <p className="text-sm text-stone mb-4">
                    Generate read-only links to share your wallet&apos;s approval status.
                  </p>
                  <ul className="space-y-2 text-sm text-stone">
                    <li>• Privacy controls (censor addresses/amounts)</li>
                    <li>• Risk-only filtering for public sharing</li>
                    <li>• Expiration dates for temporary access</li>
                    <li>• One-click link generation and rotation</li>
                  </ul>
                </div>

                {/* API Reference */}
                <div className="border border-line rounded-md p-6 bg-mist">
                  <div className="flex items-center gap-3 mb-3">
                    <Settings className="w-5 h-5 text-ink" />
                    <h3 className="text-lg font-semibold text-ink">API Endpoints</h3>
                  </div>
                  <p className="text-sm text-stone mb-4">
                    Programmatic access to AllowanceGuard functionality:
                  </p>
                  <div className="space-y-2">
                    {apiEndpoints.map((endpoint, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-ink text-white">
                          {endpoint.method}
                        </span>
                        <code className="font-mono text-ink">{endpoint.endpoint}</code>
                        <span className="text-stone">{endpoint.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'troubleshooting':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-ink mb-4">Common Issues & Solutions</h2>
          <div className="space-y-4">
                <div className="border border-line rounded-md p-4 bg-mist">
                  <h4 className="font-medium text-ink mb-2">Scan shows no results</h4>
                  <ul className="space-y-1 text-sm text-stone">
                    <li>• Ensure you're connected to a supported network</li>
                    <li>• Check that your wallet is unlocked and connected</li>
                    <li>• Try refreshing the page and reconnecting your wallet</li>
                  </ul>
                </div>
                <div className="border border-line rounded-md p-4 bg-mist">
                  <h4 className="font-medium text-ink mb-2">Revoke transaction fails</h4>
                  <ul className="space-y-1 text-sm text-stone">
                    <li>• Ensure you have sufficient gas tokens for the network</li>
                    <li>• Check that the approval hasn&apos;t already been revoked</li>
                    <li>• Some contracts may require specific revocation methods</li>
                  </ul>
                </div>
                <div className="border border-line rounded-md p-4 bg-mist">
                  <h4 className="font-medium text-ink mb-2">Alerts not working</h4>
                  <ul className="space-y-1 text-sm text-stone">
                    <li>• Verify your email address is correct</li>
                    <li>• Check your spam folder for alert emails</li>
                    <li>• Ensure your Slack webhook URL is valid</li>
            </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 'faq':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-ink mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border border-line rounded-md p-4 bg-mist">
                    <h4 className="font-medium text-ink mb-2">Q: {item.question}</h4>
                    <p className="text-sm text-stone">A: {item.answer}</p>
          </div>
            ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getCurrentPageHeadings = () => {
    switch (activeSection) {
      case 'overview':
        return ['What is AllowanceGuard?']
      case 'getting-started':
        return ['Quick Start Guide']
      case 'networks':
        return ['Supported Networks']
      case 'risk-scoring':
        return ['Risk Scoring System']
      case 'alerts':
        return ['Alerts & Notifications']
      case 'revoking':
        return ['How to Revoke Approvals']
      case 'api':
        return ['Settings & Configuration']
      case 'troubleshooting':
        return ['Common Issues & Solutions']
      case 'faq':
        return ['Frequently Asked Questions']
      default:
        return []
    }
  }

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
          <H1 className="mb-6">Documentation</H1>
          <p className="text-base text-stone max-w-reading mb-8">
            Complete guide to using AllowanceGuard for wallet security. Free, open source, and transparent.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Main Content */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="sticky top-8">
                <nav className="space-y-1">
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-ink uppercase tracking-wide mb-3">Documentation</h3>
                    {menuItems.map((item) => {
                      const IconComponent = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 text-sm flex items-center ${
                            activeSection === item.id
                              ? 'bg-ink text-white'
                              : 'text-stone hover:text-ink hover:bg-mist'
                          }`}
                        >
                          <IconComponent className="w-4 h-4 mr-2" />
                          {item.title}
                        </button>
                      )
                    })}
          </div>
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-6">
              <div className="prose prose-sm max-w-none">
                {renderContent()}
              </div>
            </div>

            {/* Right Sidebar - On This Page */}
            <div className="lg:col-span-3">
              <div className="sticky top-8">
                <div className="border border-line rounded-md p-4 bg-mist">
                  <h4 className="text-sm font-semibold text-ink mb-3">On this page</h4>
                  <nav className="space-y-2">
                    {getCurrentPageHeadings().map((heading, index) => (
                      <a
                        key={index}
                        href={`#${heading.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block text-sm text-stone hover:text-ink transition-colors duration-200"
                      >
                        {heading}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
      </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}