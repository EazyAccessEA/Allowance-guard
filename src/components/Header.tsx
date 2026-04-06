'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import ClientConnectButton from '@/components/ClientConnectButton'
import MobileNavigation from '@/components/MobileNavigation'
import PlanBadge from '@/components/PlanBadge'
// ThemeToggle removed from navbar — dark nav surface makes it irrelevant here.
// Toggle lives in Settings / Footer instead.

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
      className={`relative px-4 py-2 text-sm font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base rounded-md
        ${current
          ? 'text-white'
          : 'text-slate-300 hover:text-white'
        }`}
      style={{ transitionDuration: '150ms', transitionTimingFunction: 'cubic-bezier(0.25, 0, 0, 1)' }}
    >
      {children}
      {/* Crimson signature underline — the active indicator */}
      {current && (
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-5 bg-crimson-500 rounded-full"
          aria-hidden="true"
          style={{
            boxShadow: '0 0 8px rgba(229, 62, 62, 0.5)',
          }}
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
      style={{ transitionDuration: '300ms', transitionTimingFunction: 'cubic-bezier(0.25, 0, 0, 1)' }}
    >
      {/* Dark surface — stays dark in both themes */}
      <div
        className={`relative transition-all
          ${scrolled
            ? 'bg-surface-base/95 backdrop-blur-xl shadow-lg shadow-black/20'
            : 'bg-surface-base/80 backdrop-blur-md'
          }`}
        style={{ transitionDuration: '300ms', transitionTimingFunction: 'cubic-bezier(0.25, 0, 0, 1)' }}
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo — Space Grotesk, white, tight */}
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500/40 rounded-md"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                <Image
                  src="/AG_Logo2.png"
                  alt="Allowance Guard Logo"
                  fill
                  className="object-contain transition-transform duration-200 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-lg font-bold text-white leading-tight tracking-tight"
                  style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
                >
                  AllowanceGuard
                </span>
                <span className="text-[11px] text-slate-400 leading-tight hidden sm:block tracking-wide uppercase">
                  Secure Token Approvals
                </span>
              </div>
            </Link>

            {/* Desktop Navigation — stripped, no pill container */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  current={isActive(item.href)}
                >
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
                    className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500/40 rounded-md"
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
                    className="px-4 py-2 text-sm font-semibold text-crimson-400 hover:text-crimson-300 border border-crimson-500/30 hover:border-crimson-500/50 rounded-md transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500/40"
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

        {/* Signature Move: crimson bottom edge — appears on scroll */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px transition-opacity"
          style={{
            opacity: scrolled ? 1 : 0,
            background: 'linear-gradient(90deg, transparent 0%, #E53E3E 20%, #E53E3E 80%, transparent 100%)',
            boxShadow: scrolled ? '0 1px 8px rgba(229, 62, 62, 0.3)' : 'none',
            transitionDuration: '400ms',
            transitionTimingFunction: 'cubic-bezier(0.25, 0, 0, 1)',
          }}
          aria-hidden="true"
        />
      </div>
    </header>
  )
}
