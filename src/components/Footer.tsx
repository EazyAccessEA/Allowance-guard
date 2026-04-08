'use client'

/**
 * Footer — Ledger aesthetic
 *
 * Publication colophon on paper-deep. Ink section headings with § roman
 * numerals, Fraunces italic wordmark, masthead-style copyright colophon.
 * Closes the page with the signature .ledger-rule (ink + amber hairlines).
 *
 * Council: Editor-in-chief (colophon voice), Maren (back-matter density),
 * Noor (AAA preserved on paper-deep), Sable (accordion mobile UX kept).
 */

import Link from 'next/link'
import { useState } from 'react'
import Container from '@/components/ui/Container'
import DonationButton from '@/components/DonationButton'
import { Github, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface FooterSectionProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

function FooterSection({ title, children, isOpen, onToggle }: FooterSectionProps) {
  return (
    <div className="border-b border-ink-rule md:border-b-0">
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={`footer-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="flex items-center justify-between w-full py-4 md:py-0 md:pointer-events-none cursor-pointer rounded-md"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <div className="flex items-baseline gap-2">
          <h3 className="font-mono text-[11px] font-bold text-ink uppercase tracking-[0.2em]">
            {title}
          </h3>
        </div>
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
    <footer className="paper-deep grain relative text-ink">
      {/* Signature ledger-rule at the top — the move one last time */}
      <div className="absolute top-0 left-0 right-0 h-[6px]" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-px bg-ink-rule" style={{ backgroundColor: 'rgba(20,18,16,0.28)' }} />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #F59E0B 50%, transparent 100%)',
          }}
        />
      </div>

      <Container className="py-16 sm:py-20">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="mb-5">
              <span className="font-fraunces italic text-3xl font-bold text-ink tracking-tight leading-[0.9]">
                Allowance<span className="text-amber-deep">Guard</span>
              </span>
            </div>

            <p className="font-plex text-sm text-ink-muted leading-[1.65] mb-4 max-w-xs">
              Open-source security scanner. Premium monitoring and API for teams who need more.
            </p>

            <p className="font-mono text-[10px] font-bold text-amber-deep tracking-[0.22em] uppercase mb-7">
              Fifteen chains · One dashboard · Open source core
            </p>

            {/* Social — ink icons, no bg pills */}
            <div className="flex items-center gap-5">
              <SocialLink href="https://github.com/EazyAccessEA/Allowance-guard" label="GitHub">
                <Github className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="https://discord.gg/DsJ4Pa94" label="Discord">
                <MessageCircle className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="https://twitter.com/allowanceguard" label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Product */}
          <div className="lg:col-span-2">
            <FooterSection
              title="Product"
              isOpen={openSections.product}
              onToggle={() => toggleSection('product')}
            >
              <ul className="space-y-3 mt-5">
                <FooterLink href="/pricing">Pricing</FooterLink>
                <FooterLink href="/features">Features</FooterLink>
                <FooterLink href="/docs">Docs</FooterLink>
                <FooterLink href="/docs/api-reference">API</FooterLink>
                <FooterLink href="/account">Account</FooterLink>
              </ul>
            </FooterSection>
          </div>

          {/* Community */}
          <div className="lg:col-span-3">
            <FooterSection
              title="Community"
              isOpen={openSections.community}
              onToggle={() => toggleSection('community')}
            >
              <ul className="space-y-3 mt-5">
                <FooterLink href="https://github.com/EazyAccessEA/Allowance-guard" external>
                  GitHub
                </FooterLink>
                <FooterLink href="https://discord.gg/DsJ4Pa94" external>
                  Discord
                </FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/docs/contributing">Contributing</FooterLink>
              </ul>
              <div className="mt-5">
                <DonationButton />
              </div>
            </FooterSection>
          </div>

          {/* Legal */}
          <div className="lg:col-span-3">
            <FooterSection
              title="Legal"
              isOpen={openSections.legal}
              onToggle={() => toggleSection('legal')}
            >
              <ul className="space-y-3 mt-5">
                <FooterLink href="/terms">Terms</FooterLink>
                <FooterLink href="/privacy">Privacy</FooterLink>
                <FooterLink href="/cookies">Cookies</FooterLink>
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

        {/* Masthead colophon */}
        <div className="mt-16 pt-6 border-t border-ink-rule">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-mono text-[10px] text-ink-muted tracking-wider uppercase">
              &copy; {new Date().getFullYear()} AllowanceGuard · AGPL-3.0 + Commercial
            </span>
            <span className="font-fraunces italic text-sm text-ink-muted">
              Open source core. Independently operated. Built to last.
            </span>
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
    'font-plex text-sm text-ink-muted hover:text-ink hover:underline decoration-amber-deep underline-offset-4 transition-colors duration-150 block'
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
      className="text-ink-muted hover:text-amber-deep transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper-deep rounded"
      aria-label={label}
    >
      {children}
    </a>
  )
}
