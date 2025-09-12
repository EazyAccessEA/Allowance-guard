'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'

export default function DocsPage() {
  const { isConnected } = useAccount()

  const quickStartSteps = [
    {
      step: 1,
      title: "Connect Your Wallet",
      description: "Click Connect Wallet and select your preferred wallet provider."
    },
    {
      step: 2,
      title: "Scan for Approvals",
      description: "Click Scan Now to list all your token approvals (ERC-20, ERC-721, ERC-1155) across supported networks."
    },
    {
      step: 3,
      title: "Review Results",
      description: "Examine your approvals. Pay special attention to unlimited approvals and approvals you no longer need."
    },
    {
      step: 4,
      title: "Revoke or Reduce Permissions",
      description: "Use tools like Revoke.cash or Etherscan's Token Approval tool to revoke or limit approvals."
    },
    {
      step: 5,
      title: "Set Up Alerts",
      description: "Configure email or Slack alerts so you're notified of new risky approvals as they arise."
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
      action: "Revoke immediately"
    },
    {
      level: "HIGH RISK",
      description: "Either large amounts for approval, unknown or frequently used contracts.",
      action: "Review carefully; limit or revoke"
    },
    {
      level: "SAFE",
      description: "Small amounts, trusted sources, older approvals with minimal risk.",
      action: "Just monitor regularly"
    }
  ]

  const howItWorksSteps = [
    {
      step: 1,
      title: "Blockchain Analysis",
      description: "We scan your wallet address across supported networks to discover all active approvals."
    },
    {
      step: 2,
      title: "Risk Assessment",
      description: "For each approval, we look at: amount, contract reputation, whether the approval is unlimited, time since last interaction, etc."
    },
    {
      step: 3,
      title: "Local Processing",
      description: "All scanning and risk calculations happen in your browser — we do not store your private keys or touch your funds."
    },
    {
      step: 4,
      title: "Actionable Results",
      description: "We show you exactly which approvals are risky, which are safe, and how to revoke or reduce approvals."
    }
  ]

  const alertTypes = [
    {
      type: "Email Alerts",
      description: "Get notified when:",
      features: [
        "A new high-risk/unlimited approval is detected",
        "Daily digest of approvals since last login",
        "Weekly security summary"
      ]
    },
    {
      type: "Slack Integration",
      description: "Real-time alerts when risky approvals are detected.",
      features: [
        "Real-time notifications",
        "Team collaboration",
        "Custom webhook integration"
      ]
    },
    {
      type: "Custom Risk Thresholds",
      description: "You can set thresholds so only 'High Risk' or 'Unlimited' approvals trigger alerts — less noise.",
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
    "Use hardware wallets where possible — though note: approvals are not prevented just by using hardware wallets.",
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
          <H1 className="mb-6">Documentation</H1>
          <p className="text-base text-stone max-w-reading mb-8">
            Protect your wallet from dangerous token approvals. Simple. Transparent. Secure.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Quick Start */}
      <Section>
        <Container>
          <H2 className="mb-6">Quick Start Guide</H2>
          <div className="space-y-6">
            {quickStartSteps.map((step) => (
              <div key={step.step} className="border border-line rounded-md p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-ink text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                    {step.step}
               </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-ink mb-2">{step.title}</h3>
                    <p className="text-base text-stone">{step.description}</p>
            </div>
          </div>
        </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Supported Networks */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Supported Networks</H2>
          <div className="border border-line rounded-md p-6">
            <p className="text-base text-stone mb-6">
              Allowance Guard currently works across:
            </p>
            <div className="space-y-4">
              {supportedNetworks.map((network) => (
                <div key={network.chainId} className="flex items-center justify-between p-4 bg-white border border-line rounded-md">
              <div>
                    <h3 className="text-base font-medium text-ink">{network.name}</h3>
                    <p className="text-sm text-stone">Chain ID: {network.chainId}</p>
              </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-line text-ink">
                    {network.status}
                  </span>
            </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Risk Levels */}
      <Section>
        <Container>
          <H2 className="mb-6">Understanding Risk Levels</H2>
          <div className="space-y-4">
            {riskLevels.map((risk) => (
              <div key={risk.level} className="border border-line rounded-md p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                    {risk.level === 'UNLIMITED' ? '!' : risk.level === 'HIGH RISK' ? '⚠' : '✓'}
        </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-ink mb-2">{risk.level}</h3>
                    <p className="text-base text-stone mb-2">{risk.description}</p>
                    <p className="text-base font-medium text-ink">{risk.action}</p>
        </div>
      </div>
      </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">How Allowance Guard Works</H2>
          <div className="space-y-4">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="border border-line rounded-md p-6 bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-ink text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                    {step.step}
          </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-ink mb-2">{step.title}</h3>
                    <p className="text-base text-stone">{step.description}</p>
          </div>
        </div>
    </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Revoking Token Approvals */}
      <Section>
        <Container>
          <H2 className="mb-6">Revoking Token Approvals</H2>
          <div className="space-y-6">
            <div className="border border-line rounded-md p-6">
              <h3 className="text-lg text-ink mb-4">Revoke.cash</h3>
              <p className="text-base text-stone mb-4">
                Revoke.cash is one of the most popular tools for managing token approvals. Key features:
              </p>
              <ul className="space-y-2 text-base text-stone">
                <li>• Supports <strong>100+ networks</strong></li>
                <li>• You can either <strong>connect wallet</strong> or <strong>enter wallet address/ENS</strong> to see approvals</li>
                <li>• Provides filtering / sorting: newest-first, by approved spender, by unlimited approvals, etc.</li>
                <li>• For each approval you get options: <strong>Revoke</strong> (set the allowance to zero) or <strong>Edit amount</strong> (reduce from unlimited to a specific amount)</li>
                <li>• There is a browser extension option that warns when you&apos;re about to sign potentially dangerous approvals</li>
              </ul>
    </div>

            <div className="border border-line rounded-md p-6">
              <h3 className="text-lg text-ink mb-4">Etherscan & Other Block Explorers</h3>
              <p className="text-base text-stone mb-4">Another path for revoking approvals:</p>
              <ul className="space-y-2 text-base text-stone">
                <li>• Use <strong>Etherscan&apos;s Token Approvals</strong> page (or equivalent on other explorers like Polygonscan)</li>
                <li>• Steps usually:</li>
                <li className="ml-4">1. Go to Token Approvals tool</li>
                <li className="ml-4">2. Connect your wallet or enter your wallet address</li>
                <li className="ml-4">3. View list of approvals (ERC-20, ERC-721, etc.)</li>
                <li className="ml-4">4. Find unwanted or unlimited approvals</li>
                <li className="ml-4">5. Click <strong>Revoke</strong> or &quot;Set approval to zero&quot; / &quot;Cancel approval&quot;</li>
              </ul>
      </div>

            <div className="border border-line rounded-md p-6 bg-mist">
              <h3 className="text-lg text-ink mb-4">Things to Know / Cost & Risk</h3>
              <ul className="space-y-2 text-base text-stone">
                <li>• <strong>Gas fees:</strong> Revoking approval is an on-chain transaction, so you&apos;ll pay gas (variable depending on network load)</li>
                <li>• <strong>Each revocation is a separate transaction:</strong> You can&apos;t batch all approvals in one transaction easily</li>
                <li>• <strong>Revoking doesn&apos;t affect deposited/staked tokens:</strong> If your tokens are already locked or staked, revoking approval won&apos;t remove them</li>
                <li>• <strong>Revocation is preventative, not restorative:</strong> If tokens are already stolen, revoking doesn&apos;t get them back</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Setting Up Alerts */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Setting Up Alerts</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alertTypes.map((alert) => (
              <div key={alert.type} className="border border-line rounded-md p-6 bg-white">
                <h3 className="text-lg text-ink mb-3">{alert.type}</h3>
                <p className="text-base text-stone mb-4">{alert.description}</p>
                <ul className="space-y-2 text-base text-stone">
                  {alert.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
            </ul>
          </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Security Best Practices */}
      <Section>
        <Container>
          <H2 className="mb-6">Security Best Practices</H2>
          <div className="border border-line rounded-md p-6 bg-mist">
            <h3 className="text-lg text-ink mb-4">Important Security Tips</h3>
            <ul className="space-y-2 text-base text-stone">
              {bestPractices.map((practice, index) => (
                <li key={index}>• {practice}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Troubleshooting */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Troubleshooting</H2>
          <div className="space-y-4">
            {troubleshootingItems.map((item, index) => (
              <div key={index} className="border border-line rounded-md p-6 bg-white">
                <h3 className="text-lg text-ink mb-3">{item.issue}</h3>
                <ul className="space-y-2 text-base text-stone">
                  {item.solutions.map((solution, solIndex) => (
                    <li key={solIndex}>• {solution}</li>
                  ))}
            </ul>
          </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section>
        <Container>
          <H2 className="mb-6">FAQ</H2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-line rounded-md p-6">
                <h3 className="text-lg text-ink mb-3">Q: {item.question}</h3>
                <p className="text-base text-stone">A: {item.answer}</p>
          </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Next Steps */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Next Steps</H2>
          <div className="border border-line rounded-md p-6 bg-white">
            <h3 className="text-lg text-ink mb-4">Recommended Actions</h3>
            <ul className="space-y-2 text-base text-stone mb-6">
              <li>• Use <strong>Revoke.cash</strong> to audit your current approvals: connect or enter your wallet address, inspect unlimited or high-risk approvals, revoke where needed</li>
              <li>• Enable regular alerts in Allowance Guard so you&apos;re notified of new risky permissions</li>
              <li>• Make revoking approvals part of your regular security routine</li>
              <li>• Consider using browser extension / delegate-style tools (when available) for early warning or automatic revocation triggers</li>
            </ul>
            <div className="p-4 bg-mist border border-line rounded-md">
              <p className="text-base text-ink font-medium">
                You&apos;re in control. Regular audits + careful approval management = much stronger wallet security.
        </p>
      </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}