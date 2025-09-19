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
            className="fixed top-1/2 left-1/2 h-[75vh] w-[80vw] max-w-md bg-white shadow-2xl rounded-xl transition-all duration-300 ease-out"
            style={{ 
              transform: isOpen 
                ? 'translate(-50%, -50%) scale(1)' 
                : 'translate(-50%, -50%) scale(0.8)',
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

              {/* Navigation Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Connect Wallet - Priority Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="mobbin-heading-4 text-gray-900 mb-1">Connect Your Wallet</h3>
                        <p className="mobbin-caption text-gray-600">
                          {isConnected ? 'Wallet connected and ready' : 'Connect to start managing approvals'}
                        </p>
                      </div>
                      {isConnected && (
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div onClick={() => setIsOpen(false)}>
                      <ConnectButton 
                        variant={isConnected ? "secondary" : "primary"}
                        className="w-full"
                        size="lg"
                      />
                    </div>
                  </div>

                  {/* Navigation */}
                  <div>
                    <h3 className="mobbin-heading-4 text-gray-900 mb-3 flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Navigation
                    </h3>
                    <div className="space-y-2">
                      {navigationItems.map((item, index) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 mobbin-focus-ring hover:scale-[1.01] ${
                            pathname === item.href
                              ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsOpen(false)}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className={`p-3 rounded-lg transition-colors duration-200 ${
                            pathname === item.href
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                          }`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="mobbin-body font-medium">{item.label}</span>
                              {item.badge && (
                                <Badge variant="success" size="sm" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <div className="mobbin-caption text-gray-500">{item.description}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="space-y-4">
                  {/* App Info */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Badge variant="secondary" size="sm" className="flex items-center gap-1">
                        <Github className="w-3 h-3" />
                        Open Source
                      </Badge>
                      <Badge variant="success" size="sm" className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        Free Forever
                      </Badge>
                    </div>
                    <p className="mobbin-caption text-gray-500 mb-2">
                      Built with ❤️ for the DeFi community
                    </p>
                    <p className="mobbin-caption text-gray-500">
                      © 2024 Allowance Guard
                    </p>
                  </div>

                  {/* Support Call-to-Action */}
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Star className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="mobbin-body font-medium text-blue-700">Love Allowance Guard?</p>
                        <p className="mobbin-caption text-blue-600">Support our mission to secure DeFi</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => setIsOpen(false)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Support Us
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => setIsOpen(false)}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Star on GitHub
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNavigation