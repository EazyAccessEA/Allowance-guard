import Image from 'next/image'
import { 
  Shield, 
  Eye, 
  AlertTriangle, 
  Mail, 
  Settings, 
  BookOpen, 
  CheckCircle,
  Network,
  Zap,
  Lock,
  XCircle,
  Info
} from 'lucide-react'

export default function DocsPage() {
  const quickStartSteps = [
    {
      step: 1,
      title: "Connect Your Wallet",
      description: "Click Connect Wallet and select your preferred wallet provider.",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      step: 2,
      title: "Scan for Approvals",
      description: "Click Scan Now to list all your token approvals (ERC-20, ERC-721, ERC-1155) across supported networks.",
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      step: 3,
      title: "Review Results",
      description: "Examine your approvals. Pay special attention to unlimited approvals and approvals you no longer need.",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      step: 4,
      title: "Revoke or Reduce Permissions",
      description: "Use tools like Revoke.cash or Etherscan's Token Approval tool to revoke or limit approvals.",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      step: 5,
      title: "Set Up Alerts",
      description: "Configure email or Slack alerts so you're notified of new risky approvals as they arise.",
      icon: Mail,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  const supportedNetworks = [
    { name: "Ethereum", chainId: 1, status: "Full Support" },
    { name: "Arbitrum", chainId: 42161, status: "Full Support" },
    { name: "Base", chainId: 8453, status: "Full Support" }
  ]

  const riskLevels = [
    {
      level: "UNLIMITED",
      description: "The contract has permission to spend any amount from your wallet.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      action: "Revoke immediately"
    },
    {
      level: "HIGH RISK",
      description: "Either large amounts for approval, unknown or frequently used contracts.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      action: "Review carefully; limit or revoke"
    },
    {
      level: "SAFE",
      description: "Small amounts, trusted sources, older approvals with minimal risk.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      action: "Just monitor regularly"
    }
  ]

  const howItWorksSteps = [
    {
      step: 1,
      title: "Blockchain Analysis",
      description: "We scan your wallet address across supported networks to discover all active approvals.",
      icon: Network,
      color: "text-blue-600"
    },
    {
      step: 2,
      title: "Risk Assessment",
      description: "For each approval, we look at: amount, contract reputation, whether the approval is unlimited, time since last interaction, etc.",
      icon: AlertTriangle,
      color: "text-yellow-600"
    },
    {
      step: 3,
      title: "Local Processing",
      description: "All scanning and risk calculations happen in your browser — we do not store your private keys or touch your funds.",
      icon: Lock,
      color: "text-green-600"
    },
    {
      step: 4,
      title: "Actionable Results",
      description: "We show you exactly which approvals are risky, which are safe, and how to revoke or reduce approvals.",
      icon: CheckCircle,
      color: "text-purple-600"
    }
  ]

  const alertTypes = [
    {
      type: "Email Alerts",
      description: "Get notified when:",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      features: [
        "A new high-risk/unlimited approval is detected",
        "Daily digest of approvals since last login",
        "Weekly security summary"
      ]
    },
    {
      type: "Slack Integration or Webhooks",
      description: "Real-time alerts when risky approvals are detected.",
      icon: Settings,
      color: "text-green-600",
      bgColor: "bg-green-50",
      features: [
        "Real-time notifications",
        "Team collaboration",
        "Custom webhook integration"
      ]
    },
    {
      type: "Custom Risk Thresholds",
      description: "You can set thresholds so only 'High Risk' or 'Unlimited' approvals trigger alerts — less noise.",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      features: [
        "Customizable risk levels",
        "Reduced notification noise",
        "Personalized alerting"
      ]
    }
  ]

  const bestPractices = [
    "Revoke unlimited approvals immediately.",
    "Limit approvals to as small amounts as you reasonably need.",
    "Frequently scan using tools like Revoke.cash or explorer tools.",
    "Don't rely on 'disconnecting' your wallet — that doesn't revoke permissions.",
    "Use hardware wallets where possible — though note: approvals are not prevented just by using hardware wallets. The risk is in granting permissions.",
    "Be especially cautious with new / untrusted dApps or contracts. Always check contract addresses."
  ]

  const troubleshootingItems = [
    {
      issue: "Nothing shows up when scanning?",
      solutions: [
        "Ensure you're on a supported network",
        "Ensure wallet is unlocked",
        "Sometimes the browser extension (if using) needs permission / refresh"
      ]
    },
    {
      issue: "Can't Revoke / Transaction Fails",
      solutions: [
        "May lack gas for that network",
        "The contract may require specific method to revoke (some approvals use nonstandard behavior)",
        "Very old approvals or expired approvals might behave differently"
      ]
    },
    {
      issue: "Still seeing unlimited approvals even after revoking?",
      solutions: [
        "Check whether the approval is by a 'proxy' contract or a generic spender address",
        "Use 'show all approvals' and sort by spender address to catch those"
      ]
    }
  ]

  const faqItems = [
    {
      question: "How does Allowance Guard differ from Revoke.cash?",
      answer: "Allowance Guard uses similar scanning / risk detection logic, but aims to integrate it into a unified UI with alerts, and help you automate reminders / reviews."
    },
    {
      question: "Does revoking an approval break functionality?",
      answer: "Sometimes yes — if a dApp expects to use that permission (e.g. for trading or NFT listing) you may need to grant it again. It's a trade-off: security vs convenience."
    },
    {
      question: "Can I revoke approvals from my hardware wallet?",
      answer: "Yes. Revoke.cash and explorers support hardware wallets (MetaMask with hardware, etc.). But note that giving approval is separate; hardware wallets protect key storage, but not whether you signed a bad approval."
    },
    {
      question: "Are there risks using Revoke.cash / explorers?",
      answer: "As with any blockchain tool: Be sure you're on the correct domain (e.g. revoke.cash), Use secure browser, updated wallet, Be aware of gas fees and ensure you understand what you're revoking"
    }
  ]

  return (
    <div className="min-h-screen bg-platinum">
      {/* Header */}
      <header className="bg-platinum border-b border-gray-200">
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
            <h1 className="fireart-heading-2 text-obsidian">Allowance Guard</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <BookOpen className="w-8 h-8 text-cobalt mr-3" />
            <h1 className="fireart-heading-1 text-obsidian">Documentation</h1>
          </div>
          <p className="fireart-body-large text-charcoal mb-4">
            Protect your wallet from dangerous token approvals. Simple. Transparent. Secure.
          </p>
          <div className="fireart-card bg-gradient-to-br from-cobalt-50 to-electric-50 border-cobalt-200 p-4">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-cobalt mr-2" />
              <p className="fireart-caption text-cobalt">
                <strong>Table of Contents:</strong> Quick Start Guide • Supported Networks • Understanding Risk Levels • How Allowance Guard Works • Revoking Token Approvals • Setting Up Alerts • Security Best Practices • Troubleshooting • FAQ • Next Steps
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="fireart-heading-2 text-obsidian mb-6">Quick Start Guide</h2>
          <div className="grid grid-cols-1 gap-4">
            {quickStartSteps.map((step) => {
              const Icon = step.icon
  return (
                <div key={step.step} className="fireart-card">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-cobalt-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-cobalt">{step.step}</span>
        </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-cobalt" />
                        <h3 className="fireart-heading-3 text-obsidian">{step.title}</h3>
      </div>
                      <p className="fireart-body text-charcoal">{step.description}</p>
          </div>
        </div>
    </div>
  )
            })}
          </div>
        </section>

        {/* Supported Networks */}
        <section className="mb-12">
          <h2 className="fireart-heading-2 text-obsidian mb-6">Supported Networks</h2>
          <div className="fireart-card">
            <p className="fireart-body text-charcoal mb-4">
              Allowance Guard currently works across:
            </p>
            <div className="space-y-3">
              {supportedNetworks.map((network) => (
                <div key={network.chainId} className="flex items-center justify-between p-4 bg-warm-gray rounded-lg">
                  <div>
                    <h3 className="fireart-body font-medium text-obsidian">{network.name}</h3>
                    <p className="fireart-caption text-charcoal">Chain ID: {network.chainId}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {network.status}
                  </span>
              </div>
              ))}
              </div>
            <div className="mt-4 fireart-card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-amber mr-2" />
                <p className="fireart-caption text-amber-800">
                  <strong>Planned/Optional:</strong> More EVM-compatible networks may be added later.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Levels */}
        <section className="mb-12">
          <h2 className="fireart-heading-2 text-obsidian mb-6">Understanding Risk Levels</h2>
          <div className="space-y-4">
            {riskLevels.map((risk) => (
              <div key={risk.level} className="fireart-card">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${risk.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-lg font-bold ${risk.color}`}>
                      {risk.level === 'UNLIMITED' ? '!' : risk.level === 'HIGH RISK' ? '⚠' : '✓'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="fireart-heading-3 text-obsidian mb-2">{risk.level}</h3>
                    <p className="fireart-body text-charcoal mb-2">{risk.description}</p>
                    <p className="fireart-body font-medium text-obsidian">{risk.action}</p>
                  </div>
          </div>
        </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="fireart-heading-2 text-obsidian mb-6">How Allowance Guard Works</h2>
          <div className="space-y-4">
            {howItWorksSteps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="fireart-card">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-cobalt-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-cobalt">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-cobalt" />
                        <h3 className="fireart-heading-3 text-obsidian">{step.title}</h3>
                      </div>
                      <p className="fireart-body text-charcoal">{step.description}</p>
          </div>
          </div>
        </div>
              )
            })}
          </div>
        </section>

        {/* Revoking Token Approvals */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Revoking Token Approvals: Deep Dive</h2>
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revoke.cash</h3>
              <p className="text-gray-600 mb-4">
                Revoke.cash is one of the most popular tools for managing token approvals. Key features:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Supports <strong>100+ networks</strong></li>
                <li>• You can either <strong>connect wallet</strong> or <strong>enter wallet address/ENS</strong> to see approvals</li>
                <li>• Provides filtering / sorting: newest-first, by approved spender, by unlimited approvals, etc.</li>
                <li>• For each approval you get options: <strong>Revoke</strong> (set the allowance to zero) or <strong>Edit amount</strong> (reduce from unlimited to a specific amount)</li>
                <li>• There is a browser extension option that warns when you&apos;re about to sign potentially dangerous approvals</li>
              </ul>
    </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Etherscan & Other Block Explorers</h3>
              <p className="text-gray-600 mb-4">Another path for revoking approvals:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use <strong>Etherscan&apos;s Token Approvals</strong> page (or equivalent on other explorers like Polygonscan)</li>
                <li>• Steps usually:</li>
                <li className="ml-4">1. Go to Token Approvals tool</li>
                <li className="ml-4">2. Connect your wallet or enter your wallet address</li>
                <li className="ml-4">3. View list of approvals (ERC-20, ERC-721, etc.)</li>
                <li className="ml-4">4. Find unwanted or unlimited approvals</li>
                <li className="ml-4">5. Click <strong>Revoke</strong> or &quot;Set approval to zero&quot; / &quot;Cancel approval&quot;</li>
              </ul>
      </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">Things to Know / Cost & Risk</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>• <strong>Gas fees:</strong> Revoking approval is an on-chain transaction, so you&apos;ll pay gas (variable depending on network load)</li>
                <li>• <strong>Each revocation is a separate transaction:</strong> You can&apos;t batch all approvals in one transaction easily</li>
                <li>• <strong>Revoking doesn&apos;t affect deposited/staked tokens:</strong> If your tokens are already locked or staked, revoking approval won&apos;t remove them</li>
                <li>• <strong>Revocation is preventative, not restorative:</strong> If tokens are already stolen, revoking doesn&apos;t get them back</li>
              </ul>
          </div>
          </div>
        </section>

        {/* Setting Up Alerts */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Setting Up Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alertTypes.map((alert) => {
              const Icon = alert.icon
              return (
                <div key={alert.type} className={`${alert.bgColor} border border-gray-200 rounded-lg p-6`}>
                  <div className="flex items-center mb-4">
                    <Icon className={`w-6 h-6 ${alert.color} mr-3`} />
                    <h3 className="text-lg font-semibold text-gray-900">{alert.type}</h3>
          </div>
                  <p className="text-gray-600 mb-4 text-sm">{alert.description}</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {alert.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
    </div>
  )
            })}
          </div>
        </section>

        {/* Security Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Best Practices</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
          <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Security Tips</h3>
                <ul className="space-y-2 text-yellow-700">
                  {bestPractices.map((practice, index) => (
                    <li key={index}>• {practice}</li>
                  ))}
            </ul>
          </div>
        </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Troubleshooting</h2>
        <div className="space-y-4">
            {troubleshootingItems.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.issue}</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  {item.solutions.map((solution, solIndex) => (
                    <li key={solIndex}>• {solution}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">FAQ</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: {item.question}</h3>
                <p className="text-gray-600">A: {item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Next Steps</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1" />
          <div>
                <h3 className="text-lg font-semibold text-green-800 mb-3">Recommended Actions</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Use <strong>Revoke.cash</strong> to audit your current approvals: connect or enter your wallet address, inspect unlimited or high-risk approvals, revoke where needed</li>
                  <li>• Enable regular alerts in Allowance Guard so you&apos;re notified of new risky permissions</li>
                  <li>• Make revoking approvals part of your regular security routine</li>
                  <li>• Consider using browser extension / delegate-style tools (when available) for early warning or automatic revocation triggers</li>
                </ul>
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    You&apos;re in control. Regular audits + careful approval management = much stronger wallet security.
            </p>
          </div>
        </div>
            </div>
    </div>
        </section>
      </main>

    </div>
  )
}