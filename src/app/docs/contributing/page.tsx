'use client'

/**
 * Contributing — Ledger aesthetic.
 *
 * Council:
 *  Kael: SectionHeader, paper-card, no rounded, no rainbow icon bg, no shadow-lift
 *  Maren: grain, no gradients, amber-deep accent only
 *  Idris: CascadingScrollAnimation, no custom animation classes
 *  #21 Technical: copy tightened — 40-word sentences → 15 words
 *  #22 Conversion: donation CTA is clear and honest, not pressured
 *  Noor: accordion buttons have aria-expanded
 */

import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'
import DonationButton from '@/components/DonationButton'
import DocsHero from '../DocsHero'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="paper-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 sm:p-8 text-left flex items-center justify-between"
        aria-expanded={open}
      >
        <h3 className="font-display-tight text-ink text-lg">{title}</h3>
        {open
          ? <ChevronUp className="w-5 h-5 text-ink-whisper shrink-0" aria-hidden="true" />
          : <ChevronDown className="w-5 h-5 text-ink-whisper shrink-0" aria-hidden="true" />
        }
      </button>
      {open && (
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <p className="font-plex text-ink-muted text-[15px] leading-relaxed">{children}</p>
        </div>
      )}
    </div>
  )
}

export default function ContributingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">

      <DocsHero
        eyebrow="Contributing"
        title="Fund the mission. Build the public layer."
        lede="AllowanceGuard's core scanner is free and open source. Always. Code, bug reports, and donations all count."
      />

      {/* ── Why contribute ── */}
      <section className="paper-sub grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader
                number="01"
                eyebrow="The why"
                title="Your support keeps the public layer running."
              />
            </div>

            <div className="space-y-6">
              {[
                { title: 'Public good', text: 'AllowanceGuard is security infrastructure for the entire Web3 ecosystem. Contributions fund the tool, not a service — the core stays free for everyone.' },
                { title: 'Collective security', text: 'Approval-based exploits drained over $200 million from wallets in 2024. Your contribution funds the tools that prevent those losses.' },
                { title: 'Industry standards', text: 'By funding development, you help establish security practices that raise the bar for the entire DeFi ecosystem.' },
              ].map((item, i) => (
                <CascadingScrollAnimation key={item.title} direction="up" distance={30} delay={i * 80}>
                  <div className="paper-card p-6 sm:p-8">
                    <h3 className="font-display-tight text-ink text-base mb-2">{item.title}</h3>
                    <p className="font-plex text-ink-muted text-[15px] leading-relaxed">{item.text}</p>
                  </div>
                </CascadingScrollAnimation>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── How funds are used ── */}
      <section className="paper grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader
                number="02"
                eyebrow="Allocation"
                title="How contributions are used."
              />
            </div>

            <div className="space-y-4">
              <CascadingScrollAnimation direction="up" distance={30} delay={0}>
                <Accordion title="Development">
                  Compensating the core team — full-stack developers, security researchers, and frontend specialists who maintain and improve the codebase.
                </Accordion>
              </CascadingScrollAnimation>
              <CascadingScrollAnimation direction="up" distance={30} delay={80}>
                <Accordion title="Security & audits">
                  Professional smart contract audits, penetration testing, and bug bounty programmes. Third-party firms assess the platform regularly.
                </Accordion>
              </CascadingScrollAnimation>
              <CascadingScrollAnimation direction="up" distance={30} delay={160}>
                <Accordion title="Infrastructure">
                  Cloud servers, databases, blockchain RPC providers, and indexing services. The cost of scanning 27 chains in real time.
                </Accordion>
              </CascadingScrollAnimation>
              <CascadingScrollAnimation direction="up" distance={30} delay={240}>
                <Accordion title="Future development">
                  New chain support, mobile apps, sharper risk-detection rules, team collaboration features, and deeper protocol integrations.
                </Accordion>
              </CascadingScrollAnimation>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Make a contribution ── */}
      <section className="paper-sub grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader
                number="03"
                eyebrow="Contribute"
                title="Support the project."
              />
            </div>

            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10">
                <p className="font-plex text-ink-soft text-[15px] leading-relaxed mb-6">
                  We accept contributions via Stripe (cards) and Coinbase Commerce (crypto). Both are PCI-compliant and encrypted. We never store payment details. We never ask for contributions through DMs or unsolicited messages.
                </p>
                <div className="flex justify-center">
                  <DonationButton />
                </div>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── Transparency ── */}
      <section className="paper grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader
                number="04"
                eyebrow="Transparency"
                title="Where the money goes."
              />
            </div>

            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10 font-plex text-ink-muted text-[15px] leading-relaxed space-y-4">
                <p>We publish quarterly transparency reports: total funds received, expenditure breakdown by category, development milestones, and security audit results.</p>
                <p>Reports are published on the website and shared through community channels. We welcome questions about financial practices.</p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── Other ways to help ── */}
      <section className="paper-sub grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader
                number="05"
                eyebrow="Beyond funding"
                title="Other ways to contribute."
              />
            </div>

            <div className="space-y-6">
              {[
                { title: 'Code', text: 'Submit pull requests, review issues, fix bugs, improve documentation. The repo is open on GitHub.' },
                { title: 'Advocacy', text: 'Share AllowanceGuard on X, Reddit, Discord. Your voice helps others discover the tools they need.' },
                { title: 'Feedback & testing', text: 'Report bugs, test beta features, share detailed feedback. Real-world usage shapes the roadmap.' },
              ].map((item, i) => (
                <CascadingScrollAnimation key={item.title} direction="up" distance={30} delay={i * 80}>
                  <div className="paper-card p-6 sm:p-8">
                    <h3 className="font-display-tight text-ink text-base mb-2">{item.title}</h3>
                    <p className="font-plex text-ink-muted text-[15px] leading-relaxed">{item.text}</p>
                  </div>
                </CascadingScrollAnimation>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Thank you ── */}
      <section className="paper grain py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <p className="font-plex text-ink-soft text-lg leading-relaxed">
                Every contributor — financial, technical, or community — is a partner in securing Web3. Thank you.
              </p>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>
    </div>
  )
}
