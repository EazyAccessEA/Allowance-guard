import Image from 'next/image'
import { HelpCircle, Shield, AlertTriangle, Mail, Settings, Eye, Lock } from 'lucide-react'

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
          a: 'Allowance Guard is an enterprise-grade security platform that identifies and manages dangerous token approvals on your wallet. Using advanced blockchain analysis and risk assessment algorithms, it scans your wallet for risky permissions that could allow malicious contracts to drain your funds. Our platform has protected over 68,000 wallets and prevented over $200 million in potential losses.'
        },
        {
          q: 'How does it work?',
          a: 'Our platform uses advanced blockchain analysis to scan all token approvals associated with your wallet address across Ethereum, Arbitrum, and Base networks. We employ machine learning algorithms to assess risk factors including approval amounts, contract reputation, time since last interaction, and historical attack patterns. The system then provides actionable intelligence about which approvals pose immediate threats and should be revoked.'
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
    },
    {
      id: 'technical',
      title: 'Technical Deep Dive',
      icon: Settings,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      questions: [
        {
          q: 'What is the difference between ERC-20, ERC-721, and ERC-1155 approvals?',
          a: 'ERC-20 approvals allow contracts to transfer fungible tokens (like USDC, ETH), ERC-721 approvals control NFT transfers, and ERC-1155 approvals manage both fungible and non-fungible tokens in a single contract. Each standard has different security implications and attack vectors.'
        },
        {
          q: 'How do you calculate risk scores?',
          a: 'Our risk scoring algorithm considers multiple factors: approval amount (unlimited = highest risk), contract age and reputation, time since last interaction, historical attack patterns, and cross-referencing with known malicious addresses. Scores range from 0-100, with 80+ indicating immediate action required.'
        },
        {
          q: 'What happens if a contract I approved gets compromised?',
          a: 'If a previously trusted contract becomes compromised, it can immediately drain all approved tokens. This is why we recommend revoking approvals to unused contracts and setting specific amounts rather than unlimited approvals. Our monitoring system can detect when approved contracts are flagged as malicious.'
        },
        {
          q: 'Can you detect approval phishing attacks?',
          a: 'Yes, our system monitors for suspicious approval patterns including rapid successive approvals, approvals to newly created contracts, and approvals to contracts with no transaction history. We also cross-reference against known phishing databases and flag suspicious domains.'
        }
      ]
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
            <HelpCircle className="w-8 h-8 text-cobalt mr-3" />
            <h1 className="fireart-heading-1 text-obsidian">Frequently Asked Questions</h1>
          </div>
          <p className="fireart-body-large text-charcoal">
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
                  <div className="w-12 h-12 bg-cobalt-100 rounded-lg flex items-center justify-center mr-4">
                    <Icon className="w-6 h-6 text-cobalt" />
                  </div>
                  <h2 className="fireart-heading-2 text-obsidian">{category.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <div key={index} className="fireart-card">
                      <h3 className="fireart-heading-3 text-obsidian mb-3">{faq.q}</h3>
                      <p className="fireart-body text-charcoal leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* Quick Actions */}
        <section className="mt-12 fireart-card bg-warm-gray">
          <h2 className="fireart-heading-2 text-obsidian mb-4">Still Need Help?</h2>
          <p className="fireart-body text-charcoal mb-6">
            Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <a 
              href="/contact" 
              className="flex items-center p-4 fireart-card hover:shadow-medium transition-all"
            >
              <Mail className="w-5 h-5 text-cobalt mr-3" />
              <div>
                <h3 className="fireart-body font-medium text-obsidian">Contact Support</h3>
                <p className="fireart-caption text-charcoal">Get personalized help</p>
              </div>
            </a>
            
            <a 
              href="/docs" 
              className="flex items-center p-4 fireart-card hover:shadow-medium transition-all"
            >
              <Eye className="w-5 h-5 text-emerald mr-3" />
              <div>
                <h3 className="fireart-body font-medium text-obsidian">Documentation</h3>
                <p className="fireart-caption text-charcoal">Detailed guides</p>
              </div>
            </a>
            
            <a 
              href="/security" 
              className="flex items-center p-4 fireart-card hover:shadow-medium transition-all"
            >
              <Lock className="w-5 h-5 text-amber mr-3" />
              <div>
                <h3 className="fireart-body font-medium text-obsidian">Security Info</h3>
                <p className="fireart-caption text-charcoal">Safety measures</p>
              </div>
            </a>
          </div>
        </section>

        {/* Security Notice */}
        <section className="mt-8 fireart-card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-amber mr-3 mt-1" />
            <div>
              <h3 className="fireart-heading-3 text-amber-800 mb-2">Important Security Reminder</h3>
              <p className="fireart-body text-amber-700">
                Allowance Guard is a security tool, but it cannot recover stolen funds. Always verify contract addresses, 
                never share your private keys, and be cautious when interacting with new dApps. If you suspect your wallet 
                has been compromised, revoke all approvals immediately and move your funds to a new wallet.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-warm-gray border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="text-center">
            <p className="fireart-caption text-charcoal">
              © {new Date().getFullYear()} Allowance Guard. All rights reserved.
            </p>
            <div className="mt-4 space-x-6">
              <a href="/terms" className="fireart-caption text-cobalt hover:text-obsidian">Terms of Service</a>
              <a href="/privacy" className="fireart-caption text-cobalt hover:text-obsidian">Privacy Policy</a>
              <a href="/cookies" className="fireart-caption text-cobalt hover:text-obsidian">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}