import Image from 'next/image'
import { HelpCircle, Shield, AlertTriangle, Mail, Settings, Eye, Lock, Zap } from 'lucide-react'

export default function FAQPage() {
  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      icon: HelpCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      questions: [
        {
          q: 'What is Allowance Guard?',
          a: 'Allowance Guard is a security tool that helps you identify and manage dangerous token approvals on your wallet. It scans your wallet for risky permissions that could allow malicious contracts to drain your funds.'
        },
        {
          q: 'How does it work?',
          a: 'We scan the blockchain to find all token approvals associated with your wallet address, analyze them for risk factors, and provide you with actionable information about which approvals to revoke.'
        },
        {
          q: 'Is it free to use?',
          a: 'Yes, Allowance Guard is completely free to use. We believe wallet security should be accessible to everyone in the crypto community.'
        },
        {
          q: 'Do I need to create an account?',
          a: 'No account required. Simply connect your wallet and start scanning. We only store your email address if you choose to subscribe to alerts.'
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      questions: [
        {
          q: 'Is my wallet safe?',
          a: 'Absolutely. We never have access to your private keys, seed phrases, or wallet funds. All scanning happens locally in your browser, and we only read public blockchain data.'
        },
        {
          q: 'What data do you collect?',
          a: 'We only collect your wallet address (public) and email address (if you subscribe to alerts). We never store private keys, transaction data, or personal information.'
        },
        {
          q: 'Can you access my funds?',
          a: 'No, we cannot and will never access your funds. We are a read-only service that only analyzes public blockchain data. Your private keys never leave your device.'
        },
        {
          q: 'How do you protect my privacy?',
          a: 'We use industry-standard encryption, never share your data with third parties, and follow strict privacy practices. Your wallet address is only used for blockchain scanning.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Issues',
      icon: Settings,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      questions: [
        {
          q: 'Which wallets are supported?',
          a: 'We support all major wallet providers including MetaMask, WalletConnect, Coinbase Wallet, and others. Any wallet that can connect via standard protocols will work.'
        },
        {
          q: 'Which networks do you support?',
          a: 'Currently we support Ethereum, Arbitrum, and Base. We are working on adding more networks based on user demand.'
        },
        {
          q: 'Why is my scan taking so long?',
          a: 'Scanning time depends on how many approvals you have and network congestion. Large wallets with many approvals may take a few minutes to scan completely.'
        },
        {
          q: 'What if the scan fails?',
          a: 'Try refreshing the page, reconnecting your wallet, or switching networks. If problems persist, contact our support team for assistance.'
        }
      ]
    },
    {
      id: 'alerts',
      title: 'Alerts & Notifications',
      icon: Mail,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      questions: [
        {
          q: 'How do email alerts work?',
          a: 'You can subscribe to receive email notifications when new risky approvals are detected. Choose between immediate alerts, daily digests, or weekly summaries.'
        },
        {
          q: 'Can I set up Slack notifications?',
          a: 'Yes, you can integrate with Slack using webhooks. This allows you to receive real-time notifications in your team workspace.'
        },
        {
          q: 'How often will I receive alerts?',
          a: 'You control the frequency. Choose from immediate alerts for high-risk approvals, daily summaries, or weekly overviews based on your preferences.'
        },
        {
          q: 'Can I customize what triggers alerts?',
          a: 'Yes, you can set risk thresholds, choose specific networks, and filter by approval types to receive only the alerts that matter to you.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      questions: [
        {
          q: 'My wallet won\'t connect',
          a: 'Make sure your wallet is unlocked and you\'re on a supported network. Try refreshing the page or switching to a different browser.'
        },
        {
          q: 'I\'m not seeing any approvals',
          a: 'This could mean you have no token approvals, or there might be a network issue. Try switching networks or contact support if the problem persists.'
        },
        {
          q: 'The revoke button isn\'t working',
          a: 'Revoking approvals requires a blockchain transaction. Make sure you have enough ETH for gas fees and that your wallet is properly connected.'
        },
        {
          q: 'I\'m not receiving email alerts',
          a: 'Check your spam folder, verify your email address in preferences, and ensure alerts are enabled. Contact support if you continue having issues.'
        }
      ]
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
            <HelpCircle className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          </div>
          <p className="text-gray-600">
            Find answers to common questions about Allowance Guard and wallet security.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category) => {
            const Icon = category.icon
            return (
              <section key={category.id} className="mb-12">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                    <Icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">{category.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.q}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* Quick Actions */}
        <section className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/contact" 
              className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <Mail className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Contact Support</h3>
                <p className="text-xs text-gray-500">Get personalized help</p>
              </div>
            </a>
            
            <a 
              href="/docs" 
              className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
            >
              <Eye className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Documentation</h3>
                <p className="text-xs text-gray-500">Detailed guides</p>
              </div>
            </a>
            
            <a 
              href="/security" 
              className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
            >
              <Lock className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Security Info</h3>
                <p className="text-xs text-gray-500">Safety measures</p>
              </div>
            </a>
          </div>
        </section>

        {/* Security Notice */}
        <section className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Security Reminder</h3>
              <p className="text-yellow-700 text-sm">
                Allowance Guard is a security tool, but it cannot recover stolen funds. Always verify contract addresses, 
                never share your private keys, and be cautious when interacting with new dApps. If you suspect your wallet 
                has been compromised, revoke all approvals immediately and move your funds to a new wallet.
              </p>
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