import { Globe, Shield, Zap, Eye, Lock, Cpu, AlertTriangle, TrendingUp } from 'lucide-react'
import { supportedNetworks } from './docs-data'

interface Props { section: string }

/** Docs content: overview, getting-started, networks, risk-scoring, core-concepts, usage-guides, advanced-topics */
export default function DocsContentPrimary({ section }: Props) {
  switch (section) {
    case 'overview':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="overview" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              AllowanceGuard Documentation
            </h2>
            <p className="text-base text-slate-400 leading-relaxed mb-8">
              Your complete guide to wallet security. Understand, manage, and revoke token approvals across 10 blockchain networks.
            </p>

            <h3 id="what-is-allowanceguard" className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              What is AllowanceGuard?
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              A non-custodial security platform providing oversight of your wallet&apos;s token approvals across multiple blockchain networks. It identifies, assesses, and helps neutralize security risks from forgotten or malicious token allowances — critical infrastructure for the Web3 ecosystem.
            </p>

            <h3 id="key-features" className="text-lg font-semibold text-slate-100 mb-4">Key Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                { icon: Globe, title: '10 Networks', desc: 'Ethereum, Arbitrum, Base, Polygon, Optimism, Avalanche, BSC, Fantom, zkSync, Polygon zkEVM.' },
                { icon: AlertTriangle, title: 'Risk Intelligence', desc: 'Rule-based scoring identifies unlimited approvals, malicious contracts, and anomalous patterns.' },
                { icon: Lock, title: 'Non-Custodial', desc: 'Your keys never leave your device. All transactions signed locally by your wallet.' },
                { icon: Zap, title: 'Gas-Optimized', desc: 'Batch revocation saves up to 70% on gas through efficient transaction batching.' },
              ].map((f) => (
                <div key={f.title} className="rounded-xl p-4 bg-slate-800/40 border border-slate-700/50 hover:border-amber-500/20 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                    <f.icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 mb-1">{f.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <h3 id="how-it-works" className="text-lg font-semibold text-slate-100 mb-4">How It Works</h3>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Connect & Scan', desc: 'Connect your wallet using standard protocols. We read public blockchain data to identify all token approvals.' },
                { step: '2', title: 'Analyse & Assess', desc: 'Our risk engine evaluates each approval using heuristics: amounts, contract reputation, time since interaction, threat intelligence.' },
                { step: '3', title: 'Review & Understand', desc: 'View your complete security posture in a dashboard that presents actionable information.' },
                { step: '4', title: 'Act & Secure', desc: 'Revoke risky approvals with one-click operations executed directly from your wallet.' },
                { step: '5', title: 'Monitor & Protect', desc: 'Set up autonomous monitoring and alerts for continuous security oversight.' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                  <span className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-sm font-bold text-amber-400 shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{s.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'getting-started':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="getting-started" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Quick Start
            </h2>

            <h3 id="what-are-token-allowances" className="text-lg font-semibold text-slate-100 mb-3">What Are Token Allowances?</h3>
            <div className="rounded-xl p-4 bg-amber-500/5 border border-amber-500/20 mb-6">
              <p className="text-sm text-slate-300 leading-relaxed">
                Think of a token allowance like giving a valet a specific car key — not your entire keyring. When you interact with DeFi protocols (Uniswap, OpenSea, etc.), you grant them permission to spend specific token amounts. These permissions <strong className="text-amber-400">persist after you&apos;re done</strong>, creating security risks if unchecked.
              </p>
            </div>

            <h3 id="what-this-tool-does" className="text-lg font-semibold text-slate-100 mb-3">What This Tool Does (And Does Not)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl p-4 bg-emerald-500/5 border border-emerald-500/20">
                <h4 className="text-sm font-semibold text-emerald-400 mb-2">AllowanceGuard does:</h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Scan across 10 networks for all token approvals</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Assess each approval for security risks</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Provide one-click and batch revocation</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Monitor and alert on new approvals</li>
                </ul>
              </div>
              <div className="rounded-xl p-4 bg-red-500/5 border border-red-500/20">
                <h4 className="text-sm font-semibold text-red-400 mb-2">AllowanceGuard does NOT:</h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span> Access your private keys or move funds</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span> Prevent all types of scams</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span> Recover already-stolen funds</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span> Auto-revoke without your explicit permission</li>
                </ul>
              </div>
            </div>

            <h3 id="connect-your-wallet" className="text-lg font-semibold text-slate-100 mb-3">Connecting Your Wallet</h3>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Click "Connect Wallet"', desc: 'Opens a modal with MetaMask, WalletConnect, and other EVM-compatible wallet options.' },
                { step: '2', title: 'Select your wallet', desc: 'Choose your provider. MetaMask prompts directly; WalletConnect shows a QR code for mobile wallets.' },
                { step: '3', title: 'Approve the connection', desc: 'This only requests read access to your public address and balances. No permission to move funds or access private keys.' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{s.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'networks':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="supported-networks" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Supported Networks
            </h2>
            <p className="text-sm text-slate-400 mb-6">AllowanceGuard supports 10 EVM-compatible networks:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supportedNetworks.map((network) => (
                <div key={network.chainId} className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-200">{network.name}</h4>
                    <p className="text-xs text-slate-500">Chain ID: {network.chainId}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
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
            <h2 id="risk-scoring-system" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Risk Scoring
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Transparent, rule-based scoring that evaluates each approval against security heuristics. Designed to err on the side of caution.
            </p>

            <h3 id="risk-heuristics" className="text-lg font-semibold text-slate-100 mb-3">Heuristic Rules</h3>
            <div className="space-y-2 mb-8">
              {[
                { points: '+50', label: 'Unlimited Approvals', desc: 'Max uint256 value — grants unlimited spending power.', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                { points: '+40', label: 'Malicious Address Match', desc: 'Spender on known malicious address lists.', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                { points: '+20', label: 'Unverified Contract', desc: 'No verified source code on block explorers.', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                { points: '+15', label: 'Anomalous Amount', desc: 'Significantly larger than typical usage patterns.', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                { points: '+10', label: 'Stale Approval', desc: 'Unused for 90+ days without activity.', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
                { points: '+5–25', label: 'High-Value Exposure', desc: 'Significant value relative to total holdings.', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <span className={`text-xs font-bold font-mono px-2 py-1 rounded border shrink-0 ${r.color}`}>{r.points}</span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-200">{r.label}</h4>
                    <p className="text-xs text-slate-400">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 id="risk-levels" className="text-lg font-semibold text-slate-100 mb-3">Risk Levels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl p-4 bg-red-500/5 border border-red-500/20">
                <div className="text-sm font-bold text-red-400 mb-1">High Risk (80+)</div>
                <p className="text-xs text-slate-400">Immediate action recommended. Unlimited amounts, malicious contracts, or multiple risk factors combined.</p>
              </div>
              <div className="rounded-xl p-4 bg-amber-500/5 border border-amber-500/20">
                <div className="text-sm font-bold text-amber-400 mb-1">Medium Risk (40–79)</div>
                <p className="text-xs text-slate-400">Review recommended. Evaluate whether the approval is still needed and if the spender is trustworthy.</p>
              </div>
              <div className="rounded-xl p-4 bg-emerald-500/5 border border-emerald-500/20">
                <div className="text-sm font-bold text-emerald-400 mb-1">Low Risk (0–39)</div>
                <p className="text-xs text-slate-400">Generally safe. Trusted sources with reasonable amounts and recent activity. Periodic review advised.</p>
              </div>
            </div>
          </div>
        </div>
      )

    case 'core-concepts':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="core-concepts" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Core Concepts
            </h2>

            <h3 id="revocation-process" className="text-lg font-semibold text-slate-100 mb-3">The Revocation Process</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Revoking an allowance executes a blockchain transaction that sets the spending limit to zero. For ERC-20 tokens this calls <code className="text-amber-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">approve(spender, 0)</code> and for ERC-721 it calls <code className="text-amber-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">setApprovalForAll(spender, false)</code>. These standard functions have been extensively tested by the Ethereum community. The transaction requires gas fees and, once confirmed, the contract can no longer access those tokens.
            </p>

            <h3 id="data-privacy" className="text-lg font-semibold text-slate-100 mb-3">Data Privacy</h3>
            <div className="space-y-3 mb-6">
              {[
                { title: 'What we fetch', desc: 'Only public on-chain data: wallet address, token balances, allowance info. Already visible on block explorers.', icon: Eye },
                { title: 'What we cache', desc: 'Allowance data cached temporarily for performance. Encrypted at rest (AES-256), auto-purged after retention period.', icon: Cpu },
                { title: 'What we never store', desc: 'Private keys, seed phrases, personal information. Your keys never leave your device.', icon: Lock },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 id="non-custodial" className="text-lg font-semibold text-slate-100 mb-3">Non-Custodial Model</h3>
            <div className="rounded-xl p-4 bg-amber-500/5 border border-amber-500/20">
              <p className="text-sm text-slate-300 leading-relaxed">
                AllowanceGuard operates on a strict non-custodial model. We never hold your private keys, funds, or sensitive credentials. All operations execute directly from your wallet with your explicit approval. The platform is a security advisor and tool — not a custodian.
              </p>
            </div>
          </div>
        </div>
      )

    case 'usage-guides':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="usage-guides" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Usage Guides
            </h2>

            <h3 id="dashboard" className="text-lg font-semibold text-slate-100 mb-3">Interpreting Your Dashboard</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-2 pr-4 text-[11px] text-slate-500 uppercase tracking-wide font-medium">Column</th>
                    <th className="text-left py-2 text-[11px] text-slate-500 uppercase tracking-wide font-medium">What it shows</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-400">
                  <tr className="border-b border-slate-700/30"><td className="py-2.5 pr-4 font-medium text-slate-200">Token</td><td className="py-2.5">Symbol, name, and contract address. Click to verify on explorer.</td></tr>
                  <tr className="border-b border-slate-700/30"><td className="py-2.5 pr-4 font-medium text-slate-200">Spender</td><td className="py-2.5">Contract address with spending permission (DEX router, marketplace, etc.).</td></tr>
                  <tr className="border-b border-slate-700/30"><td className="py-2.5 pr-4 font-medium text-slate-200">Amount</td><td className="py-2.5">&quot;Unlimited&quot; = max uint256 (highest risk). Otherwise exact token quantity.</td></tr>
                  <tr><td className="py-2.5 pr-4 font-medium text-slate-200">Risk Score</td><td className="py-2.5">Heuristic score. 80+ = immediate attention. 40–79 = review. 0–39 = generally safe.</td></tr>
                </tbody>
              </table>
            </div>

            <h3 id="single-revoke" className="text-lg font-semibold text-slate-100 mb-3">Single Revoke</h3>
            <div className="space-y-2 mb-6">
              {[
                'Identify the risky approval in your dashboard.',
                'Click "Revoke" — this prepares an approve(spender, 0) transaction.',
                'Review the transaction details and gas estimate in your wallet.',
                'Confirm and sign. Once confirmed on-chain, the risk is eliminated.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 text-xs text-slate-400">
                  <span className="w-5 h-5 rounded bg-slate-700/50 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>

            <h3 id="batch-revoke" className="text-lg font-semibold text-slate-100 mb-3">Batch Revoke</h3>
            <div className="rounded-xl p-4 bg-slate-800/40 border border-slate-700/50">
              <p className="text-sm text-slate-300 mb-3">Select multiple approvals using checkboxes, then click &quot;Batch Revoke&quot; to revoke them all in a single optimised transaction.</p>
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <TrendingUp className="w-4 h-4" />
                <span>Saves up to 70% on gas vs individual revocations.</span>
              </div>
            </div>
          </div>
        </div>
      )

    case 'advanced-topics':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="architecture" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Architecture
            </h2>

            <h3 id="system-layers" className="text-lg font-semibold text-slate-100 mb-4">System Layers</h3>
            <div className="space-y-3 mb-8">
              {[
                { title: 'Frontend', desc: 'Next.js + React. Connects to wallets via MetaMask/WalletConnect. Handles transaction signing and user interactions.', icon: Eye },
                { title: 'Backend API', desc: 'Node.js API layer. Processes scan requests, manages job queues, provides allowance data with caching.', icon: Cpu },
                { title: 'Blockchain Indexer', desc: 'Custom indexer scanning blockchain data for token approvals. Real-time updates across all supported networks.', icon: Globe },
                { title: 'Risk Engine', desc: 'Rule-based assessment against security heuristics. Integrates threat intelligence feeds and malicious address databases.', icon: Shield },
              ].map((layer) => (
                <div key={layer.title} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <layer.icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{layer.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{layer.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 id="smart-contracts" className="text-lg font-semibold text-slate-100 mb-3">Smart Contract Integration</h3>
            <div className="space-y-3">
              <div className="rounded-xl p-4 bg-slate-800/30 border border-slate-700/30">
                <h4 className="text-sm font-semibold text-slate-200 mb-1">Standard ERC Functions</h4>
                <p className="text-xs text-slate-400">Only standard, well-audited ERC-20 and ERC-721 functions. No custom contracts that could introduce attack vectors.</p>
              </div>
              <div className="rounded-xl p-4 bg-slate-800/30 border border-slate-700/30">
                <h4 className="text-sm font-semibold text-slate-200 mb-1">Batch Revoke Contract</h4>
                <p className="text-xs text-slate-400">Verified contract for multi-revocation in a single transaction. Address and ABI publicly available for transparency.</p>
              </div>
              <div className="rounded-xl p-4 bg-slate-800/30 border border-slate-700/30">
                <h4 className="text-sm font-semibold text-slate-200 mb-1">Developer Integration</h4>
                <p className="text-xs text-slate-400">Integrate via APIs or smart contracts. Support for web3.js, ethers.js, and popular blockchain libraries.</p>
              </div>
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}
