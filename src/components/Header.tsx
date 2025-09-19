'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
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
      className={`relative px-3 py-2 text-sm font-medium transition-all duration-150 rounded-base
        ${current 
          ? 'text-primary bg-primary/5' 
          : 'text-text-secondary hover:text-text-primary hover:bg-background-light'
        }`}
    >
      <span className="relative z-10">{children}</span>
      {current && (
        <div className="absolute inset-0 bg-primary/10 rounded-base" />
      )}
    </Link>
  )
}

export default function Header({ isConnected }: HeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen) {
      const handleClickOutside = () => setMobileMenuOpen(false)
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-200
        ${scrolled ? 'border-border-default shadow-subtle' : 'border-transparent'}`}
    >
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group transition-all duration-150 hover:opacity-80"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard"
                fill
                className="object-contain transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-text-primary leading-tight">
                Allowance Guard
              </span>
              <span className="text-xs text-text-muted leading-tight hidden sm:block">
                Secure Token Approvals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
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
          <div className="hidden lg:flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <Badge variant="success" size="sm">
                  Connected
                </Badge>
                <ConnectButton variant="ghost" />
              </div>
            ) : (
              <ConnectButton variant="primary" />
            )}
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-2">
            {!isConnected && (
              <ConnectButton 
                variant="primary" 
                size="sm"
                className="text-xs px-3 py-1.5"
              />
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setMobileMenuOpen(!mobileMenuOpen)
              }}
              className="h-9 w-9"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border-default bg-white animate-slide-in">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/docs"
                className="block px-3 py-2 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-background-light rounded-base transition-colors duration-150"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-background-light rounded-base transition-colors duration-150"
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <Link
                href="/features"
                className="block px-3 py-2 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-background-light rounded-base transition-colors duration-150"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              
              {/* Mobile Connection Status */}
              {isConnected && (
                <div className="pt-3 mt-3 border-t border-border-default">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm text-text-secondary">Wallet Status</span>
                    <Badge variant="success" size="sm">
                      Connected
                    </Badge>
                  </div>
                  <div className="px-3">
                    <ConnectButton variant="ghost" size="sm" className="w-full justify-start" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}