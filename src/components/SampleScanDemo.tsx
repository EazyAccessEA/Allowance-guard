'use client'

/**
 * SampleScanDemo — the recognition moment.
 *
 * Shows a static, realistic scan result table BEFORE asking the visitor
 * to take action. The reciprocity principle: deliver the product visual
 * first, ask for the connection second.
 *
 * No JS, no fetch, no real wallet — just markup that demonstrates the
 * format and severity of what we'd find. Council:
 *  #5 Marketing: reciprocity + product proof in a single component
 *  #9 Lawyer: clearly labelled "Sample" so no false claim of real data
 *  #13 UX writer: plain English risk explanations, no Web3 jargon
 *  #15 Architect: zero JS, zero state — pure presentation
 */

import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'

interface SampleApproval {
  token: string
  symbol: string
  spender: string
  spenderShort: string
  chain: string
  amount: string
  riskLevel: 'critical' | 'high' | 'low'
  riskLabel: string
  reason: string
}

const SAMPLE_APPROVALS: SampleApproval[] = [
  {
    token: 'USD Coin',
    symbol: 'USDC',
    spender: '0x1111111254eeb25477b68fb85ed929f73a960582',
    spenderShort: '1inch v5 router',
    chain: 'Ethereum',
    amount: 'Unlimited',
    riskLevel: 'critical',
    riskLabel: 'Critical',
    reason: 'Unlimited approval to a swap router',
  },
  {
    token: 'Wrapped Ether',
    symbol: 'WETH',
    spender: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    spenderShort: 'Uniswap Permit2',
    chain: 'Base',
    amount: '125.0',
    riskLevel: 'low',
    riskLabel: 'Low',
    reason: 'Capped permit, recently used',
  },
  {
    token: 'Tether USD',
    symbol: 'USDT',
    spender: '0x9008d19f58aabd9ed0d60971565aa8510560ab41',
    spenderShort: 'CoW Protocol',
    chain: 'Arbitrum',
    amount: 'Unlimited',
    riskLevel: 'high',
    riskLabel: 'High',
    reason: 'Approved 14 months ago, dApp unused since',
  },
  {
    token: 'Uniswap',
    symbol: 'UNI',
    spender: '0xdef171fe48cf0115b1d80b88dc8eab59176fee57',
    spenderShort: 'Paraswap v5',
    chain: 'Polygon',
    amount: 'Unlimited',
    riskLevel: 'critical',
    riskLabel: 'Critical',
    reason: 'Unlimited approval to deprecated router',
  },
]

const RISK_COLORS: Record<SampleApproval['riskLevel'], string> = {
  critical: '#DC2626',
  high: '#B4730A',
  low: '#3F6B47',
}

export default function SampleScanDemo() {
  return (
    <section className="paper grain relative py-20 sm:py-28 lg:py-32 overflow-hidden">
      <Container>
        <div className="mb-14 lg:mb-16">
          <SectionHeader
            number="02"
            eyebrow="What you&rsquo;d see"
            title={
              <>
                Here&rsquo;s what a real scan
                <br />
                <span className="text-ink-muted">looks like.</span>
              </>
            }
            lede="A sample wallet, scanned across four chains. Yours could look like this in under a minute. No connection required."
          />
        </div>

        <div className="paper-card-raised overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 lg:px-8 py-4 border-b border-ink-rule bg-paper-deep/50">
            <div className="col-span-3 font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-ink-whisper">
              Token
            </div>
            <div className="col-span-3 font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-ink-whisper">
              Approved spender
            </div>
            <div className="col-span-2 font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-ink-whisper">
              Chain
            </div>
            <div className="col-span-2 font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-ink-whisper text-right">
              Amount
            </div>
            <div className="col-span-2 font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-ink-whisper text-right">
              Risk
            </div>
          </div>

          {/* Rows */}
          {SAMPLE_APPROVALS.map((row, i) => (
            <div
              key={i}
              className={`px-6 lg:px-8 py-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 md:items-center ${
                i < SAMPLE_APPROVALS.length - 1 ? 'border-b border-ink-rule' : ''
              }`}
            >
              {/* Token */}
              <div className="md:col-span-3">
                <div className="font-plex text-sm font-semibold text-ink">{row.symbol}</div>
                <div className="font-plex text-xs text-ink-whisper">{row.token}</div>
              </div>

              {/* Spender */}
              <div className="md:col-span-3 min-w-0">
                <div className="font-plex text-sm text-ink truncate">{row.spenderShort}</div>
                <div className="font-mono text-[10px] text-ink-whisper truncate">
                  {row.spender.slice(0, 10)}…{row.spender.slice(-6)}
                </div>
              </div>

              {/* Chain */}
              <div className="md:col-span-2">
                <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-ink-muted">
                  {row.chain}
                </span>
              </div>

              {/* Amount */}
              <div className="md:col-span-2 md:text-right">
                <span
                  className={`font-plex font-bold text-lg tabular-nums ${
                    row.amount === 'Unlimited' ? 'text-crimson-paper' : 'text-ink'
                  }`}
                >
                  {row.amount}
                </span>
              </div>

              {/* Risk */}
              <div className="md:col-span-2 md:text-right">
                <div className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-2 h-2"
                    style={{ backgroundColor: RISK_COLORS[row.riskLevel] }}
                  />
                  <span
                    className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase"
                    style={{ color: RISK_COLORS[row.riskLevel] }}
                  >
                    {row.riskLabel}
                  </span>
                </div>
                <div className="font-plex text-xs text-ink-whisper mt-1 md:max-w-[180px] md:ml-auto">
                  {row.reason}
                </div>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="px-6 lg:px-8 py-4 bg-paper-deep/40 border-t border-ink-rule flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="font-mono text-[10px] font-bold tracking-wider uppercase text-ink-whisper">
              Sample wallet · 4 of 47 approvals shown · Not a real address
            </div>
            <div className="font-mono text-[10px] font-bold tracking-wider uppercase text-amber-deep">
              Scanned in 58s
            </div>
          </div>
        </div>

        {/* Reciprocity nudge */}
        <p className="mt-8 max-w-xl font-plex text-base text-ink-muted leading-[1.6]">
          The scanner reads only public blockchain data. You&rsquo;ll see every approval &mdash; sorted by risk, with the dApp name, the chain, and exactly why it&rsquo;s flagged. Then you decide what to revoke.
        </p>
      </Container>
    </section>
  )
}
