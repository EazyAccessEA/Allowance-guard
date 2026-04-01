'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  BookOpen,
  Search
} from 'lucide-react'
import Image from 'next/image'

interface MobileNavigationProps {
  isConnected: boolean
}

function MobileNavigation({ isConnected }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll and manage focus when menu is open
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      
      // Focus the first interactive element in the menu
      setTimeout(() => {
        const firstButton = menuRef.current?.querySelector('button, a, [tabindex]')
        if (firstButton) {
          (firstButton as HTMLElement).focus()
        }
      }, 100)
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset'
      
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
        previousFocusRef.current = null
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const navigationItems = [
    {
      href: '/',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      description: 'Return to homepage',
      badge: null
    },
    {
      href: '/blog',
      label: 'Blog',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Security insights and guides',
      badge: null
    },
    {
      href: '/docs',
      label: 'Documentation',
      icon: <FileText className="w-5 h-5" />,
      description: 'Learn how to use Allowance Guard',
      badge: null
    },
    {
      href: '/tokens',
      label: 'Discover Tokens',
      icon: <Search className="w-5 h-5" />,
      description: 'Search and discover tokens across blockchains',
      badge: null
    },
    {
      href: '/features',
      label: 'Features',
      icon: <Shield className="w-5 h-5" />,
      description: 'Explore our security features',
      badge: null
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      description: 'Configure your preferences',
      badge: null
    }
  ]


  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="lg:hidden h-10 w-10 mobbin-focus-ring relative"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <Menu className="h-5 w-5" />
        {!isConnected && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-semantic-warning-500 rounded-full animate-pulse" />
        )}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
          {/* Backdrop - Fully Obscured */}
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-all duration-300 z-[101]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel - 100% vh and vw */}
          <div 
            ref={menuRef}
            id="mobile-menu"
            className="fixed inset-0 h-screen w-screen bg-background-primary dark:bg-secondary-900 shadow-2xl transition-all duration-300 ease-out z-[102]"
            style={{ 
              transform: isOpen 
                ? 'translateX(0)' 
                : 'translateX(100%)',
              opacity: isOpen ? 1 : 0
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-primary dark:border-secondary-700 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-secondary-800 dark:to-secondary-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Image 
                      src="/AG_Logo2.png" 
                      alt="Allowance Guard Logo" 
                      width={40} 
                      height={40}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <h2 id="mobile-menu-title" className="mobbin-heading-1 text-text-primary dark:text-secondary-100">Allowance Guard</h2>
                    <p className="mobbin-body text-text-secondary dark:text-secondary-400">Secure Token Approvals</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-10 w-10 mobbin-focus-ring hover:bg-background-secondary"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Content - Full Height Layout */}
              <div className="flex-1 flex flex-col px-8 py-8 overflow-y-auto">
                {/* Connect Wallet - Prominent */}
                <div className="mb-8 text-center">
                  <div onClick={() => setIsOpen(false)}>
                    <ClientConnectButton 
                      variant={isConnected ? "secondary" : "primary"}
                      size="lg"
                      className="w-full text-xl py-6"
                    />
                  </div>
                  {isConnected && (
                    <p className="text-semantic-success-600 dark:text-semantic-success-400 mt-4 mobbin-body">Wallet Connected</p>
                  )}
                </div>

                {/* Simple Navigation - Large Touch Targets */}
                <div className="space-y-4">
                  {navigationItems && navigationItems.length > 0 ? navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block p-6 rounded-2xl transition-all duration-200 ${
                        pathname === item.href
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-2 border-primary-200 dark:border-primary-700'
                          : 'text-text-primary dark:text-secondary-200 hover:bg-background-secondary dark:hover:bg-secondary-800 border-2 border-transparent'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl flex items-center justify-center">
                          {React.cloneElement(item.icon, { className: "w-6 h-6" })}
                        </div>
                        <span className="mobbin-heading-3 font-semibold">{item.label}</span>
                      </div>
                    </Link>
                  )) : (
                    <div className="text-center text-text-secondary dark:text-secondary-400 py-8">
                      <p className="mobbin-body">No navigation items available</p>
                    </div>
                  )}
                </div>

                {/* Spacer to push footer down */}
                <div className="flex-1" />
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNavigation