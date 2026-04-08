'use client'

import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import CountUp from '@/components/ui/CountUp'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

/**
 * One hero stat at display-8xl + three supporting stats inline.
 * Breaks the old 4-up grid uniformity. Maren's law #2: strip then amplify.
 */

const HERO_STAT = {
  value: 3.2,
  prefix: '$',
  suffix: 'B+',
  label: 'Lost in 2024',
  sub: 'to approval-based exploits across DeFi. The single largest attack surface in Web3.',
}

const SUPPORTING = [
  { value: 73, suffix: '%', label: 'of DeFi attacks', sub: 'exploit approvals as the primary vector' },
  { value: 47, suffix: '', label: 'avg approvals', sub: 'active per wallet across major chains' },
  { value: 60, prefix: '<', suffix: 's', label: 'scan time', sub: 'for a comprehensive security audit' },
]

const RISKS = [
  {
    title: 'Unlimited Approvals',
    description:
      'Allow unlimited token spending, creating maximum risk exposure. Should be avoided whenever possible.',
    level: 'Critical',
    color: '#F59E0B',
    ringColor: 'rgba(245,158,11,0.25)',
  },
  {
    title: 'Abandoned Contracts',
    description:
      'Contracts no longer maintained or compromised. Ongoing security risk with no active mitigation.',
    level: 'High',
    color: '#F97316',
    ringColor: 'rgba(249,115,22,0.22)',
  },
  {
    title: 'Malicious Contracts',
    description:
      'Known malicious or suspicious contracts that pose immediate security threats. Revoke immediately.',
    level: 'Critical',
    color: '#EF4444',
    ringColor: 'rgba(239,68,68,0.22)',
  },
]

export default function StatisticsSection() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-[#0B1220] overflow-hidden">
      {/* Atmospheric amber glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <Container>
        <div className="mb-20 lg:mb-28">
          <SectionHeader
            index="02"
            eyebrow="The numbers"
            title={
              <>
                The hidden risk
                <br />
                <span className="text-slate-500">in every wallet.</span>
              </>
            }
            lede="Token approvals are the silent vulnerability of every DeFi user. Here is what the data says."
          />
        </div>

        {/* Hero stat — breaks the grid */}
        <CascadingScrollAnimation direction="up" distance={50} delay={0}>
          <div className="mb-20 lg:mb-28 grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-8">
              <div className="text-[11px] font-mono font-bold tracking-[0.22em] uppercase text-amber-400 mb-4">
                {HERO_STAT.label}
              </div>
              <div className="font-display font-bold text-white tracking-tight leading-[0.85] text-7xl sm:text-8xl lg:text-[11rem] xl:text-[13rem]">
                {HERO_STAT.prefix}
                <CountUp value={HERO_STAT.value} suffix={HERO_STAT.suffix} duration={1.6} delay={0.3} />
              </div>
            </div>
            <div className="lg:col-span-4 lg:pb-6">
              <p className="text-base lg:text-lg text-slate-300 leading-relaxed max-w-sm">
                {HERO_STAT.sub}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-xs font-mono text-rose-400">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                +47% year over year
              </div>
            </div>
          </div>
        </CascadingScrollAnimation>

        {/* Supporting stats — inline row, density contrast */}
        <div className="border-t border-white/10 pt-10 mb-24 lg:mb-32">
          <div className="grid sm:grid-cols-3 gap-10 lg:gap-16">
            {SUPPORTING.map((s, i) => (
              <CascadingScrollAnimation key={s.label} direction="up" distance={30} delay={i * 100}>
                <div>
                  <div className="font-display text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none mb-3">
                    {s.prefix ?? ''}
                    <CountUp value={s.value} suffix={s.suffix} duration={1.2} delay={0.3} />
                  </div>
                  <div className="text-sm font-semibold text-slate-200 mb-1">{s.label}</div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[26ch]">{s.sub}</p>
                </div>
              </CascadingScrollAnimation>
            ))}
          </div>
        </div>

        {/* Risks */}
        <CascadingScrollAnimation direction="up" distance={40} delay={0}>
          <div className="mb-10">
            <div className="text-[11px] font-mono font-bold tracking-[0.22em] uppercase text-slate-400 mb-3">
              Common approval risks
            </div>
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight">
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
  ringColor,
}: (typeof RISKS)[number]) {
  return (
    <div
      className="rounded-xl p-5 lg:p-6 glass-card"
      style={{ boxShadow: `inset 0 0 0 1px ${ringColor}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-base lg:text-lg font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        </div>
        <span
          className="shrink-0 text-[10px] font-mono font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
          style={{ color, boxShadow: `inset 0 0 0 1px ${ringColor}` }}
        >
          {level}
        </span>
      </div>
    </div>
  )
}
