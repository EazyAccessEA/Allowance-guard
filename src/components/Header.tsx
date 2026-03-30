'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import ClientConnectButton from '@/components/ClientConnectButton'
import MobileNavigation from '@/components/MobileNavigation'
import PlanBadge from '@/components/PlanBadge'
import { ThemeToggle } from '@/components/ThemeProvider'

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
      className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full mobbin-focus-ring
        ${current
          ? 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 shadow-sm'
          : 'text-text-secondary dark:text-secondary-400 hover:text-text-primary dark:hover:text-secondary-100 hover:bg-background-secondary/80 dark:hover:bg-secondary-800/60'
        }`}
    >
      {children}
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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-white/80 dark:bg-secondary-900/80 backdrop-blur-glass border-b border-border-primary/50 dark:border-secondary-700/50 shadow-sm dark:shadow-dark-subtle'
          : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="mobbin-container">
        <div className="h-16 flex items-center justify-between min-h-[4rem] px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 sm:gap-4 group transition-all duration-200 hover:opacity-80 flex-shrink-0"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard Logo"
                fill
                className="object-contain transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-text-primary dark:text-secondary-100 leading-tight">
                Allowance Guard
              </span>
              <span className="text-xs text-text-tertiary dark:text-secondary-500 leading-tight hidden sm:block">
                Secure Token Approvals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — Floating Pill */}
          <nav className="hidden lg:flex items-center gap-1 px-2 py-1.5 bg-background-secondary/60 dark:bg-secondary-800/50 backdrop-blur-glass rounded-full border border-border-primary/30 dark:border-secondary-700/40 shadow-glass dark:shadow-dark-subtle">
            <NavLink href="/blog" current={pathname?.startsWith('/blog') ?? false}>
              Blog
            </NavLink>
            <NavLink href="/docs" current={pathname?.startsWith('/docs') ?? false}>
              Docs
            </NavLink>
            <NavLink href="/features" current={pathname === '/features'}>
              Features
            </NavLink>
            <NavLink href="/pricing" current={pathname === '/pricing'}>
              Pricing
            </NavLink>
            <NavLink href="/settings" current={pathname === '/settings'}>
              Settings
            </NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            {isConnected ? (
              <>
                <PlanBadge plan="free" size="sm" />
                <Link
                  href="/account"
                  className="px-3 py-1.5 text-sm font-medium text-text-secondary dark:text-secondary-400 hover:text-text-primary dark:hover:text-secondary-100 transition-colors duration-150"
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
                  className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-full transition-colors duration-150"
                >
                  Upgrade
                </Link>
                <ClientConnectButton variant="primary" />
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <MobileNavigation isConnected={isConnected} />
          </div>
        </div>
      </div>
    </header>
  )
}
