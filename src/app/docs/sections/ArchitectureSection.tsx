/**
 * Architecture section — quiet-bold, teaching-generous.
 *
 * Extracted from DocsContentPrimary so that file stays under the 600-line
 * limit after the overview/getting-started/core-concepts/usage-guides
 * rewrites. Scope boundary: this file owns the "advanced-topics" section
 * rendered when the sidebar selects it.
 *
 * Council:
 *  Kael: No rounded-xl/lg. No amber-400 tints. Paper surfaces only.
 *  #7 Maren: Scale contrast carries the page; frames retired.
 *  Noor: amber-deep on paper is AA; font-mono metadata at ink-whisper level.
 */

import Link from 'next/link'

interface Endpoint { method: 'GET' | 'POST'; path: string; desc: string }

const endpoints: Endpoint[] = [
  { method: 'POST', path: '/scan',           desc: 'Queue a wallet scan. Returns scanId and statusUrl. Rate-limited per key plan.' },
  { method: 'GET',  path: '/scan/{id}',      desc: '404s for scans owned by a different key.' },
  { method: 'GET',  path: '/allowances',     desc: 'Paginated approvals for a wallet. chainId, riskOnly, page, pageSize.' },
  { method: 'GET',  path: '/risk-score',     desc: 'Aggregated wallet risk score with breakdown and top risks.' },
  { method: 'GET',  path: '/portfolio-risk', desc: 'Cross-chain portfolio risk with per-chain breakdown, trend, benchmark.' },
  { method: 'POST', path: '/risk-check',     desc: 'Pre-signing assessment for a proposed approve() transaction.' },
  { method: 'POST', path: '/simulate',       desc: 'Before/after risk comparison for a hypothetical revoke. No state change.' },
  { method: 'GET',  path: '/chains',         desc: 'List the 27 supported chains with chainId, name, symbol, explorer.' },
]

export default function ArchitectureSection() {
  return (
    <div className="space-y-16">
      <section className="space-y-5">
        <h2 id="architecture" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
          Architecture.
        </h2>
        <p className="font-plex text-lg text-ink-muted leading-[1.6]">
          The system is small on purpose. Four layers, all open source, each doing one job.
        </p>
      </section>

      <section className="space-y-7">
        <h3 id="system-layers" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          Four layers.
        </h3>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Frontend</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Next.js + React. Connects directly to wallets via MetaMask or WalletConnect. Handles signing; never sees keys.
            </p>
          </div>
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Backend API</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Node.js. Processes scans, manages a job queue, serves allowance data. Talks to RPC providers. Caches briefly for speed.
            </p>
          </div>
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Indexer</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Reads historical approvals on every supported chain, keeps up with new blocks, surfaces changes for monitoring.
            </p>
          </div>
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Risk engine</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Rule-based. Every score is the sum of rule hits you can read. No black box. No proprietary &ldquo;AI threat model.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 id="smart-contracts" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          Standard ERC functions only.
        </h3>
        <div className="space-y-5">
          <p className="font-plex text-base text-ink-muted leading-[1.6]">
            Revocations use <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">approve(spender, 0)</code> for ERC-20 and <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">setApprovalForAll(spender, false)</code> for ERC-721 / ERC-1155. These are the well-audited, community-standard functions used by every legitimate dApp. We don&rsquo;t deploy bespoke contracts for the revoke itself; there&rsquo;s nothing novel to audit.
          </p>
          <p className="font-plex text-base text-ink-muted leading-[1.6]">
            For batch revocation we use a verified helper contract whose address and ABI are public on the explorer. One transaction, many approvals zeroed, predictable gas.
          </p>
          <p className="font-plex text-base text-ink-muted leading-[1.6]">
            For developer integration we publish an OpenAPI spec, Node.js SDK, React hooks, and an embeddable widget &mdash; all documented in the{' '}
            <Link href="/docs/integration" className="text-amber-deep hover:underline underline-offset-2">integration guide</Link>.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h3 id="api-v1" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          API v1 &mdash; the short list.
        </h3>
        <p className="font-plex text-base text-ink-muted leading-[1.6]">
          Every endpoint requires <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">Authorization: Bearer ag_live_*</code> or, for read-only browser use, <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">ag_pub_*</code>. Base URL <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">https://www.allowanceguard.com/api/v1</code>. Full schemas, error codes, and code samples live in the{' '}
          <Link href="/docs/api-reference" className="text-amber-deep hover:underline underline-offset-2">API reference</Link>.
        </p>
        <div className="border-t border-b border-ink-rule divide-y divide-ink-rule">
          {endpoints.map((ep) => (
            <div key={ep.path} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 py-3">
              <div className="flex items-baseline gap-3 sm:w-64 shrink-0">
                <span className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper w-10 shrink-0">{ep.method}</span>
                <span className="font-mono text-sm text-amber-deep truncate">{ep.path}</span>
              </div>
              <p className="font-plex text-sm text-ink-muted leading-[1.5] flex-1 m-0">{ep.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
