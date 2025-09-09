'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HexButton } from '@/components/HexButton'
import { HexCard } from '@/components/HexCard'
import { HexBadge } from '@/components/HexBadge'
import { HexBackground } from '@/components/HexBackground'
import { CodeBlock } from '@/components/docs/CodeBlock'
import { FeatureCard } from '@/components/docs/FeatureCard'
import { Navigation } from '@/components/docs/Navigation'

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  return (
    <HexBackground className="min-h-screen bg-ag-bg">
      {/* Header */}
      <header className="border-b-2 border-ag-line bg-ag-panel sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <div className="relative w-8 h-8">
                 <Image
                   src="/AG_Logo2.png"
                   alt="Allowance Guard Logo"
                   width={32}
                   height={32}
                   className="w-full h-full object-contain"
                   priority
                 />
               </div>
              <h1 className="text-2xl font-bold text-ag-text">Allowance Guard</h1>
              <HexBadge variant="info" size="sm">Docs</HexBadge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-ag-muted hover:text-ag-text transition-colors">
                ← Back to App
              </Link>
              <HexButton variant="ghost" size="sm">
                GitHub
              </HexButton>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'overview' && <OverviewSection />}
            {activeSection === 'quickstart' && <QuickstartSection />}
            {activeSection === 'features' && <FeaturesSection />}
            {activeSection === 'api' && <APISection />}
            {activeSection === 'security' && <SecuritySection />}
            {activeSection === 'faq' && <FAQSection />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-ag-line bg-ag-panel mt-16">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
               <div className="relative w-8 h-8">
                 <Image
                   src="/AG_Logo2.png"
                   alt="Allowance Guard Logo"
                   width={32}
                   height={32}
                   className="w-full h-full object-contain"
                 />
               </div>
              <div>
                <h3 className="text-lg font-semibold text-ag-text">Allowance Guard</h3>
                <p className="text-sm text-ag-muted">Documentation</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center space-x-6">
                <Link href="/" className="text-ag-muted hover:text-ag-text transition-colors">
                  Back to App
                </Link>
                <a href="https://github.com/EazyAccessEA/Allowance-guard" target="_blank" rel="noopener noreferrer" className="text-ag-muted hover:text-ag-text transition-colors">
                  GitHub
                </a>
                <a href="https://discord.gg/allowanceguard" target="_blank" rel="noopener noreferrer" className="text-ag-muted hover:text-ag-text transition-colors">
                  Discord
                </a>
              </div>
              
              <div className="text-sm text-ag-muted">
                © 2024 Allowance Guard. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </HexBackground>
  )
}

function OverviewSection() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-ag-text mb-4">
          Allowance Guard Documentation
        </h1>
        <p className="text-xl text-ag-muted max-w-3xl mx-auto mb-8">
          Comprehensive guide to securing your wallet by monitoring and managing token allowances 
          across Ethereum, Arbitrum, and Base networks.
        </p>
        <div className="flex justify-center gap-4">
          <HexButton size="lg">Get Started</HexButton>
          <HexButton variant="ghost" size="lg">View on GitHub</HexButton>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon="🔍"
          title="Wallet Indexer"
          description="Automatically scans and indexes all token allowances across multiple chains with real-time updates."
        />
        <FeatureCard
          icon="⚠️"
          title="Risk Engine"
          description="Advanced risk scoring identifies unlimited allowances and stale permissions that pose security threats."
        />
        <FeatureCard
          icon="🚨"
          title="Alert Pipeline"
          description="Real-time notifications when new allowances are created or risky patterns are detected."
        />
      </div>

      {/* Core Features */}
      <HexCard eyebrow="Core Features" eyebrowColor="brand">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-ag-text mb-3">Allowance Dashboard</h3>
            <p className="text-ag-muted mb-4">
              Comprehensive view of all token allowances with risk scoring, amount tracking, 
              and spender identification across supported networks.
            </p>
            <ul className="space-y-2 text-sm text-ag-muted">
              <li>• Real-time allowance monitoring</li>
              <li>• Multi-chain support (Ethereum, Arbitrum, Base)</li>
              <li>• Risk-based categorization</li>
              <li>• Historical tracking</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ag-text mb-3">Bulk Revocation</h3>
            <p className="text-ag-muted mb-4">
              Safely revoke multiple allowances with one-click operations and immediate 
              feedback on transaction status.
            </p>
            <ul className="space-y-2 text-sm text-ag-muted">
              <li>• Batch revocation support</li>
              <li>• Progress tracking</li>
              <li>• Transaction confirmation</li>
              <li>• Error handling</li>
            </ul>
          </div>
        </div>
      </HexCard>

      {/* Time Machine */}
      <HexCard eyebrow="Time Machine" eyebrowColor="info">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-ag-text mb-4">Simulate Before You Act</h3>
          <p className="text-ag-muted mb-6 max-w-2xl mx-auto">
            Use Time Machine to simulate revoking allowances and see how it affects your 
            overall risk score without making any real transactions.
          </p>
          <div className="flex justify-center gap-4">
            <HexButton variant="info">Try Time Machine</HexButton>
            <HexButton variant="ghost">Learn More</HexButton>
          </div>
        </div>
      </HexCard>
    </div>
  )
}

function QuickstartSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ag-text mb-4">Quick Start Guide</h1>
        <p className="text-lg text-ag-muted">
          Get up and running with Allowance Guard in minutes. Follow these steps to secure your wallet.
        </p>
      </div>

      {/* Step 1 */}
      <HexCard eyebrow="Step 1" eyebrowColor="brand">
        <h3 className="text-xl font-semibold text-ag-text mb-3">Connect Your Wallet</h3>
        <p className="text-ag-muted mb-4">
          Connect your wallet using our secure Web3 connection. We support all major wallets 
          including MetaMask, WalletConnect, and Coinbase Wallet.
        </p>
        <CodeBlock language="javascript">
{`// Connect wallet using AppKit
import { createAppKit } from '@reown/appkit'

const appKit = createAppKit({
  projectId: 'your-project-id',
  networks: [mainnet, arbitrum, base],
  defaultNetwork: mainnet
})

// Open connection modal
appKit.open()`}
        </CodeBlock>
      </HexCard>

      {/* Step 2 */}
      <HexCard eyebrow="Step 2" eyebrowColor="warn">
        <h3 className="text-xl font-semibold text-ag-text mb-3">Scan Your Allowances</h3>
        <p className="text-ag-muted mb-4">
          Run a comprehensive scan to discover all token allowances across supported networks. 
          Our indexer will identify and categorize each allowance by risk level.
        </p>
        <CodeBlock language="javascript">
{`// Scan wallet allowances
const response = await fetch('/api/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: '0x...',
    chains: ['eth', 'arb', 'base']
  })
})

const { allowances, riskScore } = await response.json()`}
        </CodeBlock>
      </HexCard>

      {/* Step 3 */}
      <HexCard eyebrow="Step 3" eyebrowColor="info">
        <h3 className="text-xl font-semibold text-ag-text mb-3">Review and Revoke</h3>
        <p className="text-ag-muted mb-4">
          Review the risk analysis and revoke dangerous allowances. Use Time Machine to 
          simulate changes before making real transactions.
        </p>
        <CodeBlock language="javascript">
{`// Revoke allowance
const revokeTx = await writeContract({
  address: tokenAddress,
  abi: erc20Abi,
  functionName: 'approve',
  args: [spenderAddress, 0n] // Set to 0 to revoke
})

// Or use bulk revocation
const bulkRevoke = await fetch('/api/revoke/bulk', {
  method: 'POST',
  body: JSON.stringify({ allowances: selectedAllowances })
})`}
        </CodeBlock>
      </HexCard>

      {/* Next Steps */}
      <HexCard eyebrow="Next Steps" eyebrowColor="info">
        <h3 className="text-xl font-semibold text-ag-text mb-4">What&apos;s Next?</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-ag-text mb-2">Enable Alerts</h4>
            <p className="text-sm text-ag-muted">
              Set up real-time notifications for new allowances and risk changes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ag-text mb-2">API Integration</h4>
            <p className="text-sm text-ag-muted">
              Integrate Allowance Guard into your dApp or security workflow.
            </p>
          </div>
        </div>
      </HexCard>
    </div>
  )
}

function FeaturesSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ag-text mb-4">Features</h1>
        <p className="text-lg text-ag-muted">
          Comprehensive security features designed to protect your digital assets.
        </p>
      </div>

      {/* Risk Engine */}
      <HexCard eyebrow="Risk Engine" eyebrowColor="warn">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-ag-text mb-3">Advanced Risk Scoring</h3>
            <p className="text-ag-muted mb-4">
              Our risk engine analyzes allowance patterns to identify potential security threats 
              and categorize them by risk level.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <HexBadge variant="danger" size="sm">HIGH</HexBadge>
                <span className="text-sm text-ag-muted">Unlimited allowances</span>
              </div>
              <div className="flex items-center gap-3">
                <HexBadge variant="warn" size="sm">MEDIUM</HexBadge>
                <span className="text-sm text-ag-muted">Stale permissions</span>
              </div>
              <div className="flex items-center gap-3">
                <HexBadge variant="info" size="sm">LOW</HexBadge>
                <span className="text-sm text-ag-muted">Standard usage</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-ag-text mb-3">Risk Factors</h4>
            <ul className="space-y-2 text-sm text-ag-muted">
              <li>• Allowance amount vs. token balance</li>
              <li>• Time since last interaction</li>
              <li>• Spender reputation and history</li>
              <li>• Network activity patterns</li>
              <li>• Smart contract analysis</li>
            </ul>
          </div>
        </div>
      </HexCard>

      {/* Multi-Chain Support */}
      <HexCard eyebrow="Multi-Chain" eyebrowColor="brand">
        <h3 className="text-xl font-semibold text-ag-text mb-3">Cross-Chain Monitoring</h3>
        <p className="text-ag-muted mb-4">
          Monitor allowances across multiple blockchain networks with unified risk scoring.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 border-2 border-ag-line">
            <div className="text-2xl mb-2">⟠</div>
            <div className="font-semibold text-ag-text">Ethereum</div>
            <div className="text-sm text-ag-muted">Mainnet</div>
          </div>
          <div className="text-center p-4 border-2 border-ag-line">
            <div className="text-2xl mb-2">🔷</div>
            <div className="font-semibold text-ag-text">Arbitrum</div>
            <div className="text-sm text-ag-muted">L2 Scaling</div>
          </div>
          <div className="text-center p-4 border-2 border-ag-line">
            <div className="text-2xl mb-2">🔵</div>
            <div className="font-semibold text-ag-text">Base</div>
            <div className="text-sm text-ag-muted">Coinbase L2</div>
          </div>
        </div>
      </HexCard>

      {/* Time Machine */}
      <HexCard eyebrow="Time Machine" eyebrowColor="info">
        <h3 className="text-xl font-semibold text-ag-text mb-3">Simulation Mode</h3>
        <p className="text-ag-muted mb-4">
          Test allowance changes without risk. Time Machine lets you simulate revoking 
          allowances and see the impact on your security score.
        </p>
        <div className="bg-ag-panel p-4 border-2 border-ag-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-ag-text">Simulation Mode Active</span>
            <HexBadge variant="info" size="sm">LIVE</HexBadge>
          </div>
          <p className="text-xs text-ag-muted">
            Changes are simulated only. No real transactions will be made.
          </p>
        </div>
      </HexCard>
    </div>
  )
}

function APISection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ag-text mb-4">API Reference</h1>
        <p className="text-lg text-ag-muted">
          Complete API documentation for integrating Allowance Guard into your applications.
        </p>
      </div>

      {/* Authentication */}
      <HexCard eyebrow="Authentication" eyebrowColor="brand">
        <h3 className="text-xl font-semibold text-ag-text mb-3">API Keys</h3>
        <p className="text-ag-muted mb-4">
          All API requests require authentication using your project API key.
        </p>
        <CodeBlock language="bash">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.allowanceguard.com/v1/allowances`}
        </CodeBlock>
      </HexCard>

      {/* Endpoints */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-ag-text">Endpoints</h2>
        
        <HexCard>
          <div className="flex items-center gap-3 mb-3">
            <HexBadge variant="brand" size="sm">GET</HexBadge>
            <code className="text-ag-text font-mono">/api/allowances</code>
          </div>
          <p className="text-ag-muted mb-3">Retrieve all allowances for a wallet address.</p>
          <CodeBlock language="javascript">
{`const response = await fetch('/api/allowances?wallet=0x...')
const allowances = await response.json()`}
          </CodeBlock>
        </HexCard>

        <HexCard>
          <div className="flex items-center gap-3 mb-3">
            <HexBadge variant="warn" size="sm">POST</HexBadge>
            <code className="text-ag-text font-mono">/api/scan</code>
          </div>
          <p className="text-ag-muted mb-3">Initiate a new allowance scan for a wallet.</p>
          <CodeBlock language="javascript">
{`const response = await fetch('/api/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: '0x...',
    chains: ['eth', 'arb', 'base']
  })
})`}
          </CodeBlock>
        </HexCard>

        <HexCard>
          <div className="flex items-center gap-3 mb-3">
            <HexBadge variant="info" size="sm">POST</HexBadge>
            <code className="text-ag-text font-mono">/api/risk/refresh</code>
          </div>
          <p className="text-ag-muted mb-3">Refresh risk scores for a wallet&apos;s allowances.</p>
          <CodeBlock language="javascript">
{`const response = await fetch('/api/risk/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ wallet: '0x...' })
})`}
          </CodeBlock>
        </HexCard>
      </div>
    </div>
  )
}

function SecuritySection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ag-text mb-4">Security</h1>
        <p className="text-lg text-ag-muted">
          Security is our top priority. Learn about our security measures and best practices.
        </p>
      </div>

      <HexCard eyebrow="Security Measures" eyebrowColor="danger">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-ag-text mb-3">Data Protection</h3>
            <ul className="space-y-2 text-sm text-ag-muted">
              <li>• End-to-end encryption for all data</li>
              <li>• No private keys stored or transmitted</li>
              <li>• Read-only blockchain access</li>
              <li>• GDPR compliant data handling</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ag-text mb-3">Audit & Compliance</h3>
            <ul className="space-y-2 text-sm text-ag-muted">
              <li>• Regular security audits</li>
              <li>• Bug bounty program</li>
              <li>• Open source components</li>
              <li>• SOC 2 Type II certified</li>
            </ul>
          </div>
        </div>
      </HexCard>

      <HexCard eyebrow="Best Practices" eyebrowColor="info">
        <h3 className="text-xl font-semibold text-ag-text mb-3">Security Best Practices</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-ag-text mb-2">Regular Monitoring</h4>
            <p className="text-sm text-ag-muted">
              Check your allowances regularly and revoke unused permissions immediately.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ag-text mb-2">Principle of Least Privilege</h4>
            <p className="text-sm text-ag-muted">
              Only approve the minimum amount necessary for dApp functionality.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ag-text mb-2">Verify Spenders</h4>
            <p className="text-sm text-ag-muted">
              Always verify the spender address matches the intended dApp or service.
            </p>
          </div>
        </div>
      </HexCard>
    </div>
  )
}

function FAQSection() {
  const faqs = [
    {
      question: "What is a token allowance?",
      answer: "A token allowance is permission you give to a smart contract to spend your tokens on your behalf. This is required for dApps to interact with your tokens."
    },
    {
      question: "Why should I monitor my allowances?",
      answer: "Unused or excessive allowances can be security risks. Malicious actors could potentially exploit them to drain your tokens."
    },
    {
      question: "Is it safe to revoke allowances?",
      answer: "Yes, revoking allowances is safe and only removes permissions. It doesn&apos;t affect your token balance or other wallet functions."
    },
    {
      question: "How often should I check my allowances?",
      answer: "We recommend checking monthly or after using new dApps. Enable alerts for real-time monitoring of new allowances."
    },
    {
      question: "What networks are supported?",
      answer: "Currently we support Ethereum mainnet, Arbitrum, and Base. More networks will be added based on user demand."
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ag-text mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-ag-muted">
          Common questions about Allowance Guard and token allowance security.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <HexCard key={index}>
            <h3 className="text-lg font-semibold text-ag-text mb-2">{faq.question}</h3>
            <p className="text-ag-muted">{faq.answer}</p>
          </HexCard>
        ))}
      </div>

      <HexCard eyebrow="Need Help?" eyebrowColor="info">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-ag-text mb-3">Still have questions?</h3>
          <p className="text-ag-muted mb-4">
            Our support team is here to help. Reach out through our community channels.
          </p>
          <div className="flex justify-center gap-4">
            <HexButton variant="info">Discord</HexButton>
            <HexButton variant="ghost">GitHub Issues</HexButton>
          </div>
        </div>
      </HexCard>
    </div>
  )
}
