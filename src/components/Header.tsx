'use client'

/**
 * Header — Apple-discipline navbar
 *
 * Stripped to near-nothing. 48px height. Single-color wordmark. No tagline.
 * Nav links as type-only with a weight-shift active state. Connect Wallet
 * as a small dark pill, not an amber rectangle. Heavy backdrop blur.
 * No scroll state change. No decorative amber anywhere.
 *
 * Council (psychology principles applied):
 *  - Hick's Law: 5 decision targets instead of 8
 *  - Processing Fluency: single-color wordmark, one weight
 *  - Authority Bias: restraint signals confidence
 *  - Peak-End Rule: chrome fades so content can peak
 */

import Link from 'next/link'
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
      className={`font-plex text-[13px] transition-colors px-3 py-2 rounded
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper
        ${current
          ? 'text-ink font-medium'
          : 'text-ink-muted font-normal hover:text-ink'
        }`}
      aria-current={current ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}

export default function Header({ isConnected }: HeaderProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href) ?? false
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Opaque background — axe flagged 180 contrast violations when
          translucent paper was blended over scrolled dark content
          (effective bg #b6b7b9 vs text-ink-muted #4a4d54 = 4.21:1 FAIL).
          Opaque guarantees AA/AAA regardless of what's behind it. */}
      <div
        className="relative border-b border-[rgba(15,17,21,0.10)]"
        style={{ backgroundColor: '#F7F5F0' }}
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex h-12 items-center justify-between gap-4">
            {/* Wordmark — single color, no accent, no tagline */}
            <Link
              href="/"
              aria-label="AllowanceGuard — home"
              className="group flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded"
            >
              <span className="font-plex font-semibold text-[15px] text-ink leading-none tracking-[-0.01em]">
                AllowanceGuard
              </span>
            </Link>

            {/* Desktop navigation — type-only, centered balance */}
            <nav
              className="hidden lg:flex items-center gap-0.5"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.href} href={item.href} current={isActive(item.href)}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              {isConnected ? (
                <>
                  <PlanBadge plan="free" size="sm" />
                  <Link
                    href="/account"
                    className="font-plex text-[13px] font-normal text-ink-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded"
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
                    className="font-plex text-[13px] font-normal text-ink-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded"
                  >
                    Upgrade
                  </Link>
                  <ClientConnectButton variant="primary" size="sm" />
                </>
              )}
            </div>

            {/* Mobile actions */}
            <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
              <MobileNavigation isConnected={isConnected} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
