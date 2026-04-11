'use client'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import Link from 'next/link'
import { Eye, Settings, Puzzle, Globe } from 'lucide-react'
import VideoBackground from '@/components/VideoBackground'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        <div
          className="absolute inset-0 z-10 dark:hidden"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        <div className="absolute inset-0 z-10 hidden dark:block bg-paper-deep/90" />

        <Container className="relative text-left max-w-4xl z-10">
          <span className="inline-block mb-6 text-xs uppercase tracking-[0.2em] font-semibold text-amber-deep dark:text-amber-deep">
            The AllowanceGuard Platform
          </span>
          <H1 className="mb-6">The invisible attack surface, made visible.</H1>
          <p className="text-lg text-ink-muted max-w-reading mb-4">
            Every time you use a dApp, you sign away permission. Most users sign once and forget. Attackers don&rsquo;t.
          </p>
          <p className="text-lg text-ink-muted max-w-reading">
            AllowanceGuard finds every approval your wallet has ever granted, scores its risk against live threat intelligence, and lets you revoke it — across 27 chains, from one dashboard, without ever giving up custody.
          </p>
        </Container>
      </Section>

      <div className="border-t border-ink-rule" />

      {/* The Problem (funding context) */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <span className="block mb-3 text-xs uppercase tracking-[0.2em] font-semibold text-amber-deep dark:text-amber-deep">
              The Problem
            </span>
            <H2 className="mb-8">Token approvals are the largest unaddressed attack vector in Web3.</H2>
            <p className="text-base text-ink-muted leading-relaxed mb-6 max-w-reading">
              More than <strong>$2 billion</strong> in user funds have been drained through approval-based exploits since 2022. Phishing kits, malicious dApps, and compromised front-ends all exploit the same primitive: a forgotten <code>approve()</code> call sitting on-chain, granting unlimited permission to a contract the user no longer trusts — or never understood in the first place.
            </p>
            <p className="text-base text-ink-muted leading-relaxed max-w-reading">
              The infrastructure to defend against this exists for institutions. It does not exist, in a usable form, for the people who actually hold the wallets. AllowanceGuard closes that gap.
            </p>
          </div>
        </Container>
      </Section>

      {/* Core Features */}
      <Section className="py-32 bg-paper-sub">
        <Container>
          <div className="max-w-4xl mx-auto">
            <span className="block mb-3 text-xs uppercase tracking-[0.2em] font-semibold text-amber-deep dark:text-amber-deep">
              Core Capabilities
            </span>
            <H2 className="mb-12">A complete approval lifecycle, in one place.</H2>

            <div className="space-y-8">
              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-ink mb-4">Unified Allowance Dashboard</h3>
                  <p className="text-base text-ink-muted leading-relaxed">
                    Every approval your wallet has ever granted, indexed in real time across 27 chains. Spender, token, amount, age, and risk — surfaced in one view, ranked by what can hurt you most. No more crawling block explorers to remember what you signed six months ago at 2am.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-ink mb-4">Live Risk Scoring</h3>
                  <p className="text-base text-ink-muted leading-relaxed">
                    Each approval is graded against current threat intelligence: unlimited approvals, unverified bytecode, addresses tied to known exploits, and behavioural anomalies all raise the score. The danger surfaces first. You don&rsquo;t have to be a security researcher to act like one.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-ink mb-4">Gas-Efficient Batch Revocation</h3>
                  <p className="text-base text-ink-muted leading-relaxed">
                    Revoke a single approval in one click. Revoke twenty in one transaction. Our optimised batch contract bundles revocations to cut gas costs by up to 70%. Every transaction is constructed by us and signed by you — your keys, your wallet, your move.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-ink mb-4">Continuous Monitoring &amp; Alerts</h3>
                  <p className="text-base text-ink-muted leading-relaxed">
                    Set it once and stop checking. AllowanceGuard rescans your wallets on a schedule and alerts you the moment a new high-risk approval appears — by email, Telegram, or webhook. Treasuries, DAOs, and individuals get the same early warning the institutions get.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Differentiators */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <span className="block mb-3 text-xs uppercase tracking-[0.2em] font-semibold text-amber-deep dark:text-amber-deep">
              What Makes Us Different
            </span>
            <H2 className="mb-12">Tools no other approval manager offers.</H2>

            <div className="space-y-8">
              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-ink mb-4">Time Machine — Simulate Before You Spend</h3>
                  <p className="text-base text-ink-muted leading-relaxed">
                    Toggle approvals on and off and watch your risk score recalculate in real time, before a single wei of gas leaves your wallet. Plan your cleanup, model the outcome, then execute with certainty. No competitor offers this.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-ink mb-4">Non-Custodial by Architecture, Not Promise</h3>
                  <p className="text-base text-ink-muted leading-relaxed">
                    A read-only address is all we ever take. We do not hold keys. We do not hold seed phrases. We do not hold funds. We could not access your assets if a court ordered us to — the system is built so the option does not exist. Trust by design, not by terms of service.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-ink mb-4">Open-Core, AGPL-Licensed</h3>
                  <p className="text-base text-ink-muted leading-relaxed">
                    The scanner that protects users is free, public, and auditable. Anyone can read the code, fork it, or self-host it. Premium services fund the core — but the core itself is a public good and will remain one. Security infrastructure that depends on closed black boxes is not security at all.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-ink mb-4">Compliance-Ready Audit Trail</h3>
                  <p className="text-base text-ink-muted leading-relaxed">
                    DAOs, funds, and on-chain treasuries get exportable PDF and CSV reports of every approval, revocation, and risk event — timestamped and signed. The same evidence chain auditors and regulators expect from traditional finance, ported to a chain-native workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Browser Extension */}
      <Section className="py-32 bg-paper-sub">
        <Container>
          <div className="max-w-4xl mx-auto">
            <span className="block mb-3 text-xs uppercase tracking-[0.2em] font-semibold text-amber-deep dark:text-amber-deep">
              Browser Extension
            </span>
            <H2 className="mb-12">Protection that travels with you.</H2>

            <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Puzzle className="w-6 h-6 text-amber-deep" />
                  <h3 className="text-xl font-semibold text-ink">Real-Time Transaction Screening</h3>
                </div>
                <p className="text-base text-ink-muted leading-relaxed mb-6">
                  The dashboard catches the past. The extension catches the present. Every approval request is intercepted and analysed before you sign — unlimited amounts, unverified contracts, and known-malicious addresses are flagged in plain English the instant the prompt appears. The warning arrives before the mistake.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-amber-deep dark:bg-primary-900/30 dark:text-amber-deep">
                    <Globe className="w-4 h-4" />
                    Chrome &middot; Pending Approval
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-amber-deep dark:bg-primary-900/30 dark:text-amber-deep">
                    Firefox &middot; Pending Approval
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mission / Why this matters — funding lens */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <span className="block mb-3 text-xs uppercase tracking-[0.2em] font-semibold text-amber-deep dark:text-amber-deep">
              Why It Matters
            </span>
            <H2 className="mb-8">Self-custody without self-defence is just exposure.</H2>
            <p className="text-base text-ink-muted leading-relaxed mb-6 max-w-reading">
              The promise of Web3 is sovereignty — that anyone, anywhere, can hold and move value without permission. That promise collapses the moment the only people equipped to defend a wallet are the people who can afford a security team.
            </p>
            <p className="text-base text-ink-muted leading-relaxed mb-6 max-w-reading">
              AllowanceGuard exists to give every wallet — a first-time user in Lagos, a DAO treasury in Berlin, a memecoin trader in Manila — the same standard of approval hygiene that an institutional desk takes for granted. Not as charity. As infrastructure.
            </p>
            <p className="text-base text-ink-muted leading-relaxed max-w-reading">
              We are building the public layer of Web3 wallet defence: open-source, chain-agnostic, custody-respecting, and free where it counts. Funding this work funds the only credible answer to a billion-dollar problem the industry has spent four years pretending it can solve with disclaimers.
            </p>
          </div>
        </Container>
      </Section>

      <div className="border-t border-ink-rule" />

      {/* CTA */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto text-left">
            <H2 className="mb-8">See what your wallet has already agreed to.</H2>
            <p className="text-base text-ink-muted max-w-reading mb-12">
              Connect a wallet or paste an address. The first scan takes under a minute. The peace of mind lasts considerably longer.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mobbin-fade-in mobbin-stagger-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring bg-primary-700 text-ink hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-700/30"
              >
                <Eye className="w-5 h-5 mr-2" />
                Start Scanning
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring border border-primary-700 text-amber-deep hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-700/30"
              >
                <Settings className="w-5 h-5 mr-2" />
                Read the Documentation
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
