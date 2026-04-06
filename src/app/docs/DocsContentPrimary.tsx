import { Globe } from 'lucide-react'
import { supportedNetworks } from './docs-data'

interface Props { section: string }

/** Docs content sections: overview through advanced-topics */
export default function DocsContentPrimary({ section }: Props) {
  switch (section) {
      case 'overview':
  return (
          <div className="space-y-8">
            <div>
              <h2 id="overview" className="text-2xl font-semibold text-text-primary dark:text-secondary-100 mb-4">Allowance Guard Documentation</h2>
              <p className="text-lg text-text-secondary dark:text-secondary-400 leading-relaxed mb-8">
                Welcome to the Allowance Guard documentation. This comprehensive guide empowers you to take complete control of your Web3 security by understanding, managing, and securing your token approvals. Whether you&apos;re new to DeFi or a seasoned developer, these docs will help you maximize your security and trust in the platform.
              </p>
              
              <h3 id="quick-links" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-4">Quick Links</h3>
              <div className="space-y-2 text-base text-text-secondary dark:text-secondary-400 mb-8">
                <p><strong>Getting Started:</strong> What Are Token Allowances? • What This Tool Does (And Does Not Do) • Connecting Your Wallet: A Step-by-Step Guide</p>
                <p><strong>Core Concepts:</strong> How We Calculate Risk Scores • The Revocation Process Explained • Data Privacy and Security</p>
                <p><strong>Usage Guides:</strong> How to Interpret Your Allowance Dashboard • How to Revoke a Single Allowance • How to Batch Revoke Allowances • Token Discovery & Search</p>
                <p><strong>Advanced Topics:</strong> Allowance Guard&apos;s Architecture • Smart Contract Integration • API Reference (Public)</p>
                <p><strong>Support & Troubleshooting:</strong> Common Issues and Solutions • Glossary of Terms • Getting Help</p>
              </div>
              
              <h3 id="what-is-allowanceguard" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">What is Allowance Guard?</h3>
              <p className="text-base text-text-secondary dark:text-secondary-400 mb-6">
                Allowance Guard is a non-custodial security platform that provides comprehensive oversight of your wallet&apos;s token approvals across multiple blockchain networks. Built to PuredgeOS clarity-first standards, it empowers users to identify, assess, and neutralize security risks posed by forgotten or malicious token allowances. The platform serves as a critical security infrastructure for the Web3 ecosystem, helping users maintain control over their digital assets while navigating the complex landscape of decentralized applications.
              </p>
              
              <h3 id="key-features" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">Key Features</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Comprehensive Network Coverage</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Full support for Ethereum, Arbitrum, and Base networks with continuous expansion to additional EVM-compatible chains based on user demand and security considerations.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Advanced Risk Intelligence</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Real-time threat intelligence powered by rule-based algorithms that identify unlimited approvals, malicious contracts, anomalous patterns, and high-risk spender addresses.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Token Discovery & Curation</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Comprehensive token database with fuzzy search, categorization, and community-driven curation. Discover tokens across multiple chains with advanced filtering and relevance scoring.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Non-Custodial Security</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Complete user control with no custody risk. All transactions are executed directly from your wallet with your explicit approval. We never hold your private keys or funds.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Gas-Optimized Operations</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Batch revocation capabilities and smart contract optimization to minimize gas costs while maximizing security effectiveness through efficient transaction batching.</p>
                </div>
              </div>
              
              <h3 id="how-it-works" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">How It Works</h3>
              <div className="space-y-4 text-base text-text-secondary dark:text-secondary-400">
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
              <h2 id="getting-started" className="text-2xl font-semibold text-text-primary dark:text-secondary-100 mb-4">Getting Started with Allowance Guard</h2>
              
              <h3 id="what-are-token-allowances" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">What Are Token Allowances?</h3>
              <p className="text-base text-text-secondary dark:text-secondary-400 mb-6">
                Think of a token allowance like giving a valet a specific car key, not your entire keyring. When you interact with DeFi protocols like Uniswap or NFT marketplaces like OpenSea, you grant them permission to spend specific amounts of your tokens. This is necessary for the dApp to function - for example, Uniswap needs permission to swap your USDC for ETH. However, these permissions persist even after you&apos;re done using the dApp, creating potential security risks if left unchecked. An allowance is essentially a standing order that says &quot;this smart contract can spend up to X amount of my tokens.&quot;
              </p>
              
              <h3 id="what-this-tool-does" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">What This Tool Does (And Does Not Do)</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">What Allowance Guard Does:</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Scans your wallet across multiple blockchain networks to identify all token approvals, displays them in an easy-to-understand dashboard, assesses each approval for potential security risks, provides one-click revocation tools to remove dangerous permissions, and offers monitoring and alert systems to notify you of new approvals.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">What Allowance Guard Does NOT Do:</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Cannot move your funds or access your private keys, cannot prevent all types of scams or security threats, cannot recover funds that have already been stolen, cannot automatically revoke approvals without your explicit permission, and cannot access any information beyond what is publicly available on the blockchain.</p>
                </div>
              </div>
              
              <h3 id="connecting-your-wallet" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">Connecting Your Wallet: A Step-by-Step Guide</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Step 1: Click &quot;Connect Wallet&quot;</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">On the Allowance Guard homepage, click the &quot;Connect Wallet&quot; button. This will open a modal showing supported wallet options including MetaMask, WalletConnect, and other EVM-compatible wallets.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Step 2: Select Your Wallet Provider</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Choose your preferred wallet from the list. If you&apos;re using MetaMask, it will prompt you to connect. If using WalletConnect, you&apos;ll see a QR code to scan with your mobile wallet.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Step 3: Approve the Connection</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Your wallet will show a connection request. This request only asks for permission to read your public wallet address and view your token balances. It does NOT request permission to move your funds or access your private keys. Click &quot;Connect&quot; or &quot;Approve&quot; in your wallet.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">What the Connection Means:</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">The connection establishes a read-only link between Allowance Guard and your wallet. We can see your public address and the allowances associated with it, but we cannot sign transactions, move funds, or access any private information. You maintain complete control over all transactions and approvals.</p>
            </div>
          </div>
        </div>
          </div>
        )

      case 'networks':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="supported-networks" className="text-2xl font-semibold text-text-primary dark:text-secondary-100 mb-4">Supported Networks</h2>
            <p className="text-base text-text-secondary dark:text-secondary-400 mb-6">
                AllowanceGuard currently supports the following blockchain networks:
            </p>
            <div className="space-y-6">
              {supportedNetworks.map((network) => (
                <div key={network.chainId} className="flex items-center justify-between p-6 bg-background-primary dark:bg-secondary-800 border border-secondary-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
              <div>
                      <h4 className="text-lg font-semibold text-text-primary dark:text-secondary-100">{network.name}</h4>
                    <p className="text-sm text-text-secondary dark:text-secondary-400">Chain ID: {network.chainId}</p>
              </div>
                  </div>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-cobalt/20">
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
              <h2 id="risk-scoring-system" className="text-2xl font-semibold text-text-primary dark:text-secondary-100 mb-4">How We Calculate Risk Scores</h2>
              <p className="text-base text-text-secondary dark:text-secondary-400 mb-6">
                Our risk scoring system uses a transparent, rule-based approach that evaluates each token approval against multiple security heuristics. This system is designed to err on the side of caution, flagging potentially risky allowances for your review rather than missing actual threats. The scoring algorithm is continuously refined based on new threat intelligence and user feedback.
              </p>
              
              <h3 id="risk-heuristics" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">Risk Heuristic Rules</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Unlimited Approvals (+50 points)</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Allowances set to the maximum possible value (2^256-1) that grant unlimited spending power. These represent the highest risk as they allow malicious contracts to drain entire token balances. The system flags any approval where the amount equals or exceeds the maximum uint256 value.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Malicious Address List Match (+40 points)</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Spender contracts that appear on known malicious address lists maintained by security researchers, blockchain analysis firms, and community reports. Our threat intelligence database is continuously updated from multiple sources including DeFi security teams and exploit tracking services.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Unverified Contract Source (+20 points)</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Contracts that lack verified source code on Etherscan or other block explorers. While not inherently malicious, unverified contracts cannot be audited for security vulnerabilities and represent an unknown risk factor.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Anomalous Approval Amount (+15 points)</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Approvals that are significantly larger than typical usage patterns for the specific token or protocol. The system compares approval amounts against historical data and user holdings to identify suspiciously large allowances.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Stale Approvals (+10 points)</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Approvals that have been unused for extended periods (typically 90+ days) without corresponding transaction activity. Stale approvals increase attack surface and may indicate forgotten or abandoned permissions.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">High-Value Exposure (+5-25 points)</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Approvals involving significant token values relative to the user&apos;s total holdings. The risk score increases proportionally with the financial exposure, with larger amounts receiving higher risk scores.</p>
        </div>
      </div>
              
              <h3 id="risk-levels" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">Risk Level Classifications</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">High Risk (80+ points)</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Immediate action strongly recommended. These approvals pose significant security threats and should be revoked as soon as possible. High-risk approvals typically involve unlimited amounts, known malicious contracts, or combinations of multiple risk factors.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Medium Risk (40-79 points)</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Review recommended. These approvals may pose moderate security risks and should be evaluated based on your specific use case. Consider whether the approval is still needed and if the spender contract is trustworthy.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Low Risk (0-39 points)</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Generally safe. These approvals appear to be from trusted sources with reasonable amounts and recent activity. However, we recommend periodic review to ensure they remain appropriate for your security needs.</p>
      </div>
          </div>
              
              <h3 id="threat-intelligence" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">Threat Intelligence Sources</h3>
              <p className="text-base text-text-secondary dark:text-secondary-400 mb-4">
                Our risk assessment system integrates threat intelligence from multiple sources to ensure comprehensive coverage of emerging threats. These sources include security research teams, blockchain analysis firms, community reports, and automated monitoring of exploit patterns. The system continuously updates its knowledge base to stay ahead of new attack vectors and malicious contract deployments.
              </p>
            </div>
          </div>
        )

      case 'core-concepts':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="core-concepts" className="text-2xl font-semibold text-text-primary dark:text-secondary-100 mb-4">Understanding Core Concepts</h2>
              
              <h3 id="revocation-process" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">The Revocation Process Explained</h3>
              <p className="text-base text-text-secondary dark:text-secondary-400 mb-6">
                When you revoke an allowance, you are executing a blockchain transaction that sets the spending limit for that specific token and contract to zero. This is accomplished by calling the standard ERC-20 &apos;approve(spender, 0)&apos; function or the ERC-721 &apos;setApprovalForAll(spender, false)&apos; function. These are the same functions used by all legitimate DeFi applications and have been extensively tested by the broader Ethereum community. The transaction requires gas fees because it must be processed and confirmed by the network validators. Once confirmed, the smart contract can no longer access those tokens unless you explicitly grant a new allowance.
              </p>
              
              <h3 id="data-privacy-security" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">Data Privacy and Security</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">What Data We Fetch</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">We only access public on-chain data including your wallet address, token balances, and allowance information. This data is already publicly available on the blockchain and can be viewed by anyone using block explorers like Etherscan. We do not access any private information, transaction history beyond allowances, or personal data.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">What Data We Store</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">We cache allowance data temporarily to improve performance and reduce API calls. This cached data is encrypted at rest using AES-256 encryption and is automatically purged after defined retention periods. We also collect anonymized usage telemetry to improve the product, but this data cannot be linked to individual users or wallet addresses.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">What We Never Store</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">We never store private keys, seed phrases, personal information, or any data that could compromise your security. Your private keys never leave your device, and we cannot access your funds under any circumstances. All transactions are signed locally by your wallet, maintaining complete user control.</p>
                </div>
              </div>
              
              <h3 id="non-custodial-nature" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">Non-Custodial Security Model</h3>
              <p className="text-base text-text-secondary dark:text-secondary-400 mb-4">
                Allowance Guard operates on a strict non-custodial model, meaning we never hold your private keys, funds, or sensitive credentials. All security operations are executed directly from your wallet with your explicit approval. This model ensures that you maintain complete control over your assets while benefiting from our security analysis and risk assessment tools. The platform serves as a security advisor and tool provider, not a custodian or intermediary for your funds.
              </p>
            </div>
          </div>
        )

      case 'usage-guides':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="usage-guides" className="text-2xl font-semibold text-text-primary dark:text-secondary-100 mb-4">How-To Guides</h2>
              
              <h3 id="interpret-dashboard" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">How to Interpret Your Allowance Dashboard</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Token Column</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Shows the specific token that has been approved, including the token symbol, name, and contract address. Click on the token name to view additional details and verify the contract address on block explorers.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Spender Column</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Displays the smart contract address that has permission to spend your tokens. This is the contract you granted the allowance to, such as a DEX router or NFT marketplace. Verify this address matches the intended protocol.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Amount Column</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Shows the approved spending amount. Look for &quot;Unlimited&quot; which indicates the maximum possible allowance (2^256-1), representing the highest security risk. Specific amounts show the exact token quantity the contract can spend.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Risk Score Column</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Displays the calculated risk score based on our heuristic analysis. High scores (80+) require immediate attention, medium scores (40-79) should be reviewed, and low scores (0-39) are generally safe but worth periodic review.</p>
                </div>
              </div>
              
              <h3 id="revoke-single-allowance" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">How to Revoke a Single Allowance</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Step 1: Identify the Allowance</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Review your allowance list and identify the approval you want to revoke. Pay special attention to high-risk scores and unlimited allowances that pose immediate security threats.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Step 2: Click the Revoke Button</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Click the &quot;Revoke&quot; button next to the specific allowance. This will prepare a transaction that sets the allowance amount to zero, completely removing the contract&apos;s spending permission.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Step 3: Review the Transaction</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Your wallet will display the transaction details including the gas fee estimate. Review the spender address and token to ensure you&apos;re revoking the correct allowance. The transaction will call the approve function with a zero amount.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Step 4: Confirm and Sign</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Confirm the transaction in your wallet and pay the required gas fee. Once the transaction is confirmed on the blockchain, the allowance will be set to zero and the security risk will be eliminated.</p>
                </div>
              </div>
              
              <h3 id="batch-revoke-allowances" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">How to Batch Revoke Allowances</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Select Multiple Allowances</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Use the checkboxes to select multiple allowances you want to revoke. This is particularly useful for cleaning up multiple stale or risky approvals in a single transaction, saving significant gas costs.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Batch Revoke Operation</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Click the &quot;Batch Revoke&quot; button to prepare a single transaction that revokes all selected allowances. Our smart contract optimization ensures maximum gas efficiency by batching multiple revocation operations.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Gas Optimization Benefits</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Batch operations can reduce gas costs by up to 70% compared to individual revocations, as you only pay the base transaction fee once instead of multiple times. This makes it cost-effective to clean up many allowances simultaneously.</p>
                </div>
              </div>
              
              <h3 id="token-discovery-search" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">Token Discovery & Search</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Accessing Token Discovery</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Navigate to the &quot;Discover Tokens&quot; page to explore our comprehensive token database. This feature allows you to search and discover tokens across multiple blockchain networks with advanced filtering and categorization.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Advanced Search Features</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Use fuzzy search to find tokens by name, symbol, or contract address. Filter by blockchain network, token category (DeFi, NFT, Stablecoins, etc.), and verification status. The search uses PostgreSQL trigram indexing for fast, relevant results.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Token Categories</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Browse tokens by category including Stablecoins, DeFi protocols, NFT collections, Governance tokens, and more. Each category is curated by the community and verified by our team to ensure accuracy and relevance.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Community Curation</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Submit new tokens for inclusion in our database through the token submission system. All submissions are validated on-chain and reviewed by our curation team before being added to the public database.</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'advanced-topics':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="advanced-topics" className="text-2xl font-semibold text-text-primary dark:text-secondary-100 mb-4">Advanced Topics</h2>
              
              <h3 id="architecture" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">Allowance Guard&apos;s Architecture</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Frontend Layer</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Built with Next.js and React, providing a responsive, client-side interface that connects directly to user wallets via MetaMask and WalletConnect protocols. The frontend handles wallet connections, transaction signing, and user interactions while maintaining complete non-custodial security.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Backend API</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Node.js-based API layer that processes scan requests, manages job queues, and provides allowance data. The backend coordinates with blockchain RPC providers and maintains cached data for performance optimization while ensuring data freshness and accuracy.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Blockchain Indexer</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Custom indexing system that scans blockchain data to identify token approvals and contract interactions. The indexer processes historical data and maintains real-time updates to ensure comprehensive coverage of all allowance-related activities across supported networks.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Risk Engine</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Rule-based risk assessment system that evaluates allowances against multiple security heuristics. The engine integrates threat intelligence feeds, maintains malicious address databases, and provides transparent risk scoring that users can understand and trust.</p>
                </div>
              </div>
              
              <h3 id="smart-contract-integration" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">Smart Contract Integration</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Standard ERC Functions</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Allowance Guard uses only standard, well-audited ERC-20 and ERC-721 functions for revocation operations. We do not deploy custom smart contracts that could introduce additional attack vectors. All operations use the standard approve(spender, 0) and setApprovalForAll(spender, false) functions.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Batch Revoke Contract</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">For gas optimization, we provide a verified batch revocation contract that allows multiple allowances to be revoked in a single transaction. The contract address and ABI are publicly available for transparency and can be verified on block explorers.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Developer Integration</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">Developers can integrate directly with our APIs or use our smart contracts for their own applications. We provide comprehensive documentation, code examples, and support for web3.js, ethers.js, and other popular blockchain libraries.</p>
                </div>
              </div>
              
              <h3 id="api-reference" className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-3">API Reference (Public)</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Scan Endpoint</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">POST /api/scan - Queue a wallet scan job. Accepts wallet address and network parameters. Returns job ID for status tracking. Rate limited to prevent abuse while ensuring responsive service for legitimate users.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Allowances Endpoint</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">GET /api/allowances - Retrieve paginated allowance data for a wallet. Supports filtering by risk level, network, and token type. Returns structured data with risk scores and metadata for easy integration.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Job Status Endpoint</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">GET /api/jobs/[id] - Check the status of a scan job. Returns current progress, completion status, and any error messages. Essential for implementing proper loading states and error handling in client applications.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Token Search Endpoint</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">GET /api/tokens/search - Search and discover tokens across multiple blockchains. Supports fuzzy search, category filtering, and relevance scoring. Returns paginated results with token metadata, categories, and verification status.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Token Categories Endpoint</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">GET /api/tokens/categories - Retrieve all available token categories with usage counts. Useful for building category filters and understanding the token taxonomy.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Token Submission Endpoint</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">POST /api/tokens/submit - Submit new tokens for community curation. Validates tokens on-chain and queues them for review. Requires email contact and token metadata including name, symbol, and standard.</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary dark:text-secondary-100 mb-2">Chains Endpoint</h4>
                  <p className="text-base text-text-secondary dark:text-secondary-400">GET /api/chains - Retrieve supported blockchain networks with their configuration. Returns chain IDs, names, symbols, and RPC endpoints for integration with wallet providers.</p>
                </div>
              </div>
            </div>
          </div>
        )
    default:
      return null
  }
}
