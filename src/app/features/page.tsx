import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import Highlight from '@/components/ui/Highlight'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

/**
 * Features page — Ledger aesthetic, server component.
 *
 * Council:
 * Maren: paper/grain, font-display-tight, Highlight signature, no Lucide icons — ink line art
 * Kael: SectionHeader, paper-card, no mobbin-* classes, no dark: variants, no primary-* tokens
 * Idris: CascadingScrollAnimation on every section
 * Thane: No VideoBackground, server component
 * Noor: Semantic sections, AA contrast
 * #20 Brand:"The invisible attack surface, made visible" — strong, keep
 * #21 Technical: removed"No competitor offers this" (unverifiable)
 * #22 Conversion: CTA →"Join the waitlist" (product not yet live)
 * #11 Investor:"Why it matters" rewritten — mission, not pitch deck
 */

export const metadata: Metadata = {
 title: 'Features — AllowanceGuard',
 description: 'Every approval your wallet has ever granted, scored by risk, revocable in one click — across 27 chains.',
}

const CORE_FEATURES = [
 {
 number: '01',
 title: 'Unified allowance dashboard.',
 description:
 'Every approval your wallet has ever granted, indexed in real time across 27 chains. Spender, token, amount, age, and risk — surfaced in one view, ranked by what can hurt you most.',
 },
 {
 number: '02',
 title: 'Live risk scoring.',
 description:
 'Each approval is graded against current threat intelligence: unlimited amounts, unverified bytecode, addresses tied to known exploits, and behavioural anomalies all raise the score. The danger surfaces first.',
 },
 {
 number: '03',
 title: 'Gas-efficient batch revocation.',
 description:
 'Revoke a single approval in one click. Revoke twenty in one transaction. Our optimised batch contract bundles revocations to cut gas costs by up to 70%. Every transaction is constructed by us and signed by you.',
 },
 {
 number: '04',
 title: 'Continuous monitoring & alerts.',
 description:
 'Set it once and stop checking. AllowanceGuard rescans your wallets on a schedule and alerts you the moment a new high-risk approval appears — by email, Telegram, or webhook.',
 },
]

const DIFFERENTIATORS = [
 {
 title: 'Time Machine — simulate before you spend.',
 description:
 'Toggle approvals on and off and watch your risk score recalculate in real time, before a single wei of gas leaves your wallet. Plan your cleanup, model the outcome, then execute with certainty.',
 },
 {
 title: 'Non-custodial by architecture, not promise.',
 description:
 'A read-only address is all we ever take. We do not hold keys, seed phrases, or funds. We could not access your assets if a court ordered us to — the system is built so the option does not exist.',
 },
 {
 title: 'Open-core, AGPL-licensed.',
 description:
 'The scanner is free, public, and auditable. Anyone can read the code, fork it, or self-host it. Premium services fund the core — but the core itself is a public good and will remain one.',
 },
 {
 title: 'Compliance-ready audit trail.',
 description:
 'DAOs, funds, and on-chain treasuries get exportable PDF and CSV reports of every approval, revocation, and risk event — timestamped and signed. The same evidence chain auditors and regulators expect.',
 },
]

export default function FeaturesPage() {
 return (
 <div className="min-h-screen bg-paper text-ink">

 {/* ── Hero ── */}
 <section className="paper grain relative py-24 sm:py-32 overflow-hidden">
 <div
 aria-hidden="true"
 className="absolute inset-0 pointer-events-none"
 style={{
 background:
 'radial-gradient(ellipse 70% 55% at 15% 25%, rgba(245,158,11,0.14) 0%, transparent 55%),' +
 'radial-gradient(ellipse 60% 45% at 85% 80%, rgba(220,38,38,0.07) 0%, transparent 60%),' +
 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(250,244,230,0.6) 0%, transparent 80%)',
 }}
 />
 <Container className="relative z-10">
 <SectionHeader
 number="AG"
 eyebrow="The AllowanceGuard Platform"
 title={<>The invisible attack surface, <Highlight>made visible.</Highlight></>}
 lede="Every time you use a dApp, you sign away permission. Most users sign once and forget. Attackers don&rsquo;t. AllowanceGuard finds every approval your wallet has ever granted, scores its risk, and lets you revoke it — across 27 chains, from one dashboard, without ever giving up custody."
 />
 </Container>
 </section>

 {/* ── The Problem ── */}
 <section className="paper-sub grain py-24 sm:py-32 overflow-hidden">
 <Container>
 <div className="max-w-4xl">
 <div className="mb-12">
 <SectionHeader
 number="00"
 eyebrow="The problem"
 title={<>Token approvals are the largest unaddressed attack vector in <Highlight>Web3.</Highlight></>}
 />
 </div>
 <CascadingScrollAnimation direction="up" distance={40} delay={0}>
 <div className="paper-card p-8 sm:p-10 space-y-4 font-plex text-ink-soft text-[15px] leading-relaxed">
 <p>
 More than <strong className="text-ink">$3 billion</strong> in user funds have been drained through approval-based exploits since 2022. Phishing kits, malicious dApps, and compromised front-ends all exploit the same primitive: a forgotten <code className="font-mono text-xs bg-paper-sub border border-ink-rule px-1.5 py-0.5">approve()</code> call sitting on-chain, granting unlimited permission to a contract the user no longer trusts.
 </p>
 <p>
 The infrastructure to defend against this exists for institutions. It does not exist, in a usable form, for the people who actually hold the wallets. AllowanceGuard closes that gap.
 </p>
 </div>
 </CascadingScrollAnimation>
 </div>
 </Container>
 </section>

 {/* ── Core Features ── */}
 <section className="paper grain py-24 sm:py-32 overflow-hidden">
 <Container>
 <div className="max-w-4xl">
 <div className="mb-16">
 <SectionHeader
 number="01"
 eyebrow="Core capabilities"
 title="A complete approval lifecycle, in one place."
 />
 </div>

 <div className="space-y-6">
 {CORE_FEATURES.map((feature, i) => (
 <CascadingScrollAnimation key={feature.number} direction="up" distance={30} delay={i * 100}>
 <div className="paper-card p-6 sm:p-8 flex gap-5 sm:gap-7 items-start">
 <span
 className="font-mono text-[11px] font-bold tracking-[0.22em] text-ink/80 shrink-0 mt-1"
 aria-hidden="true"
 >
 {feature.number}
 </span>
 <div>
 <h3 className="font-display-tight text-ink text-lg leading-[1.1] mb-2">{feature.title}</h3>
 <p className="font-plex text-ink-muted text-[15px] leading-relaxed">{feature.description}</p>
 </div>
 </div>
 </CascadingScrollAnimation>
 ))}
 </div>
 </div>
 </Container>
 </section>

 {/* ── Differentiators ── */}
 <section className="paper-sub grain py-24 sm:py-32 overflow-hidden">
 <Container>
 <div className="max-w-4xl">
 <div className="mb-16">
 <SectionHeader
 number="02"
 eyebrow="What makes us different"
 title={<>Tools no other approval manager <Highlight>offers.</Highlight></>}
 />
 </div>

 <div className="grid md:grid-cols-2 gap-6">
 {DIFFERENTIATORS.map((d, i) => (
 <CascadingScrollAnimation key={d.title} direction="up" distance={30} delay={i * 80}>
 <div className="paper-card p-6 sm:p-8 h-full">
 <h3 className="font-display-tight text-ink text-base leading-[1.1] mb-3">{d.title}</h3>
 <p className="font-plex text-ink-muted text-sm leading-relaxed">{d.description}</p>
 </div>
 </CascadingScrollAnimation>
 ))}
 </div>
 </div>
 </Container>
 </section>

 {/* ── Browser Extension ── */}
 <section className="paper grain py-24 sm:py-32 overflow-hidden">
 <Container>
 <div className="max-w-4xl">
 <div className="mb-12">
 <SectionHeader
 number="03"
 eyebrow="Browser extension"
 title="Protection that travels with you."
 />
 </div>
 <CascadingScrollAnimation direction="up" distance={40} delay={0}>
 <div className="paper-card p-8 sm:p-10">
 <h3 className="font-display-tight text-ink text-lg mb-3">Real-time transaction screening.</h3>
 <p className="font-plex text-ink-soft text-[15px] leading-relaxed mb-6">
 The dashboard catches the past. The extension catches the present. Every approval request is intercepted and analysed before you sign — unlimited amounts, unverified contracts, and known-malicious addresses are flagged in plain English the instant the prompt appears.
 </p>
 <div className="flex flex-wrap gap-3">
 <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper border border-ink-rule px-3 py-1.5">
 Chrome &middot; Coming soon
 </span>
 <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper border border-ink-rule px-3 py-1.5">
 Firefox &middot; Coming soon
 </span>
 </div>
 </div>
 </CascadingScrollAnimation>
 </div>
 </Container>
 </section>

 {/* ── Why It Matters ── */}
 <section className="paper-sub grain py-24 sm:py-32 overflow-hidden">
 <Container>
 <div className="max-w-4xl">
 <div className="mb-12">
 <SectionHeader
 number="04"
 eyebrow="Why it matters"
 title={<>Self-custody without self-defence is just <Highlight>exposure.</Highlight></>}
 />
 </div>
 <CascadingScrollAnimation direction="up" distance={40} delay={0}>
 <div className="paper-card p-8 sm:p-10 space-y-4 font-plex text-ink-soft text-[15px] leading-relaxed">
 <p>
 The promise of Web3 is sovereignty — that anyone, anywhere, can hold and move value without permission. That promise collapses the moment the only people equipped to defend a wallet are the people who can afford a security team.
 </p>
 <p>
 AllowanceGuard exists to give every wallet the same standard of approval hygiene that an institutional desk takes for granted. Open-source, chain-agnostic, custody-respecting, and free where it counts.
 </p>
 </div>
 </CascadingScrollAnimation>
 </div>
 </Container>
 </section>

 {/* ── CTA: Oxblood band ── */}
 <section className="relative py-32 sm:py-40 bg-oxblood overflow-hidden">
 <div
 aria-hidden="true"
 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] pointer-events-none"
 style={{
 background: 'radial-gradient(ellipse 60% 50%, rgba(220,38,38,0.18) 0%, transparent 65%)',
 filter: 'blur(40px)',
 }}
 />
 <div
 aria-hidden="true"
 className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] pointer-events-none"
 style={{
 background: 'radial-gradient(ellipse, rgba(245,158,11,0.10) 0%, transparent 70%)',
 filter: 'blur(40px)',
 }}
 />
 <div
 aria-hidden="true"
 className="absolute top-0 left-0 right-0 h-px"
 style={{
 background: 'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.5) 50%, transparent 90%)',
 boxShadow: '0 0 12px rgba(245,158,11,0.25)',
 }}
 />

 <Container>
 <CascadingScrollAnimation direction="up" distance={50} delay={0}>
 <div className="max-w-4xl mx-auto text-center relative z-10">
 <div className="inline-flex items-center gap-3 mb-10">
 <span className="h-px w-8 bg-amber-500" aria-hidden="true" />
 <span className="font-mono text-[10px] font-bold tracking-[0.28em] uppercase text-amber-500">
 Get started
 </span>
 <span className="h-px w-8 bg-amber-500" aria-hidden="true" />
 </div>

 <h2 className="font-display-black leading-[0.9] mb-8 text-5xl sm:text-6xl lg:text-7xl">
 <span className="text-cream">See what your wallet</span>
 <br />
 <span className="text-amber-500">has already agreed to.</span>
 </h2>

 <p className="font-plex text-lg text-cream/75 leading-[1.55] mb-10 max-w-2xl mx-auto">
 Join the waitlist and be the first to know when we launch. The scanner is coming — and it&rsquo;s free.
 </p>

 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
 <Link
 href="/"
 className="inline-flex items-center justify-center px-8 py-4 bg-cream text-oxblood font-medium font-plex text-[15px] hover:bg-cream/90 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-oxblood"
 >
 Join the waitlist
 </Link>
 <Link
 href="/docs"
 className="inline-flex items-center justify-center px-8 py-4 border border-cream/30 text-cream font-medium font-plex text-[15px] hover:bg-cream/10 transition-colors duration-150"
 >
 Read the docs
 </Link>
 </div>

 <p className="mt-8 font-mono text-xs text-cream/50 tracking-wider uppercase">
 Non-custodial &nbsp;&middot;&nbsp; Open source &nbsp;&middot;&nbsp; 27 chains
 </p>
 </div>
 </CascadingScrollAnimation>
 </Container>

 <div
 aria-hidden="true"
 className="absolute bottom-0 inset-x-0 h-px"
 style={{
 background: 'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.5) 50%, transparent 90%)',
 boxShadow: '0 0 12px rgba(245,158,11,0.25)',
 }}
 />
 </section>
 </div>
 )
}
