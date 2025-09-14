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
    { id: 'core-concepts', title: 'Core Concepts', icon: Shield },
    { id: 'usage-guides', title: 'Usage Guides', icon: Wrench },
    { id: 'advanced-topics', title: 'Advanced Topics', icon: Settings },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: HelpCircle }
  ]

  const supportedNetworks = [
    { name: "Ethereum", chainId: 1, status: "Full Support" },
    { name: "Arbitrum", chainId: 42161, status: "Full Support" },
    { name: "Base", chainId: 8453, status: "Full Support" }
  ]

  // const riskFactors = [
  //   { factor: "Unlimited Approvals", score: "+50", description: "Contract can spend any amount" },
  //   { factor: "Stale Approvals", score: "+10", description: "Unused for extended periods" },
  //   { factor: "High Value", score: "Variable", description: "Significant financial exposure" },
  //   { factor: "Unknown Spenders", score: "Variable", description: "Unverified contracts" }
  // ]

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
              <h2 id="overview" className="text-2xl font-semibold text-ink mb-4">Allowance Guard Documentation</h2>
              <p className="text-lg text-stone leading-relaxed mb-8">
                Welcome to the Allowance Guard documentation. This comprehensive guide empowers you to take complete control of your Web3 security by understanding, managing, and securing your token approvals. Whether you&apos;re new to DeFi or a seasoned developer, these docs will help you maximize your security and trust in the platform.
              </p>
              
              <h3 id="quick-links" className="text-xl font-semibold text-ink mb-4">Quick Links</h3>
              <div className="space-y-2 text-base text-stone mb-8">
                <p><strong>Getting Started:</strong> What Are Token Allowances? • What This Tool Does (And Does Not Do) • Connecting Your Wallet: A Step-by-Step Guide</p>
                <p><strong>Core Concepts:</strong> How We Calculate Risk Scores • The Revocation Process Explained • Data Privacy and Security</p>
                <p><strong>Usage Guides:</strong> How to Interpret Your Allowance Dashboard • How to Revoke a Single Allowance • How to Batch Revoke Allowances</p>
                <p><strong>Advanced Topics:</strong> Allowance Guard&apos;s Architecture • Smart Contract Integration • API Reference (Public)</p>
                <p><strong>Support & Troubleshooting:</strong> Common Issues and Solutions • Glossary of Terms • Getting Help</p>
              </div>
              
              <h3 id="what-is-allowanceguard" className="text-xl font-semibold text-ink mb-3">What is Allowance Guard?</h3>
              <p className="text-base text-stone mb-6">
                Allowance Guard is a non-custodial security platform that provides comprehensive oversight of your wallet&apos;s token approvals across multiple blockchain networks. Built to PuredgeOS clarity-first standards, it empowers users to identify, assess, and neutralize security risks posed by forgotten or malicious token allowances. The platform serves as a critical security infrastructure for the Web3 ecosystem, helping users maintain control over their digital assets while navigating the complex landscape of decentralized applications.
              </p>
              
              <h3 id="key-features" className="text-xl font-semibold text-ink mb-3">Key Features</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">Comprehensive Network Coverage</h4>
                  <p className="text-base text-stone">Full support for Ethereum, Arbitrum, and Base networks with continuous expansion to additional EVM-compatible chains based on user demand and security considerations.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Advanced Risk Intelligence</h4>
                  <p className="text-base text-stone">Real-time threat intelligence powered by rule-based algorithms that identify unlimited approvals, malicious contracts, anomalous patterns, and high-risk spender addresses.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Non-Custodial Security</h4>
                  <p className="text-base text-stone">Complete user control with no custody risk. All transactions are executed directly from your wallet with your explicit approval. We never hold your private keys or funds.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Gas-Optimized Operations</h4>
                  <p className="text-base text-stone">Batch revocation capabilities and smart contract optimization to minimize gas costs while maximizing security effectiveness through efficient transaction batching.</p>
                </div>
              </div>
              
              <h3 id="how-it-works" className="text-xl font-semibold text-ink mb-3">How It Works</h3>
              <div className="space-y-4 text-base text-stone">
                <p><strong>1. Connect & Scan:</strong> Securely connect your wallet using industry-standard protocols. We read public blockchain data to identify all token approvals associated with your address across supported networks.</p>
                <p><strong>2. Analyze & Assess:</strong> Our risk engine evaluates each approval using multiple heuristics including allowance amounts, contract reputation, time since last interaction, and threat intelligence data.</p>
                <p><strong>3. Review & Understand:</strong> View your complete security posture in a clarity-first dashboard that presents actionable information without jargon or confusion.</p>
                <p><strong>4. Act & Secure:</strong> Revoke risky approvals with one-click operations that execute directly from your wallet, maintaining complete control over your assets.</p>
                <p><strong>5. Monitor & Protect:</strong> Set up autonomous monitoring and alerts to maintain continuous security oversight and receive notifications about new approvals or changes.</p>
               </div>
            </div>
          </div>
        )

      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="getting-started" className="text-2xl font-semibold text-ink mb-4">Getting Started with Allowance Guard</h2>
              
              <h3 id="what-are-token-allowances" className="text-xl font-semibold text-ink mb-3">What Are Token Allowances?</h3>
              <p className="text-base text-stone mb-6">
                Think of a token allowance like giving a valet a specific car key, not your entire keyring. When you interact with DeFi protocols like Uniswap or NFT marketplaces like OpenSea, you grant them permission to spend specific amounts of your tokens. This is necessary for the dApp to function - for example, Uniswap needs permission to swap your USDC for ETH. However, these permissions persist even after you&apos;re done using the dApp, creating potential security risks if left unchecked. An allowance is essentially a standing order that says &quot;this smart contract can spend up to X amount of my tokens.&quot;
              </p>
              
              <h3 id="what-this-tool-does" className="text-xl font-semibold text-ink mb-3">What This Tool Does (And Does Not Do)</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">What Allowance Guard Does:</h4>
                  <p className="text-base text-stone">Scans your wallet across multiple blockchain networks to identify all token approvals, displays them in an easy-to-understand dashboard, assesses each approval for potential security risks, provides one-click revocation tools to remove dangerous permissions, and offers monitoring and alert systems to notify you of new approvals.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">What Allowance Guard Does NOT Do:</h4>
                  <p className="text-base text-stone">Cannot move your funds or access your private keys, cannot prevent all types of scams or security threats, cannot recover funds that have already been stolen, cannot automatically revoke approvals without your explicit permission, and cannot access any information beyond what is publicly available on the blockchain.</p>
                </div>
              </div>
              
              <h3 id="connecting-your-wallet" className="text-xl font-semibold text-ink mb-3">Connecting Your Wallet: A Step-by-Step Guide</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">Step 1: Click &quot;Connect Wallet&quot;</h4>
                  <p className="text-base text-stone">On the Allowance Guard homepage, click the &quot;Connect Wallet&quot; button. This will open a modal showing supported wallet options including MetaMask, WalletConnect, and other EVM-compatible wallets.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Step 2: Select Your Wallet Provider</h4>
                  <p className="text-base text-stone">Choose your preferred wallet from the list. If you&apos;re using MetaMask, it will prompt you to connect. If using WalletConnect, you&apos;ll see a QR code to scan with your mobile wallet.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Step 3: Approve the Connection</h4>
                  <p className="text-base text-stone">Your wallet will show a connection request. This request only asks for permission to read your public wallet address and view your token balances. It does NOT request permission to move your funds or access your private keys. Click &quot;Connect&quot; or &quot;Approve&quot; in your wallet.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">What the Connection Means:</h4>
                  <p className="text-base text-stone">The connection establishes a read-only link between Allowance Guard and your wallet. We can see your public address and the allowances associated with it, but we cannot sign transactions, move funds, or access any private information. You maintain complete control over all transactions and approvals.</p>
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
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-cobalt" />
                    </div>
              <div>
                      <h4 className="text-lg font-semibold text-ink">{network.name}</h4>
                    <p className="text-sm text-stone">Chain ID: {network.chainId}</p>
              </div>
                  </div>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-cobalt/10 text-cobalt border border-cobalt/20">
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
              <h2 id="risk-scoring-system" className="text-2xl font-semibold text-ink mb-4">How We Calculate Risk Scores</h2>
              <p className="text-base text-stone mb-6">
                Our risk scoring system uses a transparent, rule-based approach that evaluates each token approval against multiple security heuristics. This system is designed to err on the side of caution, flagging potentially risky allowances for your review rather than missing actual threats. The scoring algorithm is continuously refined based on new threat intelligence and user feedback.
              </p>
              
              <h3 id="risk-heuristics" className="text-xl font-semibold text-ink mb-3">Risk Heuristic Rules</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">Unlimited Approvals (+50 points)</h4>
                  <p className="text-base text-stone">Allowances set to the maximum possible value (2^256-1) that grant unlimited spending power. These represent the highest risk as they allow malicious contracts to drain entire token balances. The system flags any approval where the amount equals or exceeds the maximum uint256 value.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Malicious Address List Match (+40 points)</h4>
                  <p className="text-base text-stone">Spender contracts that appear on known malicious address lists maintained by security researchers, blockchain analysis firms, and community reports. Our threat intelligence database is continuously updated from multiple sources including DeFi security teams and exploit tracking services.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Unverified Contract Source (+20 points)</h4>
                  <p className="text-base text-stone">Contracts that lack verified source code on Etherscan or other block explorers. While not inherently malicious, unverified contracts cannot be audited for security vulnerabilities and represent an unknown risk factor.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Anomalous Approval Amount (+15 points)</h4>
                  <p className="text-base text-stone">Approvals that are significantly larger than typical usage patterns for the specific token or protocol. The system compares approval amounts against historical data and user holdings to identify suspiciously large allowances.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Stale Approvals (+10 points)</h4>
                  <p className="text-base text-stone">Approvals that have been unused for extended periods (typically 90+ days) without corresponding transaction activity. Stale approvals increase attack surface and may indicate forgotten or abandoned permissions.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">High-Value Exposure (+5-25 points)</h4>
                  <p className="text-base text-stone">Approvals involving significant token values relative to the user&apos;s total holdings. The risk score increases proportionally with the financial exposure, with larger amounts receiving higher risk scores.</p>
        </div>
      </div>
              
              <h3 id="risk-levels" className="text-xl font-semibold text-ink mb-3">Risk Level Classifications</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">High Risk (80+ points)</h4>
                  <p className="text-base text-stone">Immediate action strongly recommended. These approvals pose significant security threats and should be revoked as soon as possible. High-risk approvals typically involve unlimited amounts, known malicious contracts, or combinations of multiple risk factors.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Medium Risk (40-79 points)</h4>
                  <p className="text-base text-stone">Review recommended. These approvals may pose moderate security risks and should be evaluated based on your specific use case. Consider whether the approval is still needed and if the spender contract is trustworthy.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Low Risk (0-39 points)</h4>
                  <p className="text-base text-stone">Generally safe. These approvals appear to be from trusted sources with reasonable amounts and recent activity. However, we recommend periodic review to ensure they remain appropriate for your security needs.</p>
      </div>
          </div>
              
              <h3 id="threat-intelligence" className="text-xl font-semibold text-ink mb-3">Threat Intelligence Sources</h3>
              <p className="text-base text-stone mb-4">
                Our risk assessment system integrates threat intelligence from multiple sources to ensure comprehensive coverage of emerging threats. These sources include security research teams, blockchain analysis firms, community reports, and automated monitoring of exploit patterns. The system continuously updates its knowledge base to stay ahead of new attack vectors and malicious contract deployments.
              </p>
            </div>
          </div>
        )

      case 'core-concepts':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="core-concepts" className="text-2xl font-semibold text-ink mb-4">Understanding Core Concepts</h2>
              
              <h3 id="revocation-process" className="text-xl font-semibold text-ink mb-3">The Revocation Process Explained</h3>
              <p className="text-base text-stone mb-6">
                When you revoke an allowance, you are executing a blockchain transaction that sets the spending limit for that specific token and contract to zero. This is accomplished by calling the standard ERC-20 &apos;approve(spender, 0)&apos; function or the ERC-721 &apos;setApprovalForAll(spender, false)&apos; function. These are the same functions used by all legitimate DeFi applications and have been extensively tested by the broader Ethereum community. The transaction requires gas fees because it must be processed and confirmed by the network validators. Once confirmed, the smart contract can no longer access those tokens unless you explicitly grant a new allowance.
              </p>
              
              <h3 id="data-privacy-security" className="text-xl font-semibold text-ink mb-3">Data Privacy and Security</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">What Data We Fetch</h4>
                  <p className="text-base text-stone">We only access public on-chain data including your wallet address, token balances, and allowance information. This data is already publicly available on the blockchain and can be viewed by anyone using block explorers like Etherscan. We do not access any private information, transaction history beyond allowances, or personal data.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">What Data We Store</h4>
                  <p className="text-base text-stone">We cache allowance data temporarily to improve performance and reduce API calls. This cached data is encrypted at rest using AES-256 encryption and is automatically purged after defined retention periods. We also collect anonymized usage telemetry to improve the product, but this data cannot be linked to individual users or wallet addresses.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">What We Never Store</h4>
                  <p className="text-base text-stone">We never store private keys, seed phrases, personal information, or any data that could compromise your security. Your private keys never leave your device, and we cannot access your funds under any circumstances. All transactions are signed locally by your wallet, maintaining complete user control.</p>
                </div>
              </div>
              
              <h3 id="non-custodial-nature" className="text-xl font-semibold text-ink mb-3">Non-Custodial Security Model</h3>
              <p className="text-base text-stone mb-4">
                Allowance Guard operates on a strict non-custodial model, meaning we never hold your private keys, funds, or sensitive credentials. All security operations are executed directly from your wallet with your explicit approval. This model ensures that you maintain complete control over your assets while benefiting from our security analysis and risk assessment tools. The platform serves as a security advisor and tool provider, not a custodian or intermediary for your funds.
              </p>
            </div>
          </div>
        )

      case 'usage-guides':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="usage-guides" className="text-2xl font-semibold text-ink mb-4">How-To Guides</h2>
              
              <h3 id="interpret-dashboard" className="text-xl font-semibold text-ink mb-3">How to Interpret Your Allowance Dashboard</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">Token Column</h4>
                  <p className="text-base text-stone">Shows the specific token that has been approved, including the token symbol, name, and contract address. Click on the token name to view additional details and verify the contract address on block explorers.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Spender Column</h4>
                  <p className="text-base text-stone">Displays the smart contract address that has permission to spend your tokens. This is the contract you granted the allowance to, such as a DEX router or NFT marketplace. Verify this address matches the intended protocol.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Amount Column</h4>
                  <p className="text-base text-stone">Shows the approved spending amount. Look for &quot;Unlimited&quot; which indicates the maximum possible allowance (2^256-1), representing the highest security risk. Specific amounts show the exact token quantity the contract can spend.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Risk Score Column</h4>
                  <p className="text-base text-stone">Displays the calculated risk score based on our heuristic analysis. High scores (80+) require immediate attention, medium scores (40-79) should be reviewed, and low scores (0-39) are generally safe but worth periodic review.</p>
                </div>
              </div>
              
              <h3 id="revoke-single-allowance" className="text-xl font-semibold text-ink mb-3">How to Revoke a Single Allowance</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">Step 1: Identify the Allowance</h4>
                  <p className="text-base text-stone">Review your allowance list and identify the approval you want to revoke. Pay special attention to high-risk scores and unlimited allowances that pose immediate security threats.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Step 2: Click the Revoke Button</h4>
                  <p className="text-base text-stone">Click the &quot;Revoke&quot; button next to the specific allowance. This will prepare a transaction that sets the allowance amount to zero, completely removing the contract&apos;s spending permission.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Step 3: Review the Transaction</h4>
                  <p className="text-base text-stone">Your wallet will display the transaction details including the gas fee estimate. Review the spender address and token to ensure you&apos;re revoking the correct allowance. The transaction will call the approve function with a zero amount.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Step 4: Confirm and Sign</h4>
                  <p className="text-base text-stone">Confirm the transaction in your wallet and pay the required gas fee. Once the transaction is confirmed on the blockchain, the allowance will be set to zero and the security risk will be eliminated.</p>
                </div>
              </div>
              
              <h3 id="batch-revoke-allowances" className="text-xl font-semibold text-ink mb-3">How to Batch Revoke Allowances</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">Select Multiple Allowances</h4>
                  <p className="text-base text-stone">Use the checkboxes to select multiple allowances you want to revoke. This is particularly useful for cleaning up multiple stale or risky approvals in a single transaction, saving significant gas costs.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Batch Revoke Operation</h4>
                  <p className="text-base text-stone">Click the &quot;Batch Revoke&quot; button to prepare a single transaction that revokes all selected allowances. Our smart contract optimization ensures maximum gas efficiency by batching multiple revocation operations.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Gas Optimization Benefits</h4>
                  <p className="text-base text-stone">Batch operations can reduce gas costs by up to 70% compared to individual revocations, as you only pay the base transaction fee once instead of multiple times. This makes it cost-effective to clean up many allowances simultaneously.</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'advanced-topics':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="advanced-topics" className="text-2xl font-semibold text-ink mb-4">Advanced Topics</h2>
              
              <h3 id="architecture" className="text-xl font-semibold text-ink mb-3">Allowance Guard&apos;s Architecture</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">Frontend Layer</h4>
                  <p className="text-base text-stone">Built with Next.js and React, providing a responsive, client-side interface that connects directly to user wallets via MetaMask and WalletConnect protocols. The frontend handles wallet connections, transaction signing, and user interactions while maintaining complete non-custodial security.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Backend API</h4>
                  <p className="text-base text-stone">Node.js-based API layer that processes scan requests, manages job queues, and provides allowance data. The backend coordinates with blockchain RPC providers and maintains cached data for performance optimization while ensuring data freshness and accuracy.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Blockchain Indexer</h4>
                  <p className="text-base text-stone">Custom indexing system that scans blockchain data to identify token approvals and contract interactions. The indexer processes historical data and maintains real-time updates to ensure comprehensive coverage of all allowance-related activities across supported networks.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Risk Engine</h4>
                  <p className="text-base text-stone">Rule-based risk assessment system that evaluates allowances against multiple security heuristics. The engine integrates threat intelligence feeds, maintains malicious address databases, and provides transparent risk scoring that users can understand and trust.</p>
                </div>
              </div>
              
              <h3 id="smart-contract-integration" className="text-xl font-semibold text-ink mb-3">Smart Contract Integration</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">Standard ERC Functions</h4>
                  <p className="text-base text-stone">Allowance Guard uses only standard, well-audited ERC-20 and ERC-721 functions for revocation operations. We do not deploy custom smart contracts that could introduce additional attack vectors. All operations use the standard approve(spender, 0) and setApprovalForAll(spender, false) functions.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Batch Revoke Contract</h4>
                  <p className="text-base text-stone">For gas optimization, we provide a verified batch revocation contract that allows multiple allowances to be revoked in a single transaction. The contract address and ABI are publicly available for transparency and can be verified on block explorers.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Developer Integration</h4>
                  <p className="text-base text-stone">Developers can integrate directly with our APIs or use our smart contracts for their own applications. We provide comprehensive documentation, code examples, and support for web3.js, ethers.js, and other popular blockchain libraries.</p>
                </div>
              </div>
              
              <h3 id="api-reference" className="text-xl font-semibold text-ink mb-3">API Reference (Public)</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">Scan Endpoint</h4>
                  <p className="text-base text-stone">POST /api/scan - Queue a wallet scan job. Accepts wallet address and network parameters. Returns job ID for status tracking. Rate limited to prevent abuse while ensuring responsive service for legitimate users.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Allowances Endpoint</h4>
                  <p className="text-base text-stone">GET /api/allowances - Retrieve paginated allowance data for a wallet. Supports filtering by risk level, network, and token type. Returns structured data with risk scores and metadata for easy integration.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Job Status Endpoint</h4>
                  <p className="text-base text-stone">GET /api/jobs/[id] - Check the status of a scan job. Returns current progress, completion status, and any error messages. Essential for implementing proper loading states and error handling in client applications.</p>
                </div>
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
                        <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-cobalt" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-ink mb-2">{alert.type}</h4>
                          <p className="text-base text-stone mb-4">{alert.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm text-stone">
                        {alert.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-cobalt rounded-full mt-2 flex-shrink-0"></span>
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
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-cobalt" />
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
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-cobalt" />
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
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Settings className="w-6 h-6 text-cobalt" />
                    </div>
                    <div>
                      <h3 id="configuration" className="text-xl font-semibold text-ink mb-3">Configuration</h3>
                    </div>
                  </div>
                  <p className="text-base text-stone mb-4 ml-16">You can configure monitoring settings in the sidebar:</p>
                  <ul className="space-y-2 text-base text-stone ml-16">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-cobalt rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>Enable/Disable:</strong> Turn monitoring on or off for each wallet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-cobalt rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>Frequency:</strong> Set rescan interval (minimum 30 minutes)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-cobalt rounded-full mt-2 flex-shrink-0"></span>
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
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-cobalt" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Owner</h4>
                      <p className="text-base text-stone">Full control over the team, including adding/removing members, managing wallets, and inviting collaborators.</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-cobalt" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Admin</h4>
                      <p className="text-base text-stone">Can manage team members, add wallets, and invite users. Cannot remove the owner.</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Settings className="w-6 h-6 text-cobalt" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Editor</h4>
                      <p className="text-base text-stone">Can add wallets to the team and invite viewers. Can revoke approvals and manage monitoring settings.</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Search className="w-6 h-6 text-cobalt" />
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
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-cobalt" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Shared Wallets</h4>
                      <p className="text-base text-stone">Add multiple wallet addresses to a team for centralized monitoring</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-cobalt" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Email Invites</h4>
                      <p className="text-base text-stone">Invite team members via secure email links with role-based access</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-cobalt" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Role-Based Access</h4>
                      <p className="text-base text-stone">Control permissions with owner, admin, editor, and viewer roles</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-line rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-cobalt" />
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
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lock className="w-6 h-6 text-cobalt" />
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
                    <div className="w-12 h-12 bg-cobalt/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-cobalt" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-ink mb-2">Important Notes</h4>
                    </div>
                  </div>
                  <ul className="space-y-2 text-base text-stone ml-16">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-cobalt rounded-full mt-2 flex-shrink-0"></span>
                      <span>Each revocation requires a separate transaction and gas fee</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-cobalt rounded-full mt-2 flex-shrink-0"></span>
                      <span>Revoking doesn&apos;t affect already deposited or staked tokens</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-cobalt rounded-full mt-2 flex-shrink-0"></span>
                      <span>Some dApps may require you to re-approve for continued functionality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-cobalt rounded-full mt-2 flex-shrink-0"></span>
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
              <h2 id="troubleshooting" className="text-2xl font-semibold text-ink mb-4">Support & Troubleshooting</h2>
              
              <h3 id="common-issues" className="text-xl font-semibold text-ink mb-3">Common Issues and Solutions</h3>
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="font-medium text-ink mb-2">Why can&apos;t I see my allowances?</h4>
                  <p className="text-base text-stone">This could indicate several scenarios. First, you may genuinely have no token approvals, which is actually a good security posture. Second, there might be a network connectivity issue preventing the scan from completing. Third, the blockchain indexer might be experiencing delays. Try switching networks, refreshing the page, or reconnecting your wallet. If the problem persists, contact support with your wallet address and network information.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Why did my transaction fail?</h4>
                  <p className="text-base text-stone">Transaction failures are typically due to insufficient gas fees, network congestion, or nonce conflicts. Ensure you have enough ETH in your wallet to cover gas costs, and consider increasing the gas price for faster confirmation during network congestion. If the transaction fails due to a nonce issue, wait a few minutes before retrying. Some contracts may also require specific revocation methods or have additional security measures that prevent standard revocation.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Why is a known protocol flagged as risky?</h4>
                  <p className="text-base text-stone">Our risk engine uses multiple heuristics that may flag legitimate protocols for various reasons. A protocol might be flagged if it has unlimited approvals, unverified source code, or appears on security watchlists due to past incidents. The risk score is designed to err on the side of caution, encouraging users to review each approval individually. You can still use the protocol while being aware of the associated risks, or consider revoking the approval if you no longer need it.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Why is my scan taking so long?</h4>
                  <p className="text-base text-stone">Scan duration depends on several factors including the number of approvals, network congestion, and blockchain indexer performance. Wallets with extensive transaction history or many approvals may take several minutes to scan completely. The system processes scans in the background using a job queue, so you can continue using the application while the scan completes. If a scan appears stuck, try refreshing the page or reconnecting your wallet.</p>
                </div>
              </div>
              
              <h3 id="glossary" className="text-xl font-semibold text-ink mb-3">Glossary of Terms</h3>
              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-medium text-ink mb-2">Allowance</h4>
                  <p className="text-base text-stone">A permission granted to a smart contract to spend a specific amount of your tokens. This is necessary for DeFi interactions but can become a security risk if left unchecked.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Revocation</h4>
                  <p className="text-base text-stone">The process of setting an allowance to zero, completely removing a contract&apos;s ability to spend your tokens. This is accomplished through a blockchain transaction.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Gas</h4>
                  <p className="text-base text-stone">The fee required to execute transactions on the Ethereum blockchain. Gas fees are paid to network validators and vary based on network congestion and transaction complexity.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Spender</h4>
                  <p className="text-base text-stone">The smart contract address that has been granted permission to spend your tokens. This is typically a DEX router, NFT marketplace, or other DeFi protocol.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">dApp</h4>
                  <p className="text-base text-stone">Decentralized application - a blockchain-based application that operates without central authority, typically requiring token approvals for functionality.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Non-Custodial</h4>
                  <p className="text-base text-stone">A security model where users maintain complete control over their private keys and funds, with no third party having access to their assets.</p>
                </div>
              </div>
              
              <h3 id="getting-help" className="text-xl font-semibold text-ink mb-3">Getting Help</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-ink mb-2">Technical Support</h4>
                  <p className="text-base text-stone">For technical issues, feature requests, or general questions, contact our support team at support@allowanceguard.com. We typically respond within 24 hours and can help with wallet connection issues, transaction problems, or platform-specific questions.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Bug Reports</h4>
                  <p className="text-base text-stone">If you encounter a bug or unexpected behavior, please report it on our GitHub repository with detailed information including your browser, wallet type, network, and steps to reproduce the issue. This helps us quickly identify and fix problems.</p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Community Updates</h4>
                  <p className="text-base text-stone">Follow us on X for platform updates, security alerts, and community discussions. We regularly share security tips, new feature announcements, and important updates about the Web3 security landscape.</p>
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
                              ? 'bg-cobalt text-white'
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