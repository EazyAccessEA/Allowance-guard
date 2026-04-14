import { Globe } from 'lucide-react'
import { supportedNetworks } from './docs-data'

interface Props { section: string; onNavigate?: (section: string) => void }

/** Docs content sections: overview through advanced-topics */
export default function DocsContentPrimary({ section, onNavigate }: Props) {
 switch (section) {
 case 'overview':
 return (
 <div className="space-y-10">
 <div>
 <h2 id="overview" className="text-3xl font-bold text-ink mb-4 tracking-tight">
 AllowanceGuard Documentation
 </h2>
 <p className="text-lg text-ink-soft leading-relaxed">
 Find and revoke risky token approvals across 27 EVM chains &mdash; through the dashboard, the browser extension, or the public API. These docs cover all three.
 </p>
 </div>

 <div>
 <h3 id="what-is-allowanceguard" className="text-xl font-semibold text-ink mb-3">
 What it is
 </h3>
 <p className="text-base text-ink-soft leading-relaxed mb-4">
 AllowanceGuard is an open-source wallet security scanner. It finds every <code className="rounded bg-paper-sub px-1.5 py-0.5 text-xs text-amber-deep font-mono">approve()</code>, <code className="rounded bg-paper-sub px-1.5 py-0.5 text-xs text-amber-deep font-mono">setApprovalForAll()</code>, and Permit2 grant your wallet has ever signed, scores each one against a set of risk heuristics, and lets you revoke them &mdash; one at a time or in a batch.
 </p>
 <p className="text-base text-ink-soft leading-relaxed">
 It is fully non-custodial. We never receive your private keys, signatures, or seed phrases, so we cannot move your funds &mdash; that capability does not exist in the system.
 </p>
 </div>

 <div>
 <h3 id="key-features" className="text-xl font-semibold text-ink mb-4">
 What it does
 </h3>
 <div className="grid sm:grid-cols-2 gap-4">
 <div className="rounded-xl border border-ink-rule bg-paper-sub p-5">
 <h4 className="font-semibold text-ink mb-2 text-sm">27 EVM chains</h4>
 <p className="text-sm text-ink-soft leading-relaxed">
 Ethereum, Arbitrum, Base, Optimism, Polygon, Avalanche, BNB Chain, Fantom, zkSync Era, Polygon zkEVM, Mantle, Gnosis, Linea, Scroll, and Celo.
 </p>
 </div>
 <div className="rounded-xl border border-ink-rule bg-paper-sub p-5">
 <h4 className="font-semibold text-ink mb-2 text-sm">Every approval primitive</h4>
 <p className="text-sm text-ink-soft leading-relaxed">
 ERC-20 <code className="text-xs text-amber-deep">approve()</code>, ERC-721 / ERC-1155 <code className="text-xs text-amber-deep">setApprovalForAll()</code>, and Permit2 off-chain signed allowances.
 </p>
 </div>
 <div className="rounded-xl border border-ink-rule bg-paper-sub p-5">
 <h4 className="font-semibold text-ink mb-2 text-sm">Risk heuristics, not scoring theatre</h4>
 <p className="text-sm text-ink-soft leading-relaxed">
 Each approval is graded on unlimited amounts, contract age, verification status, spender concentration, and known exploit signatures.
 </p>
 </div>
 <div className="rounded-xl border border-ink-rule bg-paper-sub p-5">
 <h4 className="font-semibold text-ink mb-2 text-sm">Batch revocation</h4>
 <p className="text-sm text-ink-soft leading-relaxed">
 Revoke many approvals in a single transaction. Lower gas than sequential revokes, especially on L1.
 </p>
 </div>
 <div className="rounded-xl border border-ink-rule bg-paper-sub p-5">
 <h4 className="font-semibold text-ink mb-2 text-sm">Continuous monitoring</h4>
 <p className="text-sm text-ink-soft leading-relaxed">
 Pro and Sentinel wallets are rescanned on a schedule. New high-risk approvals trigger email, Telegram, or webhook alerts.
 </p>
 </div>
 <div className="rounded-xl border border-ink-rule bg-paper-sub p-5">
 <h4 className="font-semibold text-ink mb-2 text-sm">Public REST API</h4>
 <p className="text-sm text-ink-soft leading-relaxed">
 Programmatic access to scanning, allowances, risk scores, and simulation. See <a href="/docs/api-reference" className="text-amber-deep hover:underline">API Reference</a>.
 </p>
 </div>
 </div>
 </div>

 <div>
 <h3 id="how-it-works" className="text-xl font-semibold text-ink mb-4">
 How it works
 </h3>
 <ol className="space-y-3 text-base text-ink-soft">
 <li className="flex gap-3">
 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400/15 text-amber-deep text-xs font-semibold flex items-center justify-center mt-0.5">1</span>
 <span><strong className="text-ink">Connect or paste.</strong> Connect a wallet, or paste any address. Read-only by default.</span>
 </li>
 <li className="flex gap-3">
 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400/15 text-amber-deep text-xs font-semibold flex items-center justify-center mt-0.5">2</span>
 <span><strong className="text-ink">Scan.</strong> We index every approval the address has ever granted, across all 27 supported chains, in one pass.</span>
 </li>
 <li className="flex gap-3">
 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400/15 text-amber-deep text-xs font-semibold flex items-center justify-center mt-0.5">3</span>
 <span><strong className="text-ink">Score.</strong> Each approval is graded against the risk heuristics and ranked by what can hurt you most.</span>
 </li>
 <li className="flex gap-3">
 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400/15 text-amber-deep text-xs font-semibold flex items-center justify-center mt-0.5">4</span>
 <span><strong className="text-ink">Revoke.</strong> Click revoke. We construct the transaction; you sign it in your wallet. Your keys never leave your device.</span>
 </li>
 <li className="flex gap-3">
 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400/15 text-amber-deep text-xs font-semibold flex items-center justify-center mt-0.5">5</span>
 <span><strong className="text-ink">Monitor.</strong> Optional. Set the wallet to rescan on a schedule and alert you when something new and risky appears.</span>
 </li>
 </ol>
 </div>

 <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
 <h4 className="font-semibold text-ink text-sm mb-2">New here? Start with two pages</h4>
 <p className="text-sm text-ink-soft leading-relaxed">
 Read <button onClick={() => onNavigate?.('getting-started')} className="text-amber-deep hover:underline font-medium">What Are Token Allowances?</button> in <em>Getting Started</em> for the security primer, then jump to <a href="/docs/api-reference" className="text-amber-deep hover:underline font-medium">API Reference</a> if you&rsquo;re building an integration.
 </p>
 </div>
 </div>
 )

 case 'getting-started':
 return (
 <div className="space-y-8">
 <div>
 <h2 id="getting-started" className="text-2xl font-semibold text-ink mb-4">Getting Started with AllowanceGuard</h2>
 
 <h3 id="what-are-token-allowances" className="text-xl font-semibold text-ink mb-3">What Are Token Allowances?</h3>
 <p className="text-base text-ink-soft mb-3">
 An <strong className="text-ink">allowance</strong> is a standing order that says &ldquo;this smart contract can spend up to X of my tokens.&rdquo; You grant one every time you swap on Uniswap, list on OpenSea, or stake on Lido. The dApp needs the permission to function.
 </p>
 <p className="text-base text-ink-soft mb-3">
 The problem: the permission <strong className="text-ink">stays granted long after you stop using the dApp</strong>. Most users sign once and forget. The contract still has the right to move those tokens &mdash; until you revoke it.
 </p>
 <p className="text-base text-ink-soft mb-6">
 If that contract is later exploited, drained, upgraded by a malicious admin, or was malicious to begin with, your tokens are gone. AllowanceGuard exists so you don&rsquo;t leave that door open.
 </p>
 
 <h3 id="what-this-tool-does" className="text-xl font-semibold text-ink mb-3">What This Tool Does (And Does Not Do)</h3>
 <div className="space-y-4 mb-6">
 <div>
 <h4 className="font-medium text-ink mb-2">What AllowanceGuard Does:</h4>
 <p className="text-base text-ink-soft">Scans your wallet across all 27 supported EVM chains to identify all token approvals, displays them in an easy-to-understand dashboard, assesses each approval for potential security risks, provides one-click revocation tools to remove dangerous permissions, and offers monitoring and alert systems to notify you of new approvals.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">What AllowanceGuard Does NOT Do:</h4>
 <p className="text-base text-ink-soft">Cannot move your funds or access your private keys, cannot prevent all types of scams or security threats, cannot recover funds that have already been stolen, cannot automatically revoke approvals without your explicit permission, and cannot access any information beyond what is publicly available on the blockchain.</p>
 </div>
 </div>
 
 <h3 id="connecting-your-wallet" className="text-xl font-semibold text-ink mb-3">Connecting Your Wallet: A Step-by-Step Guide</h3>
 <div className="space-y-4 mb-6">
 <div>
 <h4 className="font-medium text-ink mb-2">Step 1: Click &quot;Connect Wallet&quot;</h4>
 <p className="text-base text-ink-soft">On the AllowanceGuard homepage, click the &quot;Connect Wallet&quot; button. This will open a modal showing supported wallet options including MetaMask, WalletConnect, and other EVM-compatible wallets.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Step 2: Select Your Wallet Provider</h4>
 <p className="text-base text-ink-soft">Choose your preferred wallet from the list. If you&apos;re using MetaMask, it will prompt you to connect. If using WalletConnect, you&apos;ll see a QR code to scan with your mobile wallet.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Step 3: Approve the Connection</h4>
 <p className="text-base text-ink-soft">Your wallet will show a connection request. This request only asks for permission to read your public wallet address and view your token balances. It does NOT request permission to move your funds or access your private keys. Click &quot;Connect&quot; or &quot;Approve&quot; in your wallet.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">What the Connection Means:</h4>
 <p className="text-base text-ink-soft">The connection establishes a read-only link between AllowanceGuard and your wallet. We can see your public address and the allowances associated with it, but we cannot sign transactions, move funds, or access any private information. You sign every transaction yourself; we never have the ability to.</p>
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
 <p className="text-base text-ink-soft mb-6">
 AllowanceGuard currently supports the following blockchain networks:
 </p>
 <div className="space-y-6">
 {supportedNetworks.map((network) => (
 <div key={network.chainId} className="flex items-center justify-between p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center">
 <Globe className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h4 className="text-lg font-semibold text-ink">{network.name}</h4>
 <p className="text-sm text-ink-soft">Chain ID: {network.chainId}</p>
 </div>
 </div>
 <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-deep border border-amber-500/20">
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
 <p className="text-base text-ink-soft mb-3">
 Risk scoring is a <strong className="text-ink">transparent rule engine</strong>. There&rsquo;s no black box, no proprietary &ldquo;AI threat model&rdquo;, and no vendor data we can&rsquo;t source. Every score is the sum of rule hits you can read for yourself.
 </p>
 <p className="text-base text-ink-soft mb-6">
 The engine errs toward over-flagging. We&rsquo;d rather show you a false positive than miss a real exploit waiting to happen. Rules are refined as new attack patterns appear and as users report false positives.
 </p>
 
 <h3 id="risk-heuristics" className="text-xl font-semibold text-ink mb-3">Risk Heuristic Rules</h3>
 <div className="space-y-4 mb-6">
 <div>
 <h4 className="font-medium text-ink mb-2">Unlimited Approvals (+50 points)</h4>
 <p className="text-base text-ink-soft">Allowances set to the maximum possible value (2^256-1) that grant unlimited spending power. These represent the highest risk as they allow malicious contracts to drain entire token balances. The system flags any approval where the amount equals or exceeds the maximum uint256 value.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Malicious Address List Match (+40 points)</h4>
 <p className="text-base text-ink-soft">Spender contracts that appear on known malicious address lists maintained by security researchers, blockchain analysis firms, and community reports. These lists are kept current from public exploit trackers, post-mortem reports, and community-submitted incident data.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Unverified Contract Source (+20 points)</h4>
 <p className="text-base text-ink-soft">Contracts that lack verified source code on Etherscan or other block explorers. While not inherently malicious, unverified contracts cannot be audited for security vulnerabilities and represent an unknown risk factor.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Anomalous Approval Amount (+15 points)</h4>
 <p className="text-base text-ink-soft">Approvals that are significantly larger than typical usage patterns for the specific token or protocol. The system compares approval amounts against historical data and user holdings to identify suspiciously large allowances.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Stale Approvals (+10 points)</h4>
 <p className="text-base text-ink-soft">Approvals that have been unused for extended periods (typically 90+ days) without corresponding transaction activity. Stale approvals increase attack surface and may indicate forgotten or abandoned permissions.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">High-Value Exposure (+5-25 points)</h4>
 <p className="text-base text-ink-soft">Approvals involving significant token values relative to the user&apos;s total holdings. The risk score increases proportionally with the financial exposure, with larger amounts receiving higher risk scores.</p>
 </div>
 </div>
 
 <h3 id="risk-levels" className="text-xl font-semibold text-ink mb-3">Risk Level Classifications</h3>
 <div className="space-y-4 mb-6">
 <div>
 <h4 className="font-medium text-ink mb-2">High Risk (80+ points)</h4>
 <p className="text-base text-ink-soft">Immediate action strongly recommended. These approvals pose significant security threats and should be revoked as soon as possible. High-risk approvals typically involve unlimited amounts, known malicious contracts, or combinations of multiple risk factors.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Medium Risk (40-79 points)</h4>
 <p className="text-base text-ink-soft">Review recommended. These approvals may pose moderate security risks and should be evaluated based on your specific use case. Consider whether the approval is still needed and if the spender contract is trustworthy.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Low Risk (0-39 points)</h4>
 <p className="text-base text-ink-soft">Generally safe. These approvals appear to be from trusted sources with reasonable amounts and recent activity. However, we recommend periodic review to ensure they remain appropriate for your security needs.</p>
 </div>
 </div>
 
 <h3 id="threat-intelligence" className="text-xl font-semibold text-ink mb-3">Threat Intelligence Sources</h3>
 <p className="text-base text-ink-soft mb-4">
 The risk engine pulls signals from public exploit trackers, contract verification status, and on-chain behavioural patterns. No proprietary vendor feeds &mdash; everything is sourceable. 
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
 <p className="text-base text-ink-soft mb-6">
 When you revoke an allowance, you are executing a blockchain transaction that sets the spending limit for that specific token and contract to zero. This is accomplished by calling the standard ERC-20 &apos;approve(spender, 0)&apos; function or the ERC-721 &apos;setApprovalForAll(spender, false)&apos; function. These are the same functions used by all legitimate DeFi applications and have been extensively tested by the broader Ethereum community. The transaction requires gas fees because it must be processed and confirmed by the network validators. Once confirmed, the smart contract can no longer access those tokens unless you explicitly grant a new allowance.
 </p>
 
 <h3 id="data-privacy-security" className="text-xl font-semibold text-ink mb-3">Data Privacy and Security</h3>
 <div className="space-y-4 mb-6">
 <div>
 <h4 className="font-medium text-ink mb-2">What Data We Fetch</h4>
 <p className="text-base text-ink-soft">We only access public on-chain data including your wallet address, token balances, and allowance information. This data is already publicly available on the blockchain and can be viewed by anyone using block explorers like Etherscan. We do not access any private information, transaction history beyond allowances, or personal data.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">What Data We Store</h4>
 <p className="text-base text-ink-soft">We cache allowance data temporarily to improve performance and reduce API calls. This cached data is encrypted at rest using AES-256 encryption and is automatically purged after defined retention periods. We also collect anonymized usage telemetry to improve the product, but this data cannot be linked to individual users or wallet addresses.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">What We Never Store</h4>
 <p className="text-base text-ink-soft">We never store private keys, seed phrases, personal information, or any data that could compromise your security. Your private keys never leave your device, and we cannot access your funds under any circumstances. All transactions are signed locally by your wallet, because the keys never leave your device.</p>
 </div>
 </div>
 
 <h3 id="non-custodial-nature" className="text-xl font-semibold text-ink mb-3">Non-Custodial Security Model</h3>
 <p className="text-base text-ink-soft mb-4">
 AllowanceGuard operates on a strict non-custodial model, meaning we never hold your private keys, funds, or sensitive credentials. All security operations are executed directly from your wallet with your explicit approval. This model ensures that you stay in full custody of your assets while we surface the risks worth knowing about. The platform serves as a security advisor and tool provider, not a custodian or intermediary for your funds.
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
 <p className="text-base text-ink-soft">Shows the specific token that has been approved, including the token symbol, name, and contract address. Click on the token name to view additional details and verify the contract address on block explorers.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Spender Column</h4>
 <p className="text-base text-ink-soft">Displays the smart contract address that has permission to spend your tokens. This is the contract you granted the allowance to, such as a DEX router or NFT marketplace. Verify this address matches the intended protocol.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Amount Column</h4>
 <p className="text-base text-ink-soft">Shows the approved spending amount. Look for &quot;Unlimited&quot; which indicates the maximum possible allowance (2^256-1), representing the highest security risk. Specific amounts show the exact token quantity the contract can spend.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Risk Score Column</h4>
 <p className="text-base text-ink-soft">Displays the calculated risk score based on our heuristic analysis. High scores (80+) require immediate attention, medium scores (40-79) should be reviewed, and low scores (0-39) are generally safe but worth periodic review.</p>
 </div>
 </div>
 
 <h3 id="revoke-single-allowance" className="text-xl font-semibold text-ink mb-3">How to Revoke a Single Allowance</h3>
 <div className="space-y-4 mb-6">
 <div>
 <h4 className="font-medium text-ink mb-2">Step 1: Identify the Allowance</h4>
 <p className="text-base text-ink-soft">Review your allowance list and identify the approval you want to revoke. Pay special attention to high-risk scores and unlimited allowances that pose immediate security threats.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Step 2: Click the Revoke Button</h4>
 <p className="text-base text-ink-soft">Click the &quot;Revoke&quot; button next to the specific allowance. This will prepare a transaction that sets the allowance amount to zero, completely removing the contract&apos;s spending permission.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Step 3: Review the Transaction</h4>
 <p className="text-base text-ink-soft">Your wallet will display the transaction details including the gas fee estimate. Review the spender address and token to ensure you&apos;re revoking the correct allowance. The transaction will call the approve function with a zero amount.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Step 4: Confirm and Sign</h4>
 <p className="text-base text-ink-soft">Confirm the transaction in your wallet and pay the required gas fee. Once the transaction is confirmed on the blockchain, the allowance will be set to zero and the security risk will be eliminated.</p>
 </div>
 </div>
 
 <h3 id="batch-revoke-allowances" className="text-xl font-semibold text-ink mb-3">How to Batch Revoke Allowances</h3>
 <div className="space-y-4 mb-6">
 <div>
 <h4 className="font-medium text-ink mb-2">Select Multiple Allowances</h4>
 <p className="text-base text-ink-soft">Use the checkboxes to select multiple allowances you want to revoke. This is particularly useful for cleaning up multiple stale or risky approvals in a single transaction, saving significant gas costs.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Batch Revoke Operation</h4>
 <p className="text-base text-ink-soft">Click the &quot;Batch Revoke&quot; button to prepare a single transaction that revokes all selected allowances. Our smart contract optimization ensures maximum gas efficiency by batching multiple revocation operations.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Gas Optimization Benefits</h4>
 <p className="text-base text-ink-soft">Batch operations can reduce gas costs by up to 70% compared to individual revocations, as you only pay the base transaction fee once instead of multiple times. This makes it cost-effective to clean up many allowances simultaneously.</p>
 </div>
 </div>
 
 <h3 id="token-discovery-search" className="text-xl font-semibold text-ink mb-3">Token Discovery & Search</h3>
 <div className="space-y-4 mb-6">
 <div>
 <h4 className="font-medium text-ink mb-2">Accessing Token Discovery</h4>
 <p className="text-base text-ink-soft">Navigate to the &quot;Discover Tokens&quot; page to explore our token database. This feature allows you to search and discover tokens across all 27 supported EVM chains with advanced filtering and categorization.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Advanced Search Features</h4>
 <p className="text-base text-ink-soft">Use fuzzy search to find tokens by name, symbol, or contract address. Filter by blockchain network, token category (DeFi, NFT, Stablecoins, etc.), and verification status. The search uses PostgreSQL trigram indexing for fast, relevant results.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Token Categories</h4>
 <p className="text-base text-ink-soft">Browse tokens by category including Stablecoins, DeFi protocols, NFT collections, Governance tokens, and more. Each category is curated by the community and verified by our team to ensure accuracy and relevance.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Community Curation</h4>
 <p className="text-base text-ink-soft">Submit new tokens for inclusion in our database through the token submission system. All submissions are validated on-chain and reviewed by our curation team before being added to the public database.</p>
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
 
 <h3 id="architecture" className="text-xl font-semibold text-ink mb-3">AllowanceGuard&apos;s Architecture</h3>
 <div className="space-y-4 mb-6">
 <div>
 <h4 className="font-medium text-ink mb-2">Frontend Layer</h4>
 <p className="text-base text-ink-soft">Built with Next.js and React, providing a responsive, client-side interface that connects directly to user wallets via MetaMask and WalletConnect protocols. The frontend handles wallet connections, transaction signing, and user interactions while preserving the non-custodial guarantee.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Backend API</h4>
 <p className="text-base text-ink-soft">Node.js-based API layer that processes scan requests, manages job queues, and provides allowance data. The backend coordinates with blockchain RPC providers and maintains cached data for performance optimization while ensuring data freshness and accuracy.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Blockchain Indexer</h4>
 <p className="text-base text-ink-soft">Custom indexing system that scans blockchain data to identify token approvals and contract interactions. The indexer processes historical data and maintains real-time updates to ensure complete coverage of all allowance-related activities across all 27 supported chains.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Risk Engine</h4>
 <p className="text-base text-ink-soft">Rule-based risk engine. Each allowance is graded against on-chain metadata, contract verification, spender concentration, age, and known exploit signatures. Every score is transparent — you can see why an approval is flagged.</p>
 </div>
 </div>
 
 <h3 id="smart-contract-integration" className="text-xl font-semibold text-ink mb-3">Smart Contract Integration</h3>
 <div className="space-y-4 mb-6">
 <div>
 <h4 className="font-medium text-ink mb-2">Standard ERC Functions</h4>
 <p className="text-base text-ink-soft">AllowanceGuard uses only standard, well-audited ERC-20 and ERC-721 functions for revocation operations. We do not deploy custom smart contracts that could introduce additional attack vectors. All operations use the standard approve(spender, 0) and setApprovalForAll(spender, false) functions.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Batch Revoke Contract</h4>
 <p className="text-base text-ink-soft">For gas optimization, we provide a verified batch revocation contract that allows multiple allowances to be revoked in a single transaction. The contract address and ABI are publicly available for transparency and can be verified on block explorers.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Developer Integration</h4>
 <p className="text-base text-ink-soft">Developers can integrate directly with our APIs or use our smart contracts for their own applications. We provide documentation, code examples, and support for the common Web3 libraries (ethers.js, viem, web3.js).</p>
 </div>
 </div>
 
 <h3 id="api-reference" className="text-xl font-semibold text-ink mb-3">API Reference (v1)</h3>
 <p className="text-base text-ink-soft mb-4">All v1 endpoints require <code className="font-mono text-sm">Authorization: Bearer ag_live_*</code> (or <code className="font-mono text-sm">ag_pub_*</code> for read-only browser use). Base URL: <code className="font-mono text-sm">https://www.allowanceguard.com/api/v1</code>. Full schemas, error codes, and code samples live in the <a href="/docs/api-reference" className="text-amber-deep hover:underline">API Reference</a>.</p>
 <div className="space-y-4 mb-6">
 <div>
 <h4 className="font-medium text-ink mb-2">Scan Endpoint</h4>
 <p className="text-base text-ink-soft">POST /api/v1/scan — Queue a wallet scan. Returns scanId and statusUrl. Rate-limited per API key plan.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Scan Status Endpoint</h4>
 <p className="text-base text-ink-soft">GET /api/v1/scan/{'{id}'} — Poll scan status. Ownership-enforced: returns 404 for scans owned by a different key.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Allowances Endpoint</h4>
 <p className="text-base text-ink-soft">GET /api/v1/allowances — Paginated approvals for a wallet. Supports chainId, riskOnly, page, and pageSize query parameters. Returns risk scores and token metadata.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Risk Score Endpoint</h4>
 <p className="text-base text-ink-soft">GET /api/v1/risk-score — Aggregated wallet risk score with breakdown and top risks. Optional chainId filter.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Portfolio Risk Endpoint</h4>
 <p className="text-base text-ink-soft">GET /api/v1/portfolio-risk — Cross-chain portfolio risk score with per-chain breakdown, trend, and benchmark comparison.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Risk Check Endpoint</h4>
 <p className="text-base text-ink-soft">POST /api/v1/risk-check — Pre-signing risk assessment for a proposed approve() transaction. Surfaces unknown-spender and unlimited-amount risks before the user signs.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Simulate Endpoint</h4>
 <p className="text-base text-ink-soft">POST /api/v1/simulate — Time-machine: returns a before/after risk comparison for a hypothetical revoke without changing state.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Chains Endpoint</h4>
 <p className="text-base text-ink-soft">GET /api/v1/chains — List of all 27 supported chains with chainId, name, symbol, and explorer URL.</p>
 </div>
 </div>
 </div>
 </div>
 )
 default:
 return null
 }
}
