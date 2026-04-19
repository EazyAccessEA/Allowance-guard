'use client'

/**
 * Footer — Apple-discipline colophon
 *
 * Calm, information-first, zero ornament. Close-to-body background
 * (paper-sub), single ink hairline at top, no grain, no amber, no motto.
 * A tiny disclaimer paragraph at top replaces the wordmark block — it
 * delivers information, not branding. Mobile accordion preserved.
 *
 * Council:
 *  - #13 UX writer: every word earns its place or it's gone
 *  - #5 Marketing: the end of a page is peak-memorable — so let the
 *    memory be of the content, not the chrome
 *  - Psychology: processing fluency, authority through restraint
 */

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Container from '@/components/ui/Container'
import { Github, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface FooterSectionProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

function FooterSection({ title, children, isOpen, onToggle }: FooterSectionProps) {
  return (
    <div className="border-b border-[rgba(15,17,21,0.08)] md:border-b-0">
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={`footer-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="flex items-center justify-between w-full py-4 md:py-0 md:pointer-events-none cursor-pointer rounded"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <h3 className="font-plex font-semibold text-[11px] text-ink uppercase tracking-[0.08em]">
          {title}
        </h3>
        <div className="md:hidden text-ink-muted">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>
      <div
        id={`footer-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className={`md:block ${isOpen ? 'block' : 'hidden'} pb-4 md:pb-0`}
      >
        {children}
      </div>
    </div>
  )
}

export default function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    product: false,
    community: false,
    legal: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <footer className="bg-paper-sub text-ink border-t border-[rgba(15,17,21,0.08)]">
      <Container className="py-12 sm:py-14">
        {/* Top disclaimer — replaces the wordmark block. Information > branding. */}
        <div className="mb-10 pb-10 border-b border-[rgba(15,17,21,0.08)] max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/images/branding/ag-logo-ink.png" alt="" width={32} height={32} />
            <span className="font-plex font-bold text-lg text-ink tracking-[-0.02em]">
              AllowanceGuard
            </span>
          </div>
          <p className="font-plex text-[12px] text-ink-whisper leading-[1.6]">
            Reads public blockchain data to find token approvals on your wallet. We never access your keys or move tokens. Not financial or security advice; use the tool and verify on a block explorer.
          </p>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <FooterSection
              title="Product"
              isOpen={openSections.product}
              onToggle={() => toggleSection('product')}
            >
              <ul className="space-y-2 mt-4">
                <FooterLink href="/pricing">Pricing</FooterLink>
                <FooterLink href="/features">Features</FooterLink>
                <FooterLink href="/docs">Docs</FooterLink>
                <FooterLink href="/docs/api-reference">API</FooterLink>
                <FooterLink href="/account">Account</FooterLink>
              </ul>
            </FooterSection>
          </div>

          <div>
            <FooterSection
              title="Community"
              isOpen={openSections.community}
              onToggle={() => toggleSection('community')}
            >
              <ul className="space-y-2 mt-4">
                <FooterLink href="https://github.com/EazyAccessEA/Allowance-guard" external>
                  GitHub
                </FooterLink>
                <FooterLink href="https://discord.gg/gyhfjRgW" external>
                  Discord
                </FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/faq">FAQ</FooterLink>
              </ul>
            </FooterSection>
          </div>

          <div>
            <FooterSection
              title="Legal"
              isOpen={openSections.legal}
              onToggle={() => toggleSection('legal')}
            >
              <ul className="space-y-2 mt-4">
                <FooterLink href="/dpa">DPA</FooterLink>
                <FooterLink href="/sla">SLA</FooterLink>
                <FooterLink href="/refund">Refunds</FooterLink>
                <FooterLink href="https://allowanceguard.instatus.com" external>
                  Status
                </FooterLink>
              </ul>
            </FooterSection>
          </div>
        </div>

        {/* Bottom bar — inline, calm, no motto */}
        <div className="mt-14 pt-6 border-t border-[rgba(15,17,21,0.08)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="font-plex text-[12px] text-ink-whisper">
              © {new Date().getFullYear()} AllowanceGuard.
              <span className="mx-1.5 text-ink-whisper/50">·</span>
              <Link href="/terms" className="hover:text-ink transition-colors">Terms</Link>
              <span className="mx-1.5 text-ink-whisper/50">·</span>
              <Link href="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
              <span className="mx-1.5 text-ink-whisper/50">·</span>
              <Link href="/cookies" className="hover:text-ink transition-colors">Cookies</Link>
              <span className="mx-1.5 text-ink-whisper/50">·</span>
              <Link href="/sitemap" className="hover:text-ink transition-colors">Sitemap</Link>
            </p>

            {/* Social — tiny, inline with copyright bar */}
            <div className="flex items-center gap-5">
              <SocialLink href="https://github.com/EazyAccessEA/Allowance-guard" label="GitHub">
                <Github className="w-[14px] h-[14px]" />
              </SocialLink>
              <SocialLink href="https://discord.gg/gyhfjRgW" label="Discord">
                <MessageCircle className="w-[14px] h-[14px]" />
              </SocialLink>
              <SocialLink href="https://twitter.com/allowanceguard" label="Twitter">
                <svg className="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialLink>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
}) {
  const className =
    'font-plex text-[13px] text-ink-muted hover:text-ink transition-colors duration-150 block'
  if (external) {
    return (
      <li>
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      </li>
    )
  }
  return (
    <li>
      <Link href={href} className={className}>
        {children}
      </Link>
    </li>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ink-whisper hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper-sub rounded"
      aria-label={label}
    >
      {children}
    </a>
  )
}
