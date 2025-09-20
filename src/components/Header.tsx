'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
// Button component not used in this file anymore
import { Badge } from '@/components/ui/Badge'
import ConnectButton from '@/components/ConnectButton'
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
      className={`relative px-3 py-2 mobbin-body-small font-medium transition-all duration-150 rounded-base
        ${current 
          ? 'text-primary-600 bg-primary-50 border border-primary-200' 
          : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary hover:border-border-primary'
        }`}
    >
      <span className="relative z-10">{children}</span>
      {current && (
        <div className="absolute inset-0 bg-primary-100 rounded-base" />
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
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex items-center gap-4 group transition-all duration-150 hover:opacity-80 flex-shrink-0"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center max-w-md">
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

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {isConnected ? (
              <Badge variant="success" size="sm">
                Connected
              </Badge>
            ) : (
              <ConnectButton variant="primary" />
            )}
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-3 flex-shrink-0">
            <MobileNavigation isConnected={isConnected} />
          </div>
        </div>

      </div>
    </header>
  )
}