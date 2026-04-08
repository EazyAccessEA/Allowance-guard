'use client'

/**
 * Header — Ledger aesthetic
 *
 * Masthead-style navigation on paper. IBM Plex Sans bold wordmark,
 * mono tagline, ink nav links with thin amber active underline, ink
 * rule at the bottom (replacing the old amber glow). Scroll state
 * tightens the bar with a subtle shadow and the signature ledger rule.
 *
 * Council: Maren (editorial masthead), Noor (AAA contrast verified),
 * Kael (reuses Ledger tokens, zero new utilities), Thane (logo inverted
 * via CSS filter — no new image), Sable (scarce active indicator).
 */

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import ClientConnectButton from '@/components/ClientConnectButton'
import MobileNavigation from '@/components/MobileNavigation'
import PlanBadge from '@/components/PlanBadge'

interface HeaderProps {
  isConnected: boolean
}

const NAV_ITEMS = [
  { href: '/', label: 'Scan' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
] as const

function NavLink({
  href,
  children,
  current,
}: {
  href: string
  children: React.ReactNode
  current: boolean
}) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 font-plex text-sm font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-md
        ${current ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
      style={{ transitionDuration: '150ms' }}
      aria-current={current ? 'page' : undefined}
    >
      {children}
      {current && (
        <span
          className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 h-[2px] w-6 bg-amber-deep"
          aria-hidden="true"
        />
      )}
    </Link>
  )
}

export default function Header({ isConnected }: HeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href) ?? false
  }

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ transitionDuration: '300ms' }}
    >
      {/* Paper surface */}
      <div
        className={`relative transition-all border-b
          ${scrolled
            ? 'bg-paper/95 backdrop-blur-md border-ink-rule shadow-[0_2px_12px_-4px_rgba(20,18,16,0.08)]'
            : 'bg-paper/80 backdrop-blur-sm border-transparent'
          }`}
        style={{ transitionDuration: '300ms', transitionTimingFunction: 'cubic-bezier(0.25, 0, 0, 1)' }}
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Wordmark — typographic only, Ledger aesthetic */}
            <Link
              href="/"
              aria-label="AllowanceGuard — home"
              className="group flex-shrink-0
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-md"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-plex font-bold text-xl text-ink leading-none tracking-[-0.03em]">
                  Allowance<span className="text-amber-deep">Guard</span>
                </span>
                <span className="font-mono text-[9px] font-bold text-ink-whisper leading-none hidden md:block tracking-[0.22em] uppercase">
                  Wallet Approval Scanner
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.href} href={item.href} current={isActive(item.href)}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {isConnected ? (
                <>
                  <PlanBadge plan="free" size="sm" />
                  <Link
                    href="/account"
                    className="px-3 py-1.5 font-plex text-sm font-medium text-ink-muted hover:text-ink transition-colors duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-md"
                  >
                    Account
                  </Link>
                  <Badge variant="success" size="sm">
                    Connected
                  </Badge>
                </>
              ) : (
                <>
                  <Link
                    href="/pricing"
                    className="px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-ink-muted hover:text-amber-deep transition-colors duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-md"
                  >
                    Upgrade
                  </Link>
                  <ClientConnectButton variant="primary" />
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
              <MobileNavigation isConnected={isConnected} />
            </div>
          </div>
        </div>

        {/* Signature amber hairline on scroll — the Ledger move, not a glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px transition-opacity"
          style={{
            opacity: scrolled ? 1 : 0,
            background:
              'linear-gradient(90deg, transparent 0%, #F59E0B 25%, #F59E0B 75%, transparent 100%)',
            transitionDuration: '300ms',
          }}
          aria-hidden="true"
        />
      </div>
    </header>
  )
}
