'use client'

import Link from 'next/link'
import { useState } from 'react'
import Container from '@/components/ui/Container'
import DonationButton from '@/components/DonationButton'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FooterSectionProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

function FooterSection({ title, children, isOpen, onToggle }: FooterSectionProps) {
  return (
    <div className="border-b border-line/30 md:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 md:py-0 md:pointer-events-none"
      >
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <div className="md:hidden">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-stone" />
          ) : (
            <ChevronDown className="w-5 h-5 text-stone" />
          )}
        </div>
      </button>
      <div className={`md:block ${isOpen ? 'block' : 'hidden'} pb-4 md:pb-0`}>
        {children}
      </div>
    </div>
  )
}

export default function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    product: false,
    openSource: false,
    support: false,
    company: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <footer className="bg-mist/30 border-t border-line/50">
      <Container className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-12">
          {/* Product */}
          <FooterSection
            title="Product"
            isOpen={openSections.product}
            onToggle={() => toggleSection('product')}
          >
            <ul className="space-y-4 mt-6 md:mt-6">
              <li>
                <Link href="/features" className="text-stone hover:text-ink transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-stone hover:text-ink transition-colors duration-200">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-stone hover:text-ink transition-colors duration-200">
                  Security
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* Open Source */}
          <FooterSection
            title="Open Source"
            isOpen={openSections.openSource}
            onToggle={() => toggleSection('openSource')}
          >
            <ul className="space-y-4 mt-6 md:mt-6">
              <li>
                <a 
                  href="https://github.com/EazyAccessEA/Allowance-guard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone hover:text-ink transition-colors duration-200"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/EazyAccessEA/Allowance-guard/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone hover:text-ink transition-colors duration-200"
                >
                  Report Issues
                </a>
              </li>
              <li>
                <Link href="/docs/api" className="text-stone hover:text-ink transition-colors duration-200">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/docs/integration" className="text-stone hover:text-ink transition-colors duration-200">
                  Integration Guide
                </Link>
              </li>
              <li>
                <Link href="/docs/contributing" className="text-stone hover:text-ink transition-colors duration-200">
                  Contributing Guide
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* Support & Contact */}
          <FooterSection
            title="Support"
            isOpen={openSections.support}
            onToggle={() => toggleSection('support')}
          >
            <ul className="space-y-4 mt-6 md:mt-6">
              <li>
                <Link href="/contact" className="text-stone hover:text-ink transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-stone hover:text-ink transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <a 
                  href="https://slack.allowanceguard.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone hover:text-ink transition-colors duration-200"
                >
                  Slack Community
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <DonationButton />
            </div>
          </FooterSection>

          {/* Legal & Social */}
          <FooterSection
            title="Company"
            isOpen={openSections.company}
            onToggle={() => toggleSection('company')}
          >
            <ul className="space-y-4 mt-6 md:mt-6">
              <li>
                <Link href="/privacy" className="text-stone hover:text-ink transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-stone hover:text-ink transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-stone hover:text-ink transition-colors duration-200">
                  Cookie Policy
                </Link>
              </li>
            </ul>
            <div className="mt-8">
              <div className="flex space-x-4">
                <a 
                  href="https://twitter.com/allowanceguard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone hover:text-ink transition-colors duration-200"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/EazyAccessEA/Allowance-guard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone hover:text-ink transition-colors duration-200"
                >
                  <span className="sr-only">GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </FooterSection>
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-line/50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-2xl text-stone text-sm">
              Open-source and free to use. Maintained by a small independent team and funded by
              <Link className="underline ml-1 hover:text-ink transition-colors duration-200" href="/docs/contributing">donations and grants</Link>. No VC, no token.
            </p>
            <nav className="flex items-center gap-4">
              <Link className="underline text-stone hover:text-ink transition-colors duration-200 text-sm" href="/docs/contributing">Support</Link>
              <Link className="underline text-stone hover:text-ink transition-colors duration-200 text-sm" href="/contribute">Supporters</Link>
              <Link className="underline text-stone hover:text-ink transition-colors duration-200 text-sm" href="/privacy">Privacy</Link>
              <Link className="underline text-stone hover:text-ink transition-colors duration-200 text-sm" href="/terms">Terms</Link>
            </nav>
          </div>
        </div>
      </Container>
    </footer>
  )
}