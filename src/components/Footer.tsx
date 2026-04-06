'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Container from '@/components/ui/Container'
import DonationButton from '@/components/DonationButton'
import { Github, MessageCircle, Mail, ChevronDown, ChevronUp } from 'lucide-react'

interface FooterSectionProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

function FooterSection({ title, children, isOpen, onToggle }: FooterSectionProps) {
  return (
    <div className="border-b border-white/5 md:border-b-0">
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={`footer-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="flex items-center justify-between w-full py-4 md:py-0 md:pointer-events-none cursor-pointer rounded-md transition-colors duration-150"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
          {title}
        </h3>
        <div className="md:hidden text-slate-400">
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
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <footer className="relative bg-surface-base text-white">
      {/* Signature amber top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #F59E0B 20%, #F59E0B 80%, transparent 100%)',
          boxShadow: '0 -1px 8px rgba(245, 158, 11, 0.2)',
        }}
      />

      <Container className="py-12 sm:py-16">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard Logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span
                className="text-lg font-bold text-white tracking-tight"
                style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
              >
                AllowanceGuard
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              Open-source core, always free. Premium monitoring and API for power users and teams.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              <SocialLink href="https://github.com/EazyAccessEA/Allowance-guard" label="GitHub">
                <Github className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="https://discord.gg/DsJ4Pa94" label="Discord">
                <MessageCircle className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="https://twitter.com/allowanceguard" label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Product links */}
          <div className="lg:col-span-2">
            <FooterSection
              title="Product"
              isOpen={openSections.product}
              onToggle={() => toggleSection('product')}
            >
              <ul className="space-y-3 mt-4 md:mt-4">
                <FooterLink href="/pricing">Pricing</FooterLink>
                <FooterLink href="/features">Features</FooterLink>
                <FooterLink href="/docs">Docs</FooterLink>
                <FooterLink href="/docs/api-reference">API</FooterLink>
                <FooterLink href="/account">Account</FooterLink>
              </ul>
            </FooterSection>
          </div>

          {/* Community links */}
          <div className="lg:col-span-3">
            <FooterSection
              title="Community"
              isOpen={openSections.community}
              onToggle={() => toggleSection('community')}
            >
              <ul className="space-y-3 mt-4 md:mt-4">
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

          {/* Legal links */}
          <div className="lg:col-span-3">
            <FooterSection
              title="Legal"
              isOpen={openSections.legal}
              onToggle={() => toggleSection('legal')}
            >
              <ul className="space-y-3 mt-4 md:mt-4">
                <FooterLink href="/terms">Terms</FooterLink>
                <FooterLink href="/privacy">Privacy</FooterLink>
                <FooterLink href="/cookies">Cookies</FooterLink>
                <FooterLink href="/sla">SLA</FooterLink>
                <FooterLink href="/refund">Refunds</FooterLink>
                <FooterLink href="/dpa">DPA</FooterLink>
                <FooterLink href="https://allowanceguard.instatus.com" external>
                  Status
                </FooterLink>
              </ul>
            </FooterSection>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} AllowanceGuard. AGPL-3.0 + Commercial.
          </span>
          <span className="text-xs text-slate-400">
            No VC. No token. Open source.
          </span>
        </div>
      </Container>
    </footer>
  )
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const className = "text-sm text-slate-400 hover:text-white transition-colors duration-150 block"
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
      <Link href={href} className={className}>{children}</Link>
    </li>
  )
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 bg-slate-800/50 hover:bg-amber-500/20 text-slate-400 hover:text-white rounded-md flex items-center justify-center transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
      aria-label={label}
    >
      {children}
    </a>
  )
}
