'use client'

import { useState } from 'react'
import Link from 'next/link'
import { menuItems, headingsMap } from './docs-data'
import DocsContentPrimary from './DocsContentPrimary'
import DocsContentSecondary from './DocsContentSecondary'
import {
  BookOpen, Code2, Puzzle, Heart, Search,
  ArrowRight, Shield, Zap, Globe,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const quickLinks = [
  { title: 'API Reference', description: 'REST API v1 — endpoints, auth, and rate limits', href: '/docs/api-reference', icon: Code2 },
  { title: 'Integration Guide', description: 'Widget, React hooks, and Node.js SDK setup', href: '/docs/integration', icon: Puzzle },
  { title: 'Widget Builder', description: 'Configure and preview the embeddable widget', href: '/docs/widget', icon: Zap },
  { title: 'Contributing', description: 'Report bugs, submit code, or fund the project', href: '/docs/contributing', icon: Heart },
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

      {/* Hero — Midnight Amber */}
      <section className="relative overflow-hidden border-b border-ink-rule/50">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-paper via-paper-sub to-paper" />
        {/* Amber accent glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        {/* Signature line — amber horizontal rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-amber-deep" />
              <span className="text-xs font-semibold text-amber-deep uppercase tracking-[0.15em]">Documentation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Build with<br />
              <span className="text-amber-deep">AllowanceGuard</span>
            </h1>
            <p className="text-lg text-ink-muted max-w-xl mb-8">
              Guides, API reference, and integration docs. Scan wallets, score risk, and revoke approvals — programmatically or through the dashboard.
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-whisper" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-paper-sub border border-ink-rule/50 rounded-xl text-sm text-ink placeholder:text-ink-whisper focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          {/* Quick link cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-12">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-start gap-3 p-4 rounded-xl bg-paper-sub border border-ink-rule/40 hover:border-amber-500/30 hover:bg-paper-sub transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-paper-sub transition-colors">
                  <link.icon className="w-4 h-4 text-amber-deep" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink group-hover:text-amber-deep transition-colors flex items-center gap-1">
                    {link.title}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                  <p className="text-xs text-ink-whisper mt-0.5">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left sidebar — Navigation */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Grouped nav */}
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
                    <h3 className="text-[10px] font-semibold text-ink-whisper uppercase tracking-[0.15em] mb-2 px-3">
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
                              'w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 transition-all duration-150',
                              isActive
                                ? 'bg-paper-sub text-amber-deep border border-amber-500/20'
                                : 'text-ink-muted hover:text-ink hover:bg-paper-sub border border-transparent',
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
              <div className="pt-4 border-t border-ink-rule/50">
                <h3 className="text-[10px] font-semibold text-ink-whisper uppercase tracking-[0.15em] mb-2 px-3">
                  References
                </h3>
                <div className="space-y-0.5">
                  {[
                    { href: '/docs/api-reference', label: 'API Reference', icon: Code2 },
                    { href: '/docs/api', label: 'API v1 Docs', icon: Globe },
                    { href: '/docs/api/examples', label: 'Code Examples', icon: Zap },
                    { href: '/docs/integration', label: 'Integration', icon: Puzzle },
                    { href: '/docs/widget', label: 'Widget Builder', icon: Shield },
                    { href: '/docs/contributing', label: 'Contributing', icon: Heart },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-muted hover:text-ink hover:bg-paper-sub rounded-lg transition-colors"
                    >
                      <link.icon className="w-4 h-4 text-ink-whisper" />
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
              <DocsContentPrimary section={activeSection} />
              <DocsContentSecondary section={activeSection} />
            </div>
          </div>

          {/* Right sidebar — On this page */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              {headings.length > 0 && (
                <div className="rounded-xl border border-ink-rule/50 bg-paper-sub p-4">
                  <h4 className="text-[10px] font-semibold text-ink-whisper uppercase tracking-[0.15em] mb-3">
                    On this page
                  </h4>
                  <nav className="space-y-1.5">
                    {headings.map((heading, index) => (
                      <a
                        key={index}
                        href={`#${heading.id}`}
                        className={cn(
                          'block text-sm text-ink-muted hover:text-amber-deep transition-colors',
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
