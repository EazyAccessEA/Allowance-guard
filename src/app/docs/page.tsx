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
  Zap,
  Users
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
    { id: 'monitoring', title: 'Autonomous Monitoring', icon: Bell },
    { id: 'teams', title: 'Teams & Collaboration', icon: Users },
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
    { type: "Autonomous Monitoring", description: "Scheduled wallet rescans with drift detection", features: ["Configurable frequency", "Instant drift alerts", "Duplicate prevention"] },
    { type: "Job Processing", description: "Automated background scanning", features: ["5-minute intervals", "Queue management", "Status tracking"] }
  ]

  const apiEndpoints = [
    { endpoint: "/api/scan", method: "POST", description: "Queue wallet scan job" },
    { endpoint: "/api/allowances", method: "GET", description: "Get paginated allowances" },
    { endpoint: "/api/jobs/[id]", method: "GET", description: "Check job status" },
    { endpoint: "/api/alerts/subscribe", method: "POST", description: "Subscribe to alerts" },
    { endpoint: "/api/alerts/daily", method: "GET", description: "Trigger daily digest" },
    { endpoint: "/api/jobs/process", method: "GET", description: "Process queued jobs" },
    { endpoint: "/api/monitor", method: "GET/POST", description: "Manage wallet monitoring settings" },
    { endpoint: "/api/monitor/run", method: "GET", description: "Trigger due monitor scans" },
    { endpoint: "/api/auth/magic/request", method: "POST", description: "Request magic link for sign in" },
    { endpoint: "/api/auth/magic/verify", method: "GET", description: "Verify magic link and create session" },
    { endpoint: "/api/auth/me", method: "GET", description: "Get current user information" },
    { endpoint: "/api/auth/signout", method: "POST", description: "Sign out and clear session" },
    { endpoint: "/api/teams", method: "GET/POST", description: "List teams or create new team" },
    { endpoint: "/api/teams/wallets", method: "GET/POST", description: "List team wallets or add wallet to team" },
    { endpoint: "/api/teams/invite", method: "POST", description: "Send team invitation email" },
    { endpoint: "/api/invites/accept", method: "POST", description: "Accept team invitation" }
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
      answer: "We recommend setting up autonomous monitoring for continuous protection. The system can automatically rescan your wallet and notify you of new risky approvals as they're detected."
    },
    {
      question: "What if a scan fails?",
      answer: "Scans are processed in the background using a job queue system. If a scan fails, you'll see an error message and can retry. The system automatically retries failed jobs."
    },
    {
      question: "How do teams work in AllowanceGuard?",
      answer: "Teams allow you to collaborate on wallet security with role-based access control. Create a team, add wallet addresses, and invite members with different permission levels (owner, admin, editor, viewer). Viewers have read-only access and cannot revoke approvals, while editors and above can manage wallets and revoke approvals."
    }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
  return (
          <div className="space-y-8">
            <div>
              <h2 id="overview" className="text-2xl font-semibold text-ink mb-4">Overview</h2>
              <h3 id="what-is-allowanceguard" className="text-xl font-semibold text-ink mb-3">What is AllowanceGuard?</h3>
              <p className="text-base text-stone mb-6">
                AllowanceGuard is a free and open source security platform that helps you discover, understand, and control every token approval associated with your wallets. It scans across multiple blockchain networks to identify risky permissions and provides tools to revoke them safely.
              </p>
              
              <h3 id="key-features" className="text-xl font-semibold text-ink mb-3">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              
              <h3 id="how-it-works" className="text-xl font-semibold text-ink mb-3">How It Works</h3>
              <ol className="list-decimal list-inside space-y-2 text-base text-stone">
                <li>Connect your wallet to AllowanceGuard</li>
                <li>Scan your wallet for existing token approvals</li>
                <li>Review risk scores and identify dangerous approvals</li>
                <li>Revoke risky approvals with one click</li>
                <li>Set up monitoring for ongoing protection</li>
              </ol>
            </div>
          </div>
        )

      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="getting-started" className="text-2xl font-semibold text-ink mb-4">Getting Started</h2>
          <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-ink text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">1</div>
                  <div>
                    <h3 id="connect-your-wallet" className="text-xl font-semibold text-ink mb-3">1. Connect Your Wallet</h3>
                    <h4 className="font-medium text-ink mb-1">Connect Your Wallet</h4>
                    <p className="text-sm text-stone">Click &quot;Connect Wallet&quot; and select your preferred wallet provider (MetaMask, WalletConnect, etc.)</p>
                  </div>
                </div>
                <h3 id="scan-your-approvals" className="text-xl font-semibold text-ink mb-3">2. Scan Your Approvals</h3>
                <p className="text-base text-stone mb-4">Click &quot;Scan wallet&quot; to discover all your token approvals across supported networks</p>
                <h3 id="review-risk-scores" className="text-xl font-semibold text-ink mb-3">3. Review Risk Scores</h3>
                <p className="text-base text-stone mb-4">Examine your approvals, paying special attention to unlimited approvals and high-risk spenders</p>
                <h3 id="revoke-risky-approvals" className="text-xl font-semibold text-ink mb-3">4. Revoke Risky Approvals</h3>
                <p className="text-base text-stone mb-4">Use the &quot;Revoke&quot; button to set risky allowances to zero</p>
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
              <h2 id="supported-networks" className="text-2xl font-semibold text-ink mb-4">Supported Networks</h2>
            <p className="text-base text-stone mb-6">
                AllowanceGuard currently supports the following blockchain networks:
            </p>
            <div className="space-y-6">
              {supportedNetworks.map((network) => (
                <div key={network.chainId} className="flex items-center justify-between p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-electric" />
                    </div>
              <div>
                      <h4 className="text-lg font-semibold text-ink">{network.name}</h4>
                    <p className="text-sm text-stone">Chain ID: {network.chainId}</p>
              </div>
                  </div>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-electric/10 text-electric border border-electric/20">
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
              <h2 id="risk-scoring-system" className="text-2xl font-semibold text-ink mb-4">Risk Scoring System</h2>
              <p className="text-base text-stone mb-6">
                AllowanceGuard uses a comprehensive risk scoring system to help you prioritize which approvals need immediate attention:
              </p>
          <div className="space-y-6">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-6 p-6 bg-white border border-line rounded-lg">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-electric">{factor.score}</span>
        </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">{factor.factor}</h4>
                      <p className="text-base text-stone">{factor.description}</p>
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
              <h2 id="alerts-notifications" className="text-2xl font-semibold text-ink mb-4">Alerts & Notifications</h2>
              <p className="text-base text-stone mb-6">
                Stay informed about your wallet security with automated alerts:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {alertFeatures.map((alert, index) => {
                  const IconComponent = alert.type === 'Email Alerts' ? Mail : 
                                       alert.type === 'Slack Integration' ? Bell :
                                       alert.type === 'Autonomous Monitoring' ? Zap : Bell
                  return (
                    <div key={index} className="border border-line rounded-lg p-6 bg-white">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-electric" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-ink mb-2">{alert.type}</h4>
                          <p className="text-base text-stone mb-4">{alert.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm text-stone">
                        {alert.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-electric rounded-full mt-2 flex-shrink-0"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
          </div>
                  )
                })}
        </div>
    </div>
          </div>
        )
      case 'monitoring':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="autonomous-monitoring" className="text-2xl font-semibold text-ink mb-4">Autonomous Monitoring</h2>
              <p className="text-base text-stone mb-6">
                Enable continuous monitoring of your wallets with automatic rescans and instant drift detection. The system will alert you immediately when new approvals appear or existing ones change.
              </p>
              
          <div className="space-y-6">
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h3 id="how-it-works" className="text-xl font-semibold text-ink mb-3">How It Works</h3>
                    </div>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-base text-stone ml-16">
                    <li>Enable monitoring for your wallet with a custom frequency (default: 12 hours)</li>
                    <li>System automatically rescans your wallet at the specified intervals</li>
                    <li>Detects drift: new approvals, amount changes, or unlimited flips</li>
                    <li>Sends instant alerts via email and Slack when changes are detected</li>
                    <li>Remembers what was alerted to prevent spam notifications</li>
                  </ol>
                </div>

                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h3 id="drift-detection" className="text-xl font-semibold text-ink mb-3">Drift Detection</h3>
                    </div>
                  </div>
                  <p className="text-sm text-stone mb-3">The system detects the following types of changes:</p>
                  <ul className="space-y-1 text-sm text-stone">
                    <li>• <strong>New Approvals:</strong> Previously unseen token approvals</li>
                    <li>• <strong>Amount Growth:</strong> Approvals that grew from zero to a positive amount</li>
                    <li>• <strong>Unlimited Flips:</strong> Approvals that became unlimited</li>
                    <li>• <strong>Policy Filtering:</strong> Only alerts on approvals that match your risk policy</li>
                  </ul>
                </div>

                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Settings className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h3 id="configuration" className="text-xl font-semibold text-ink mb-3">Configuration</h3>
                    </div>
                  </div>
                  <p className="text-base text-stone mb-4 ml-16">You can configure monitoring settings in the sidebar:</p>
                  <ul className="space-y-2 text-base text-stone ml-16">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-electric rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>Enable/Disable:</strong> Turn monitoring on or off for each wallet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-electric rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>Frequency:</strong> Set rescan interval (minimum 30 minutes)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-electric rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>Alerts:</strong> Configure email and Slack notification preferences</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 'teams':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="teams-collaboration" className="text-2xl font-semibold text-ink mb-4">Teams & Collaboration</h2>
              <p className="text-base text-stone mb-6">
                AllowanceGuard supports team collaboration with role-based access control. Create teams, invite members, and manage wallet access with different permission levels.
              </p>

              <h3 className="text-xl font-semibold text-ink mb-3">Team Roles</h3>
              <div className="space-y-4 mb-6">
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Owner</h4>
                      <p className="text-base text-stone">Full control over the team, including adding/removing members, managing wallets, and inviting collaborators.</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Admin</h4>
                      <p className="text-base text-stone">Can manage team members, add wallets, and invite users. Cannot remove the owner.</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Settings className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Editor</h4>
                      <p className="text-base text-stone">Can add wallets to the team and invite viewers. Can revoke approvals and manage monitoring settings.</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Search className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Viewer</h4>
                      <p className="text-base text-stone">Read-only access. Can view approvals and scan results but cannot revoke approvals or modify settings.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-ink mb-3">Getting Started with Teams</h3>
              <ol className="list-decimal list-inside space-y-2 text-base text-stone mb-6">
                <li><strong>Sign In:</strong> Use the email magic link authentication to create an account</li>
                <li><strong>Create Team:</strong> Click &quot;New team&quot; and enter a team name</li>
                <li><strong>Add Wallets:</strong> Add wallet addresses that your team needs to monitor</li>
                <li><strong>Invite Members:</strong> Send email invites to collaborators with appropriate roles</li>
                <li><strong>Manage Access:</strong> Control who can view, edit, or revoke approvals</li>
              </ol>

              <h3 className="text-xl font-semibold text-ink mb-3">Team Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Shared Wallets</h4>
                      <p className="text-base text-stone">Add multiple wallet addresses to a team for centralized monitoring</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Email Invites</h4>
                      <p className="text-base text-stone">Invite team members via secure email links with role-based access</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Role-Based Access</h4>
                      <p className="text-base text-stone">Control permissions with owner, admin, editor, and viewer roles</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Team Monitoring</h4>
                      <p className="text-base text-stone">Set up autonomous monitoring for team-managed wallets</p>
                    </div>
                  </div>
                </div>
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
              <div className="space-y-6">
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lock className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Using AllowanceGuard</h4>
                    </div>
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-base text-stone ml-16">
                    <li>Connect your wallet and scan for approvals</li>
                    <li>Find the approval you want to revoke</li>
                    <li>Click the &quot;Revoke&quot; button</li>
                    <li>Sign the transaction in your wallet</li>
                    <li>Pay the gas fee to complete the revocation</li>
                  </ol>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-electric" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Important Notes</h4>
                    </div>
                  </div>
                  <ul className="space-y-2 text-base text-stone ml-16">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-electric rounded-full mt-2 flex-shrink-0"></span>
                      <span>Each revocation requires a separate transaction and gas fee</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-electric rounded-full mt-2 flex-shrink-0"></span>
                      <span>Revoking doesn&apos;t affect already deposited or staked tokens</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-electric rounded-full mt-2 flex-shrink-0"></span>
                      <span>Some dApps may require you to re-approve for continued functionality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-electric rounded-full mt-2 flex-shrink-0"></span>
                      <span>Revocation is preventative, not restorative for already stolen funds</span>
                    </li>
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
                    <li>• Ensure you&apos;re connected to a supported network</li>
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
        return [
          { level: 2, text: 'Overview', id: 'overview' },
          { level: 3, text: 'What is AllowanceGuard?', id: 'what-is-allowanceguard' },
          { level: 3, text: 'Key Features', id: 'key-features' },
          { level: 3, text: 'How It Works', id: 'how-it-works' }
        ]
      case 'getting-started':
        return [
          { level: 2, text: 'Getting Started', id: 'getting-started' },
          { level: 3, text: 'Connect Your Wallet', id: 'connect-your-wallet' },
          { level: 3, text: 'Scan Your Approvals', id: 'scan-your-approvals' },
          { level: 3, text: 'Review Risk Scores', id: 'review-risk-scores' },
          { level: 3, text: 'Revoke Risky Approvals', id: 'revoke-risky-approvals' }
        ]
      case 'networks':
        return [
          { level: 2, text: 'Supported Networks', id: 'supported-networks' }
        ]
      case 'risk-scoring':
        return [
          { level: 2, text: 'Risk Scoring System', id: 'risk-scoring-system' }
        ]
      case 'alerts':
        return [
          { level: 2, text: 'Alerts & Notifications', id: 'alerts-notifications' }
        ]
      case 'monitoring':
        return [
          { level: 2, text: 'Autonomous Monitoring', id: 'autonomous-monitoring' },
          { level: 3, text: 'How It Works', id: 'how-it-works' },
          { level: 3, text: 'Drift Detection', id: 'drift-detection' },
          { level: 3, text: 'Configuration', id: 'configuration' }
        ]
      case 'teams':
        return [
          { level: 2, text: 'Teams & Collaboration', id: 'teams-collaboration' },
          { level: 3, text: 'Team Roles', id: 'team-roles' },
          { level: 3, text: 'Getting Started with Teams', id: 'getting-started-with-teams' },
          { level: 3, text: 'Team Features', id: 'team-features' }
        ]
      case 'revoking':
        return [
          { level: 2, text: 'How to Revoke Approvals', id: 'how-to-revoke-approvals' },
          { level: 3, text: 'Using the Dashboard', id: 'using-the-dashboard' },
          { level: 3, text: 'Manual Revocation', id: 'manual-revocation' },
          { level: 3, text: 'Bulk Operations', id: 'bulk-operations' }
        ]
      case 'api':
        return [
          { level: 2, text: 'Settings & Configuration', id: 'settings-configuration' },
          { level: 3, text: 'API Endpoints', id: 'api-endpoints' },
          { level: 3, text: 'Authentication', id: 'authentication' },
          { level: 3, text: 'Rate Limits', id: 'rate-limits' }
        ]
      case 'troubleshooting':
        return [
          { level: 2, text: 'Common Issues & Solutions', id: 'common-issues-solutions' },
          { level: 3, text: 'Connection Issues', id: 'connection-issues' },
          { level: 3, text: 'Scan Problems', id: 'scan-problems' },
          { level: 3, text: 'Revocation Failures', id: 'revocation-failures' }
        ]
      case 'faq':
        return [
          { level: 2, text: 'Frequently Asked Questions', id: 'frequently-asked-questions' }
        ]
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
                        href={`#${heading.id}`}
                        className={`block text-sm text-stone hover:text-ink transition-colors duration-200 ${
                          heading.level === 3 ? 'ml-3' : ''
                        }`}
                      >
                        {heading.text}
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