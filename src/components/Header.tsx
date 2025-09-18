'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Container from '@/components/ui/Container'
import ConnectButton from '@/components/ConnectButton'

interface HeaderProps {
  isConnected: boolean
}

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
      className={`nav-link px-0 text-sm font-medium transition-colors duration-200
        ${current ? 'text-ink' : 'text-stone hover:text-ink'}`}
    >
      <span className="leading-ctl">{children}</span>
    </Link>
  )
}

export default function Header({ isConnected }: HeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // close mobile menu when route changes
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-sm
        transition-all duration-200 ${scrolled ? 'border-b border-line/50' : ''}`}
    >
      <Container className="h-header flex items-center justify-between">
        {/* Left: logo + wordmark */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <Image
              src="/AG_Logo2.png"
              alt="Allowance Guard"
              fill
              className="object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          <span className="text-lg font-semibold text-ink leading-none">Allowance Guard</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <NavLink href="/docs" current={pathname?.startsWith('/docs') ?? false}>
            Docs
          </NavLink>
          <NavLink href="/settings" current={pathname === '/settings'}>
            Settings
          </NavLink>
          <NavLink href="/security" current={pathname === '/security'}>
            Security
          </NavLink>
          {!isConnected && (
            <ConnectButton 
              variant="primary" 
              className="h-ctl inline-flex items-center justify-center px-4"
            />
          )}
        </nav>

        {/* Mobile actions */}
        <div className="lg:hidden flex items-center gap-3">
          {!isConnected && (
            <ConnectButton 
              variant="primary" 
              className="h-ctl inline-flex items-center justify-center px-4"
            />
          )}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="h-ctl w-10 inline-flex items-center justify-center rounded-lg border border-line text-ink/70 hover:text-ink hover:bg-mist transition-all duration-200"
          >
            <span className="sr-only">Open menu</span>
            {/* hamburger */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile menu panel */}
      <div
        className={`lg:hidden border-t border-line/50 bg-white transition-all duration-200 origin-top
        ${open ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}
      >
        <Container className="py-3 flex flex-col gap-2">
          <Link
            href="/docs"
            className="nav-link text-base font-medium text-stone hover:text-ink"
          >
            <span className="leading-ctl">Docs</span>
          </Link>
          <Link
            href="/settings"
            className="nav-link text-base font-medium text-stone hover:text-ink"
          >
            <span className="leading-ctl">Settings</span>
          </Link>
          <Link
            href="/security"
            className="nav-link text-base font-medium text-stone hover:text-ink"
          >
            <span className="leading-ctl">Security</span>
          </Link>
        </Container>
      </div>
    </header>
  )
}
