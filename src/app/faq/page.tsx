'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'
import { AlertTriangle, Mail, Eye, Lock } from 'lucide-react'

export default function FAQPage() {
  const { isConnected } = useAccount()

  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      questions: [
        {
          q: 'What is Allowance Guard?',
          a: 'Allowance Guard is a security platform that identifies and manages dangerous token approvals on your wallet. Using blockchain analysis and risk assessment, it scans your wallet for risky permissions that could allow malicious contracts to drain your funds.'
        },
        {
          q: 'How does it work?',
          a: 'Our platform uses blockchain analysis to scan all token approvals associated with your wallet address across Ethereum, Arbitrum, and Base networks. We assess risk factors including approval amounts, contract reputation, and time since last interaction.'
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
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
      {/* Hero Section - Fireart Style with Animated Background */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Video Background */}
        <VideoBackground 
          videoSrc="/AllowanceGuard..mp4"
        />
        {/* Gradient overlay for better text readability - 10% left, 45% right */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.55) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Frequently Asked Questions</H1>
          <p className="text-base text-stone max-w-reading">
            Find answers to common questions about Allowance Guard and wallet security.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      <Section>
        <Container>
          <div className="space-y-12">
            {faqCategories.map((category) => (
              <section key={category.id}>
                <H2 className="mb-6">{category.title}</H2>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <div key={index} className="border border-line rounded-md p-6">
                      <h3 className="text-lg text-ink mb-3">{faq.q}</h3>
                      <p className="text-base text-stone leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      {/* Quick Actions */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Still Need Help?</H2>
          <p className="text-base text-stone mb-8 max-w-reading">
            Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="/contact" 
              className="flex items-center p-6 border border-line rounded-md bg-white hover:bg-mist transition-colors"
            >
              <Mail className="w-5 h-5 text-ink mr-3" />
              <div>
                <h3 className="text-base font-medium text-ink">Contact Support</h3>
                <p className="text-sm text-stone">Get personalized help</p>
              </div>
            </a>
            
            <a 
              href="/docs" 
              className="flex items-center p-6 border border-line rounded-md bg-white hover:bg-mist transition-colors"
            >
              <Eye className="w-5 h-5 text-ink mr-3" />
              <div>
                <h3 className="text-base font-medium text-ink">Documentation</h3>
                <p className="text-sm text-stone">Detailed guides</p>
              </div>
            </a>
            
            <a 
              href="/security" 
              className="flex items-center p-6 border border-line rounded-md bg-white hover:bg-mist transition-colors"
            >
              <Lock className="w-5 h-5 text-ink mr-3" />
              <div>
                <h3 className="text-base font-medium text-ink">Security Info</h3>
                <p className="text-sm text-stone">Safety measures</p>
              </div>
            </a>
          </div>
        </Container>
      </Section>

      {/* Security Notice */}
      <Section>
        <Container>
          <div className="border border-line rounded-md p-6 bg-mist">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-ink mr-3 mt-1" />
              <div>
                <h3 className="text-lg text-ink mb-2">Important Security Reminder</h3>
                <p className="text-base text-stone">
                  Allowance Guard is a security tool, but it cannot recover stolen funds. Always verify contract addresses, 
                  never share your private keys, and be cautious when interacting with new dApps. If you suspect your wallet 
                  has been compromised, revoke all approvals immediately and move your funds to a new wallet.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}