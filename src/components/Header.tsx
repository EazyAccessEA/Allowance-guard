'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
// Button component not used in this file anymore
import { Badge } from '@/components/ui/Badge'
import ClientConnectButton from '@/components/ClientConnectButton'
import MobileNavigation from '@/components/MobileNavigation'

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
      className={`relative px-4 py-3 mobbin-body-small font-medium transition-all duration-200 rounded-lg mobbin-hover-lift mobbin-focus-ring
        ${current 
          ? 'text-primary-700 bg-primary-50 border border-primary-200 shadow-sm' 
          : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary hover:border-border-primary hover:shadow-sm'
        }`}
    >
      <span className="relative z-10">{children}</span>
      {current && (
        <div className="absolute inset-0 bg-primary-100 rounded-lg" />
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

  return (
    <header
      className={`sticky top-0 z-50 bg-background-primary/95 backdrop-blur-md border-b transition-all duration-200
        ${scrolled ? 'border-border-primary shadow-sm' : 'border-transparent'}`}
    >
      <div className="mobbin-container">
        <div className="h-16 flex items-center justify-between min-h-[4rem] px-4 sm:px-6">
          {/* Logo Section - Mobbin Mobile-First */}
          <Link 
            href="/" 
            className="flex items-center gap-3 sm:gap-4 group transition-all duration-200 hover:opacity-80 flex-shrink-0 mobbin-hover-lift"
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
              <span className="mobbin-heading-4 text-text-primary leading-tight">
                Allowance Guard
              </span>
              <span className="mobbin-caption text-text-tertiary leading-tight hidden sm:block">
                Secure Token Approvals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Mobbin Spacing */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3 flex-1 justify-center max-w-lg">
            <NavLink href="/docs" current={pathname?.startsWith('/docs') ?? false}>
              Documentation
            </NavLink>
            <NavLink href="/settings" current={pathname === '/settings'}>
              Settings
            </NavLink>
            <NavLink href="/features" current={pathname === '/features'}>
              Features
            </NavLink>
          </nav>

          {/* Desktop Actions - Mobbin Touch Targets */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {isConnected ? (
              <Badge variant="success" size="sm" className="mobbin-hover-lift">
                Connected
              </Badge>
            ) : (
              <ClientConnectButton variant="primary" className="mobbin-hover-lift" />
            )}
          </div>

          {/* Mobile Actions - Mobbin Touch Optimization */}
          <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
            <MobileNavigation isConnected={isConnected} />
          </div>
        </div>

      </div>
    </header>
  )
}