'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import ConnectButton from '@/components/ConnectButton'
import { 
  X, 
  Menu, 
  Shield, 
  Settings, 
  FileText, 
  ChevronRight,
  Home,
  Star,
  Heart,
  Github
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
      href: '/docs',
      label: 'Documentation',
      icon: <FileText className="w-5 h-5" />,
      description: 'Learn how to use Allowance Guard',
      badge: null
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      description: 'Configure your preferences',
      badge: null
    },
    {
      href: '/features',
      label: 'Features',
      icon: <Shield className="w-5 h-5" />,
      description: 'Explore our security features',
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
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-lg transition-all duration-300"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div 
            ref={menuRef}
            id="mobile-menu"
            className="fixed inset-0 h-full w-full bg-white shadow-2xl transition-all duration-300 ease-out"
            style={{ 
              transform: isOpen 
                ? 'translateX(0)' 
                : 'translateX(100%)',
              opacity: isOpen ? 1 : 0
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
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
                    <h2 id="mobile-menu-title" className="mobbin-heading-3 text-gray-900">Allowance Guard</h2>
                    <p className="mobbin-caption text-gray-600">Secure Token Approvals</p>
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

              {/* Navigation Content - Centered and Simple */}
              <div className="flex-1 flex flex-col justify-center px-8">
                {/* Connect Wallet - Prominent */}
                <div className="mb-16 text-center">
                  <ConnectButton 
                    variant={isConnected ? "secondary" : "primary"}
                    size="lg"
                    className="w-full text-lg py-4"
                    onClick={() => setIsOpen(false)}
                  />
                  {isConnected && (
                    <p className="text-green-600 mt-3 text-sm">✓ Wallet Connected</p>
                  )}
                </div>

                {/* Simple Navigation - Large Touch Targets */}
                <div className="space-y-6">
                  {navigationItems && navigationItems.length > 0 ? navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block p-6 rounded-2xl text-center transition-all duration-200 ${
                        pathname === item.href
                          ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 border-2 border-transparent'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-2xl">{item.icon}</div>
                        <span className="text-xl font-medium">{item.label}</span>
                      </div>
                    </Link>
                  )) : (
                    <div className="text-center text-gray-500 py-8">
                      No navigation items available
                    </div>
                  )}
                </div>
              </div>

              {/* Simple Footer */}
              <div className="p-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  © 2024 Allowance Guard
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNavigation