import { Globe, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { supportedNetworks } from './docs-data'
import ArchitectureSection from './sections/ArchitectureSection'

interface Props { section: string; onNavigate?: (section: string) => void }

/** Docs content sections: overview through advanced-topics */
export default function DocsContentPrimary({ section, onNavigate }: Props) {
 switch (section) {
 case 'overview':
 return (
 <div className="space-y-16">
 {/* Intro — one decisive H2, one teaching paragraph, two inline CTAs. */}
 <section className="space-y-5">
 <h2 id="overview" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
 Start here.
 </h2>
 <p className="font-plex text-lg text-ink-muted leading-[1.6]">
 AllowanceGuard is an open-source wallet security scanner. It finds every{' '}
 <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">approve()</code>,{' '}
 <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">setApprovalForAll()</code>, and Permit2 grant your wallet has ever signed, scores each one against transparent risk heuristics, and lets you revoke them &mdash; one at a time or in a batch. Fully non-custodial: we never receive your keys, signatures, or seed phrases. The system has no ability to move your funds.
 </p>
 <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
 <button
 onClick={() => onNavigate?.('getting-started')}
 className="group inline-flex items-center gap-1.5 font-plex text-amber-deep hover:text-ink transition-colors"
 >
 Read the security primer
 <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
 </button>
 <Link
 href="/docs/api-reference"
 className="group inline-flex items-center gap-1.5 font-plex text-amber-deep hover:text-ink transition-colors"
 >
 Jump to the API reference
 <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
 </Link>
 </div>
 </section>

 {/* What it does — feature grid kept because it teaches. Frames removed; the content carries itself. */}
 <section className="space-y-7">
 <h3 id="what-it-does" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 What it does
 </h3>
 <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">27 EVM chains</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Ethereum, Arbitrum, Base, Optimism, Polygon, Avalanche, BNB Chain, Fantom, zkSync Era, Polygon zkEVM, Mantle, Gnosis, Linea, Scroll, and Celo &mdash; and twelve more.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Every approval primitive</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 ERC-20 <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">approve()</code>, ERC-721 / ERC-1155{' '}
 <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">setApprovalForAll()</code>, and Permit2 off-chain signed allowances.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Risk heuristics, not scoring theatre</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Each approval is graded on unlimited amounts, contract age, verification status, spender concentration, and known exploit signatures.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Batch revocation</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Revoke many approvals in a single transaction. Lower gas than sequential revokes, especially on L1.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Continuous monitoring</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Pro and Sentinel wallets are rescanned on a schedule. New high-risk approvals trigger email, Telegram, or webhook alerts.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Public REST API</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Programmatic access to scanning, allowances, risk scores, and simulation.{' '}
 <Link href="/docs/api-reference" className="text-amber-deep hover:underline underline-offset-2">See the reference</Link>.
 </p>
 </div>
 </div>
 </section>

 {/* How it works — numbered list with editorial mono numerals. Amber circle pills retired. */}
 <section className="space-y-6">
 <h3 id="how-it-works" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 How it works
 </h3>
 <ol className="space-y-5">
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">01</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Connect or paste.</strong> Connect a wallet, or paste any address. Read-only by default.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">02</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Scan.</strong> We index every approval the address has ever granted, across all 27 supported chains, in one pass.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">03</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Score.</strong> Each approval is graded against the risk heuristics and ranked by what can hurt you most.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">04</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Revoke.</strong> Click revoke. We construct the transaction; you sign it in your wallet. Your keys never leave your device.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">05</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Monitor.</strong> Optional. Set the wallet to rescan on a schedule and alert you when something new and risky appears.
 </p>
 </li>
 </ol>
 </section>

 {/* Closing note — amber-tinted card demoted to a quiet paragraph above a hairline. */}
 <section className="pt-8 border-t border-ink-rule">
 <p className="font-plex text-sm text-ink-muted leading-[1.6]">
 New here? Start with{' '}
 <button
 onClick={() => onNavigate?.('getting-started')}
 className="text-amber-deep hover:underline underline-offset-2 font-medium"
 >
 What are token allowances?
 </button>{' '}
 for the security primer, then jump to the{' '}
 <Link href="/docs/api-reference" className="text-amber-deep hover:underline underline-offset-2 font-medium">
 API reference
 </Link>{' '}
 if you&rsquo;re building an integration.
 </p>
 </section>
 </div>
 )

 case 'getting-started':
 return (
 <div className="space-y-16">
 <section className="space-y-5">
 <h2 id="getting-started" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
 Token allowances.
 </h2>
 <p className="font-plex text-lg text-ink-muted leading-[1.6]">
 An <strong className="text-ink font-semibold">allowance</strong> is a standing order that says &ldquo;this smart contract can spend up to X of my tokens.&rdquo; You grant one every time you swap on Uniswap, list on OpenSea, or stake on Lido. The dApp needs the permission to function.
 </p>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 The problem: <strong className="text-ink font-semibold">the permission stays granted long after you stop using the dApp</strong>. Most users sign once and forget. The contract still has the right to move those tokens &mdash; until you revoke it.
 </p>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 If that contract is later exploited, drained, upgraded by a malicious admin, or was malicious to begin with, your tokens are gone. AllowanceGuard exists so you don&rsquo;t leave that door open.
 </p>
 </section>

 <section className="space-y-7">
 <h3 id="what-this-tool-does" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 What this tool does, and doesn&rsquo;t.
 </h3>
 <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Does</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Scans your wallet across all 27 supported EVM chains, identifies every token approval, scores each one against transparent risk heuristics, and provides one-click revocation. Offers optional monitoring that re-scans on a schedule and alerts you to new high-risk approvals.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Doesn&rsquo;t</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Cannot move your funds. Cannot access your private keys. Cannot prevent every scam or recover stolen funds. Cannot revoke automatically without your signature. Cannot access anything beyond public on-chain data.
 </p>
 </div>
 </div>
 </section>

 <section className="space-y-6">
 <h3 id="connect-your-wallet" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 Connecting your wallet.
 </h3>
 <ol className="space-y-5">
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">01</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Click Connect Wallet.</strong> On the homepage, the Connect Wallet button opens a modal with MetaMask, WalletConnect, and other EVM-compatible wallets.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">02</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Choose your provider.</strong> Pick your wallet. MetaMask prompts directly. WalletConnect shows a QR code to scan with a mobile wallet.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">03</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Approve the connection.</strong> Your wallet asks for permission to read your public address and balances. It does <em>not</em> request permission to move funds or access your keys.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">04</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">What the connection means.</strong> Read-only link between AllowanceGuard and your wallet. We see your public address and allowances. We cannot sign transactions. You sign every transaction yourself &mdash; we have no ability to.
 </p>
 </li>
 </ol>
 </section>
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
 <div className="space-y-16">
 <section className="space-y-5">
 <h2 id="core-concepts" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
 Core concepts.
 </h2>
 <p className="font-plex text-lg text-ink-muted leading-[1.6]">
 Three ideas underpin everything AllowanceGuard does. Read them once.
 </p>
 </section>

 <section className="space-y-5">
 <h3 id="revocation-process" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 Revocation sets the allowance to zero.
 </h3>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 A revocation is a blockchain transaction that sets the spending limit for a specific token and contract to zero. For ERC-20, it calls <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">approve(spender, 0)</code>. For ERC-721 and ERC-1155, it calls <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">setApprovalForAll(spender, false)</code>. Both are standard ERC functions used by every legitimate dApp and extensively audited. Gas pays the network validators. Once confirmed, the contract cannot access those tokens again until you explicitly grant a new allowance.
 </p>
 </section>

 <section className="space-y-7">
 <h3 id="data-privacy" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 We read public data. Nothing else.
 </h3>
 <div className="grid sm:grid-cols-3 gap-x-10 gap-y-6">
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">What we fetch</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Only public on-chain data &mdash; your wallet address, token balances, and allowances. Already visible on any block explorer.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">What we cache</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Allowance data, briefly, to avoid re-querying RPCs. Encrypted at rest (AES-256), auto-purged on a retention schedule. Anonymised usage telemetry that cannot be linked to a wallet.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">What we never store</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Private keys. Seed phrases. Personal information. Signed transactions. Anything that could move your funds. Those never reach our infrastructure.
 </p>
 </div>
 </div>
 </section>

 <section className="space-y-5">
 <h3 id="non-custodial" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 You sign every transaction. Always.
 </h3>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 AllowanceGuard is strictly non-custodial. We never hold your private keys, your funds, or any credential that could move them. Every revoke goes through your own wallet with your explicit signature. The platform advises and builds transactions &mdash; it does not custody, intermediate, or act on your behalf.
 </p>
 </section>
 </div>
 )

 case 'usage-guides':
 return (
 <div className="space-y-16">
 <section className="space-y-5">
 <h2 id="usage-guides" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
 How-to guides.
 </h2>
 <p className="font-plex text-lg text-ink-muted leading-[1.6]">
 Four things you&rsquo;ll do in the dashboard. In order of frequency.
 </p>
 </section>

 <section className="space-y-7">
 <h3 id="dashboard" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 Read your dashboard.
 </h3>
 <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Token</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Symbol, name, contract address. Click the name to view details and verify the contract on its explorer.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Spender</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 The smart contract you granted the allowance to. Check the address matches the protocol you expect &mdash; DEX router, NFT marketplace, lending vault.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Amount</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 The approved spending ceiling. <em>Unlimited</em> means 2^256&minus;1 &mdash; the highest-risk state. A specific number is safer.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Risk score</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 80+ act now. 40&ndash;79 review soon. 0&ndash;39 generally safe. The rule breakdown is always visible on the row.
 </p>
 </div>
 </div>
 </section>

 <section className="space-y-6">
 <h3 id="single-revoke" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 Revoke one approval.
 </h3>
 <ol className="space-y-5">
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">01</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Find the approval.</strong> Sort by risk to surface the most urgent first. Check unlimited approvals and high scores before anything else.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">02</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Click Revoke.</strong> We construct the transaction that sets the allowance to zero &mdash; nothing else.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">03</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Verify in your wallet.</strong> Your wallet shows the gas fee and the transaction details. Confirm the spender address matches what you expect.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">04</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Sign and send.</strong> Once the transaction confirms, the allowance is zero on-chain. The risk is gone.
 </p>
 </li>
 </ol>
 </section>

 <section className="space-y-5">
 <h3 id="batch-revoke" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 Revoke many at once.
 </h3>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Tick the checkboxes on several approvals and click <strong className="text-ink font-semibold">Batch revoke</strong>. A single transaction revokes every selected allowance &mdash; which cuts gas roughly 70% versus one-by-one, because you pay the base transaction fee once instead of many times. Especially helpful on L1.
 </p>
 </section>

 <section className="space-y-5">
 <h3 id="token-discovery" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 Find and search tokens.
 </h3>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 The Discover Tokens page exposes our token database across all 27 chains. Fuzzy search by name, symbol, or contract address (PostgreSQL trigram index, so typos are forgiving). Filter by chain, category &mdash; DeFi, NFT, stablecoins, governance &mdash; and verification status. Submit new tokens; submissions are validated on-chain and reviewed before going public.
 </p>
 </section>
 </div>
 )

 case 'advanced-topics':
 return <ArchitectureSection />
 default:
 return null
 }
}
