'use client'

/**
 * StatisticsSection — Ledger aesthetic
 *
 * Paper-sub section with the page's loudest type moment: "$3.2B+" in
 * IBM Plex Sans Black at display-[13rem]. Supporting stats as a ledger
 * dotted-leader table. Risk list with colored square markers.
 */

import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import Highlight from '@/components/ui/Highlight'
import CountUp from '@/components/ui/CountUp'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

const HERO_STAT = {
  value: 3.2,
  prefix: '$',
  suffix: 'B+',
  label: 'Lost in 2024',
  sub: 'to approval-based exploits across DeFi. The single largest attack surface in Web3.',
  trend: '+47% year over year',
}

const SUPPORTING = [
  { value: 73, suffix: '%', label: 'of DeFi attacks exploit approvals', sub: 'as the primary vector' },
  { value: 47, suffix: '', label: 'average approvals per wallet', sub: 'across major chains' },
  { value: 60, prefix: '<', suffix: 's', label: 'for a comprehensive audit', sub: 'scan time' },
]

const RISKS = [
  {
    title: 'Unlimited Approvals',
    description:
      'Allow unlimited token spending, creating maximum risk exposure. Should be avoided whenever possible.',
    level: 'Critical',
    color: '#DC2626',
  },
  {
    title: 'Abandoned Contracts',
    description:
      'Contracts no longer maintained or compromised. Ongoing security risk with no active mitigation.',
    level: 'High',
    color: '#B4730A',
  },
  {
    title: 'Malicious Contracts',
    description:
      'Known malicious or suspicious contracts that pose immediate security threats. Revoke immediately.',
    level: 'Critical',
    color: '#DC2626',
  },
]

export default function StatisticsSection() {
  return (
    <section className="paper-sub grain relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      <Container>
        <div className="mb-20 lg:mb-28">
          <SectionHeader
            number="01"
            eyebrow="The threat"
            title={
              <>
                Forgotten <Highlight>approvals</Highlight> are
                <br />
                <span className="text-ink-muted">how wallets get drained.</span>
              </>
            }
            lede="A token approval is permission to move your tokens without asking again. It doesn't expire. It doesn't ask twice. And the average wallet has dozens of them."
          />
        </div>

        {/* Hero stat — the loudest type moment on the page */}
        <CascadingScrollAnimation direction="up" distance={50} delay={0}>
          <div className="mb-24 lg:mb-32 grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-8">
              <div className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep mb-4">
                Lost in 2024
              </div>
              <div className="font-display-black text-ink leading-[0.85] text-7xl sm:text-8xl lg:text-[11rem] xl:text-[13rem] tabular-nums">
                {HERO_STAT.prefix}
                <CountUp value={HERO_STAT.value} suffix={HERO_STAT.suffix} duration={1.6} delay={0.3} />
              </div>
              {/* Amber underline */}
              <div
                aria-hidden="true"
                className="mt-2 h-1 max-w-md"
                style={{
                  background: 'linear-gradient(90deg, #F59E0B 0%, rgba(245,158,11,0.35) 70%, transparent 100%)',
                }}
              />
            </div>
            <div className="lg:col-span-4 lg:pb-6">
              <p className="font-plex text-base lg:text-lg text-ink-soft leading-[1.55] max-w-sm">
                {HERO_STAT.sub}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 font-mono text-xs text-crimson-paper font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson-paper" />
                {HERO_STAT.trend}
              </div>
            </div>
          </div>
        </CascadingScrollAnimation>

        {/* Supporting stats — ledger dotted-leader table */}
        <div className="mb-24 lg:mb-32">
          <div className="mb-8 font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
            Supporting data
          </div>
          <div className="space-y-6">
            {SUPPORTING.map((s, i) => (
              <CascadingScrollAnimation key={s.label} direction="up" distance={20} delay={i * 80}>
                <div className="dotted-leader py-3 border-t border-ink-rule">
                  <div>
                    <div className="font-plex text-base text-ink font-medium">{s.label}</div>
                    <div className="font-plex text-xs text-ink-whisper mt-0.5">{s.sub}</div>
                  </div>
                  <div className="font-display-tight text-4xl lg:text-5xl text-ink leading-none tabular-nums">
                    {s.prefix ?? ''}
                    <CountUp value={s.value} suffix={s.suffix} duration={1.2} delay={0.3} />
                  </div>
                </div>
              </CascadingScrollAnimation>
            ))}
          </div>
        </div>

        {/* Risks */}
        <CascadingScrollAnimation direction="up" distance={40} delay={0}>
          <div className="mb-8">
            <div className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper mb-3">
              Common approval risks
            </div>
            <h3 className="font-display-tight text-3xl lg:text-4xl text-ink leading-tight">
              What the scanner looks for.
            </h3>
          </div>
          <div className="space-y-3">
            {RISKS.map((risk) => (
              <RiskRow key={risk.title} {...risk} />
            ))}
          </div>
        </CascadingScrollAnimation>
      </Container>
    </section>
  )
}

function RiskRow({
  title,
  description,
  level,
  color,
}: (typeof RISKS)[number]) {
  return (
    <div className="paper-card p-5 lg:p-6 flex items-start gap-4">
      {/* Colored square marker */}
      <div
        aria-hidden="true"
        className="shrink-0 mt-1 w-3 h-3"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-plex text-base lg:text-lg font-semibold text-ink mb-1">{title}</h4>
        <p className="font-plex text-sm text-ink-muted leading-[1.55]">{description}</p>
      </div>
      <span
        className="shrink-0 font-mono text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-1 border"
        style={{ color, borderColor: color }}
      >
        {level}
      </span>
    </div>
  )
}
