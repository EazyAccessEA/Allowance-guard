'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import ClientConnectButton from '@/components/ClientConnectButton'
import {
  X,
  Menu,
  Shield,
  Settings,
  FileText,
  Home,
  Search,
  CreditCard,
} from 'lucide-react'
import Image from 'next/image'

interface MobileNavigationProps {
  isConnected: boolean
}

const NAV_ITEMS = [
  { href: '/', label: 'Scan', icon: Home, description: 'Scan your wallet' },
  { href: '/features', label: 'Features', icon: Shield, description: 'Security features' },
  { href: '/pricing', label: 'Pricing', icon: CreditCard, description: 'Plans & pricing' },
  { href: '/docs', label: 'Docs', icon: FileText, description: 'Documentation' },
  { href: '/tokens', label: 'Discover', icon: Search, description: 'Discover tokens' },
  { href: '/settings', label: 'Settings', icon: Settings, description: 'Preferences' },
] as const

function MobileNavigation({ isConnected }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => setIsOpen(false), [])

  // Close on route change
  useEffect(() => { close() }, [pathname, close])

  // Body scroll lock + focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        const first = menuRef.current?.querySelector<HTMLElement>('button, a, [tabindex]')
        first?.focus()
      }, 100)
    } else {
      document.body.style.overflow = 'unset'
      previousFocusRef.current?.focus()
      previousFocusRef.current = null
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, close])

  return (
    <>
      {/* Hamburger — minimal, white on dark nav */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="lg:hidden h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10 rounded-md
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500/40"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <Menu className="h-5 w-5" />
        {!isConnected && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-crimson-500 rounded-full" aria-hidden="true" />
        )}
      </Button>

      {/* Full-screen dark overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101]"
            onClick={close}
            aria-hidden="true"
          />

          {/* Panel — dark surface, full screen */}
          <div
            ref={menuRef}
            id="mobile-menu"
            className="fixed inset-0 h-screen w-screen bg-surface-base z-[102] flex flex-col"
            style={{
              transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
              opacity: isOpen ? 1 : 0,
              transition: 'transform 300ms cubic-bezier(0.25, 0, 0, 1), opacity 200ms ease',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center">
                  <Image
                    src="/AG_Logo2.png"
                    alt="Allowance Guard Logo"
                    width={36}
                    height={36}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h2
                    id="mobile-menu-title"
                    className="text-lg font-bold text-white tracking-tight"
                    style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
                  >
                    AllowanceGuard
                  </h2>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Secure Token Approvals
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={close}
                className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10 rounded-md
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500/40"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
              {/* Connect CTA */}
              <div className="mb-6">
                <div onClick={close}>
                  <ClientConnectButton
                    variant={isConnected ? 'secondary' : 'primary'}
                    size="lg"
                    className="w-full text-base py-4"
                  />
                </div>
                {isConnected && (
                  <p className="text-volt-500 mt-3 text-sm text-center font-medium">
                    Wallet Connected
                  </p>
                )}
              </div>

              {/* Nav items — large touch targets, dark surface */}
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const active = item.href === '/' ? pathname === '/' : (pathname?.startsWith(item.href) ?? false)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-4 px-4 py-4 rounded-lg transition-colors duration-150
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500/40
                        ${active
                          ? 'bg-white/10 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      onClick={close}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-base font-medium">{item.label}</span>
                      {/* Active indicator — crimson dot */}
                      {active && (
                        <span
                          className="ml-auto w-1.5 h-1.5 bg-crimson-500 rounded-full"
                          aria-hidden="true"
                          style={{ boxShadow: '0 0 6px rgba(229, 62, 62, 0.5)' }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>

              <div className="flex-1" />

              {/* Signature crimson line at bottom */}
              <div
                className="h-px mt-6"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #E53E3E 30%, #E53E3E 70%, transparent 100%)',
                  boxShadow: '0 0 8px rgba(229, 62, 62, 0.3)',
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNavigation
