import Image from 'next/image'
import { Shield, Eye, AlertTriangle, Mail, Settings, BookOpen, ArrowRight, CheckCircle } from 'lucide-react'

export default function DocsPage() {
  const quickStartSteps = [
    {
      step: 1,
      title: "Connect Your Wallet",
      description: "Click the Connect Wallet button and select your preferred wallet provider.",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      step: 2,
      title: "Scan for Approvals",
      description: "Click Scan Now to check all your token approvals across supported networks.",
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      step: 3,
      title: "Review Results",
      description: "Examine your approvals and identify any risky or unlimited permissions.",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      step: 4,
      title: "Set Up Alerts",
      description: "Configure email or Slack notifications to stay informed about new approvals.",
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
      description: "Can take any amount from your wallet",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      action: "Revoke immediately"
    },
    {
      level: "HIGH RISK",
      description: "Large amounts or unknown contracts",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      action: "Review carefully"
    },
    {
      level: "SAFE",
      description: "Small amounts from trusted sources",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      action: "Monitor periodically"
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
            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
          </div>
          <p className="text-gray-600">
            Complete guide to using Allowance Guard to protect your wallet from dangerous token approvals.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickStartSteps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.step} className={`${step.bgColor} border border-gray-200 rounded-lg p-6`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 ${step.bgColor} border-2 border-gray-300 rounded-full flex items-center justify-center mr-4`}>
                      <span className="text-lg font-bold text-gray-700">{step.step}</span>
                    </div>
                    <Icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Supported Networks */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Supported Networks</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              Allowance Guard currently supports the following blockchain networks:
            </p>
            <div className="space-y-3">
              {supportedNetworks.map((network) => (
                <div key={network.chainId} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{network.name}</h3>
                    <p className="text-sm text-gray-500">Chain ID: {network.chainId}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {network.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Risk Levels */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Understanding Risk Levels</h2>
          <div className="space-y-4">
            {riskLevels.map((risk) => (
              <div key={risk.level} className={`${risk.bgColor} ${risk.borderColor} border rounded-lg p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${risk.color} mb-2`}>{risk.level}</h3>
                    <p className="text-gray-700 mb-2">{risk.description}</p>
                    <p className="text-sm font-medium text-gray-600">Recommended action: {risk.action}</p>
                  </div>
                  <div className="text-right">
                    <div className={`w-4 h-4 ${risk.bgColor} border-2 ${risk.borderColor} rounded-full`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How Allowance Guard Works</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Blockchain Analysis</h3>
                  <p className="text-gray-600">
                    We scan the blockchain to find all token approvals associated with your wallet address. 
                    This includes ERC-20, ERC-721, and ERC-1155 token approvals.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-sm font-bold text-green-600">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Risk Assessment</h3>
                  <p className="text-gray-600">
                    Each approval is analyzed for risk factors including amount, contract reputation, 
                    and time since last interaction to determine the risk level.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-sm font-bold text-yellow-600">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Local Processing</h3>
                  <p className="text-gray-600">
                    All analysis happens locally in your browser. We never store your private keys 
                    or have access to your wallet funds.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-sm font-bold text-purple-600">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Actionable Results</h3>
                  <p className="text-gray-600">
                    You receive clear, actionable information about which approvals to revoke 
                    and how to protect your wallet going forward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Setting Up Alerts */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Setting Up Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Email Alerts</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Receive email notifications when new risky approvals are detected on your wallet.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Daily digest of all approvals</li>
                <li>• Immediate alerts for high-risk approvals</li>
                <li>• Weekly security summary</li>
                <li>• Customizable risk thresholds</li>
              </ul>
              <a href="/preferences" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-4">
                Configure Email Alerts
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Slack Integration</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get real-time notifications in your Slack workspace for immediate awareness.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Real-time notifications</li>
                <li>• Team collaboration</li>
                <li>• Custom webhook integration</li>
                <li>• Risk-only or all approvals</li>
              </ul>
              <a href="/preferences" className="inline-flex items-center text-green-600 hover:text-green-800 text-sm font-medium mt-4">
                Set Up Slack
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Best Practices</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Security Tips</h3>
                <ul className="space-y-2 text-yellow-700">
                  <li>• <strong>Revoke unlimited approvals immediately</strong> - These allow any amount to be taken</li>
                  <li>• <strong>Review approvals regularly</strong> - Check your wallet at least weekly</li>
                  <li>• <strong>Be cautious with new dApps</strong> - Only approve what you need</li>
                  <li>• <strong>Use specific amounts</strong> - Avoid unlimited approvals when possible</li>
                  <li>• <strong>Keep software updated</strong> - Use the latest wallet and browser versions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Troubleshooting</h2>
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan Not Working?</h3>
              <p className="text-gray-600 mb-3">
                If the scan fails or returns no results, try these solutions:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Ensure your wallet is connected and unlocked</li>
                <li>• Check that you&apos;re on a supported network (Ethereum, Arbitrum, Base)</li>
                <li>• Try refreshing the page and reconnecting your wallet</li>
                <li>• Clear your browser cache and cookies</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Receiving Alerts?</h3>
              <p className="text-gray-600 mb-3">
                If you&apos;re not getting email or Slack notifications:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Check your spam/junk folder</li>
                <li>• Verify your email address in preferences</li>
                <li>• Ensure Slack webhook URL is correct</li>
                <li>• Check that alerts are enabled in your preferences</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Getting Help */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Need More Help?</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/faq" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Frequently Asked Questions
              </a>
              <a href="/contact" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Contact Support
              </a>
              <a href="/security" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Security Information
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