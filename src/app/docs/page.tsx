'use client'

/**
 * Docs landing — Ledger aesthetic.
 *
 * Must remain 'use client' — search state + section navigation.
 *
 * Council:
 *  Kael: Remove rounded-xl/rounded-lg, use paper-card/paper-button, no bg-sky-500
 *  Maren: grain on hero, font-display-tight headline, no inline fontFamily
 *  Idris: No CascadingScrollAnimation on interactive content (breaks section switching)
 *  Noor: Search input has proper label, nav buttons have full-width click targets
 *  #20 Brand: "Build with AllowanceGuard" → "Documentation" (editorial, not developer-bro)
 */

import { useState } from 'react'
import Link from 'next/link'
import { menuItems, headingsMap } from './docs-data'
import DocsContentPrimary from './DocsContentPrimary'
import DocsContentSecondary from './DocsContentSecondary'
import { ArrowRight, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const quickLinks = [
  { title: 'API Reference', description: 'REST API v1 — endpoints, auth, rate limits', href: '/docs/api-reference' },
  { title: 'Integration Guide', description: 'Widget, React hooks, Node.js SDK', href: '/docs/integration' },
  { title: 'Widget Builder', description: 'Configure and preview the embeddable widget', href: '/docs/widget' },
  { title: 'Networks', description: 'All 27 supported EVM chains and their status', href: '/networks' },
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const headings = headingsMap[activeSection] ?? []

  const filteredMenuItems = searchQuery
    ? menuItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : menuItems

  return (
    <div className="min-h-screen bg-paper text-ink">

      {/* ── Hero ── */}
      <section className="paper grain relative overflow-hidden border-b border-ink-rule">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 15% 25%, rgba(245,158,11,0.10) 0%, transparent 55%),' +
              'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(250,244,230,0.6) 0%, transparent 80%)',
          }}
        />
        {/* Amber hairline at bottom */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.5) 50%, transparent 90%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-baseline gap-3 mb-6">
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
                Documentation
              </span>
              <span className="h-px w-12 bg-ink-rule" aria-hidden="true" />
            </div>

            <h1 className="font-display-tight text-ink leading-[0.95] text-4xl sm:text-5xl lg:text-6xl mb-5">
              Guides, API reference, and integration docs.
            </h1>
            <p className="font-plex text-lg text-ink-muted max-w-xl mb-8">
              Scan wallets, score risk, and revoke approvals — programmatically or through the dashboard.
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <label htmlFor="docs-search" className="sr-only">Search documentation</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-whisper" />
              <input
                id="docs-search"
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-paper border border-ink-rule text-sm font-plex text-ink placeholder:text-ink-whisper focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {/* Quick link cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-12">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group paper-card p-4 flex items-start gap-3 hover:border-amber-deep/30 transition-colors duration-150"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium font-plex text-ink group-hover:text-amber-deep transition-colors flex items-center gap-1">
                    {link.title}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                  <p className="font-plex text-xs text-ink-whisper mt-0.5">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {[
                { title: 'Getting Started', ids: ['overview', 'getting-started', 'core-concepts'] },
                { title: 'Using AllowanceGuard', ids: ['usage-guides', 'revoking', 'alerts', 'monitoring', 'teams'] },
                { title: 'Developers', ids: ['advanced-topics', 'api', 'browser-extension'] },
                { title: 'Support', ids: ['troubleshooting', 'faq'] },
              ].map((group) => {
                const groupItems = filteredMenuItems.filter(item => group.ids.includes(item.id))
                if (groupItems.length === 0) return null
                return (
                  <div key={group.title}>
                    <h3 className="font-mono text-[10px] font-bold text-ink-whisper uppercase tracking-[0.22em] mb-2 px-3">
                      {group.title}
                    </h3>
                    <div className="space-y-0.5">
                      {groupItems.map((item) => {
                        const IconComponent = item.icon
                        const isActive = activeSection === item.id
                        return (
                          <button
                            key={item.id}
                            onClick={() => { setActiveSection(item.id); setSearchQuery('') }}
                            className={cn(
                              'w-full text-left px-3 py-2 text-sm font-plex flex items-center gap-2.5 transition-all duration-150 border',
                              isActive
                                ? 'bg-paper-sub text-amber-deep border-amber-deep/20'
                                : 'text-ink-muted hover:text-ink hover:bg-paper-sub border-transparent',
                            )}
                          >
                            <IconComponent className={cn('w-4 h-4 shrink-0', isActive ? 'text-amber-deep' : 'text-ink-whisper')} />
                            {item.title}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Sub-pages */}
              <div className="pt-4 border-t border-ink-rule">
                <h3 className="font-mono text-[10px] font-bold text-ink-whisper uppercase tracking-[0.22em] mb-2 px-3">
                  References
                </h3>
                <div className="space-y-0.5">
                  {[
                    { href: '/docs/api-reference', label: 'API Reference' },
                    { href: '/docs/integration', label: 'Integration' },
                    { href: '/docs/widget', label: 'Widget Builder' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-plex text-ink-muted hover:text-ink hover:bg-paper-sub border border-transparent transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-6">
            <div className="max-w-none">
              <DocsContentPrimary section={activeSection} onNavigate={(s) => { setActiveSection(s); setSearchQuery(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
              <DocsContentSecondary section={activeSection} />
            </div>
          </div>

          {/* Right sidebar — On this page */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              {headings.length > 0 && (
                <div className="paper-card p-4">
                  <h4 className="font-mono text-[10px] font-bold text-ink-whisper uppercase tracking-[0.22em] mb-3">
                    On this page
                  </h4>
                  <nav className="space-y-1.5">
                    {headings.map((heading, index) => (
                      <a
                        key={index}
                        href={`#${heading.id}`}
                        className={cn(
                          'block text-sm font-plex text-ink-muted hover:text-amber-deep transition-colors',
                          heading.level === 3 && 'ml-3 text-xs',
                        )}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
