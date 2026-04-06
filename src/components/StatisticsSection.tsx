'use client'

import Container from '@/components/ui/Container'
import CountUp from '@/components/ui/CountUp'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

const STATS = [
  { value: 3.2, prefix: '$', suffix: 'B+', label: 'Lost in 2024', sub: 'to approval-based exploits across DeFi', trend: '+47%', trendNeg: true },
  { value: 73, suffix: '%', label: 'of DeFi attacks', sub: 'exploit token approvals as primary vector', trend: '+12%', trendNeg: true },
  { value: 47, suffix: '', label: 'avg approvals', sub: 'active per wallet across major chains', trend: null, trendNeg: false },
  { value: 60, prefix: '<', suffix: 's', label: 'scan time', sub: 'for a comprehensive security audit', trend: '-30%', trendNeg: false },
]

const RISKS = [
  {
    title: 'Unlimited Approvals',
    description: 'Allow unlimited token spending, creating maximum risk exposure. Should be avoided whenever possible.',
    level: 'Critical',
    color: '#E53E3E',
    bgColor: 'rgba(229,62,62,0.06)',
    ringColor: 'rgba(229,62,62,0.15)',
  },
  {
    title: 'Abandoned Contracts',
    description: 'Contracts no longer maintained or compromised. These pose ongoing security risks with no active mitigation.',
    level: 'High',
    color: '#F97316',
    bgColor: 'rgba(249,115,22,0.05)',
    ringColor: 'rgba(249,115,22,0.12)',
  },
  {
    title: 'Malicious Contracts',
    description: 'Known malicious or suspicious contracts that pose immediate security threats. Revoke immediately.',
    level: 'Critical',
    color: '#EF4444',
    bgColor: 'rgba(239,68,68,0.05)',
    ringColor: 'rgba(239,68,68,0.12)',
  },
]

export default function StatisticsSection() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-[#0A0E1A] overflow-hidden">
      {/* Gradient transition */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'linear-gradient(to bottom, #0A0E1A 0%, transparent 100%)' }}
      />

      {/* Atmospheric crimson glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse, rgba(229,62,62,0.05) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      <Container>
        {/* Section header */}
        <CascadingScrollAnimation direction="up" distance={40} delay={0}>
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 ring-crimson-500/20 bg-crimson-500/5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-crimson-400 animate-pulse" />
              <span className="text-xs font-medium text-crimson-400 tracking-wide uppercase">Security Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1] mb-6">
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
                The Hidden Risk
              </span>
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                {' '}in Every Wallet
              </span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Token approvals are the silent vulnerability that affects every DeFi user.
            </p>
          </div>
        </CascadingScrollAnimation>

        {/* Stats grid — tight density */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-16">
          {STATS.map((stat, i) => (
            <CascadingScrollAnimation key={stat.label} direction="up" distance={30} delay={i * 100}>
              <StatCard {...stat} />
            </CascadingScrollAnimation>
          ))}
        </div>

        {/* Risk types — stacked, spacious */}
        <CascadingScrollAnimation direction="up" distance={40} delay={200}>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-4 tracking-tight">Common Approval Risks</h3>
            {RISKS.map((risk) => (
              <RiskRow key={risk.title} {...risk} />
            ))}
          </div>
        </CascadingScrollAnimation>
      </Container>
    </section>
  )
}

function StatCard({ value, prefix, suffix, label, sub, trend, trendNeg }: (typeof STATS)[number]) {
  return (
    <div className="rounded-xl p-5 lg:p-6 bg-white/[0.02] ring-1 ring-white/[0.06]">
      <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-1">
        {prefix}
        <CountUp value={value} suffix={suffix} duration={1.4} delay={0.3} />
      </div>
      <div className="text-sm font-medium text-slate-300 mb-1">{label}</div>
      <p className="text-xs text-slate-500 leading-relaxed mb-2">{sub}</p>
      {trend && (
        <span
          className="text-xs font-mono font-medium"
          style={{ color: trendNeg ? '#F87171' : '#00F0C8' }}
        >
          {trend}
        </span>
      )}
    </div>
  )
}

function RiskRow({ title, description, level, color, bgColor, ringColor }: (typeof RISKS)[number]) {
  return (
    <div
      className="rounded-xl p-5 lg:p-6 transition-colors duration-200"
      style={{
        backgroundColor: bgColor,
        boxShadow: `inset 0 0 0 1px ${ringColor}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        </div>
        <span
          className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            color,
            backgroundColor: bgColor,
            boxShadow: `inset 0 0 0 1px ${ringColor}`,
          }}
        >
          {level}
        </span>
      </div>
    </div>
  )
}
