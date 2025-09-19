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
  Users, 
  ExternalLink,
  ChevronRight,
  Home,
  Zap,
  Lock,
  Globe,
  Github,
  MessageCircle,
  Star,
  Heart
} from 'lucide-react'

interface MobileNavigationProps {
  isConnected: boolean
}

export default function MobileNavigation({ isConnected }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
    setActiveSection(null)
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
      description: 'Return to the main dashboard',
      badge: null
    },
    {
      href: '/features',
      label: 'Features',
      icon: <Shield className="w-5 h-5" />,
      description: 'Explore our security features',
      badge: 'New'
    },
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
      href: '/contact',
      label: 'Support',
      icon: <Users className="w-5 h-5" />,
      description: 'Get help and support',
      badge: null
    }
  ]

  const quickActions = [
    {
      href: '/scan',
      label: 'Quick Scan',
      icon: <Zap className="w-5 h-5" />,
      description: 'Scan your wallet for approvals',
      color: 'text-semantic-warning-600 bg-semantic-warning-50'
    },
    {
      href: '/security',
      label: 'Security Check',
      icon: <Lock className="w-5 h-5" />,
      description: 'Review security recommendations',
      color: 'text-semantic-error-600 bg-semantic-error-50'
    }
  ]

  const externalLinks = [
    {
      href: 'https://github.com/EazyAccessEA/Allowance-guard',
      label: 'GitHub',
      icon: <Github className="w-5 h-5" />,
      description: 'View source code',
      color: 'text-neutral-600 bg-neutral-50'
    },
    {
      href: 'https://discord.gg/DsJ4Pa94',
      label: 'Discord',
      icon: <MessageCircle className="w-5 h-5" />,
      description: 'Join our community',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      href: 'https://allowanceguard.com',
      label: 'Website',
      icon: <Globe className="w-5 h-5" />,
      description: 'Visit our main website',
      color: 'text-primary-600 bg-primary-50'
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div 
            ref={menuRef}
            id="mobile-menu"
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-background-primary shadow-2xl transform transition-transform duration-300 ease-out"
            style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-primary bg-gradient-to-r from-primary-50 to-secondary-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 id="mobile-menu-title" className="mobbin-heading-3 text-text-primary">Allowance Guard</h2>
                    <p className="mobbin-caption text-text-tertiary">Secure Token Approvals</p>
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
                  {/* Connection Status */}
                  {isConnected ? (
                    <div className="p-4 bg-semantic-success-50 rounded-xl border border-semantic-success-200">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-semantic-success-500 rounded-full animate-pulse" />
                        <div>
                          <p className="mobbin-body font-medium text-semantic-success-700">Wallet Connected</p>
                          <p className="mobbin-caption text-semantic-success-600">Ready to scan and manage approvals</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-semantic-warning-50 rounded-xl border border-semantic-warning-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-semantic-warning-500 rounded-full animate-pulse" />
                        <div>
                          <p className="mobbin-body font-medium text-semantic-warning-700">Wallet Not Connected</p>
                          <p className="mobbin-caption text-semantic-warning-600">Connect to start managing approvals</p>
                        </div>
                      </div>
                      <div onClick={() => setIsOpen(false)}>
                        <ConnectButton 
                          variant="primary" 
                          className="w-full"
                          size="sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div>
                    <h3 className="mobbin-heading-4 text-text-primary mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {quickActions.map((action) => (
                        <Link
                          key={action.href}
                          href={action.href}
                          className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 mobbin-focus-ring hover:scale-[1.02] ${action.color}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="p-3 rounded-lg bg-white/50">
                            {action.icon}
                          </div>
                          <div className="flex-1">
                            <div className="mobbin-body font-medium">{action.label}</div>
                            <div className="mobbin-caption opacity-80">{action.description}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-60" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div>
                    <h3 className="mobbin-heading-4 text-text-primary mb-3 flex items-center gap-2">
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
                              ? 'bg-primary-50 text-primary-600 border border-primary-200 shadow-sm'
                              : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
                          }`}
                          onClick={() => setIsOpen(false)}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className={`p-3 rounded-lg transition-colors duration-200 ${
                            pathname === item.href
                              ? 'bg-primary-100 text-primary-600'
                              : 'bg-background-secondary text-text-tertiary group-hover:bg-primary-50 group-hover:text-primary-600'
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
                            <div className="mobbin-caption text-text-tertiary">{item.description}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                  {/* External Links */}
                  <div>
                    <h3 className="mobbin-heading-4 text-text-primary mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Community & Resources
                    </h3>
                    <div className="space-y-2">
                      {externalLinks.map((link, index) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 mobbin-focus-ring hover:scale-[1.01] ${link.color}`}
                          onClick={() => setIsOpen(false)}
                          style={{ animationDelay: `${(index + navigationItems.length) * 50}ms` }}
                        >
                          <div className="p-3 rounded-lg bg-white/50">
                            {link.icon}
                          </div>
                          <div className="flex-1">
                            <div className="mobbin-body font-medium">{link.label}</div>
                            <div className="mobbin-caption opacity-80">{link.description}</div>
                          </div>
                          <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border-primary bg-gradient-to-r from-background-secondary/50 to-background-primary/50">
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
                    <p className="mobbin-caption text-text-tertiary mb-2">
                      Built with ❤️ for the DeFi community
                    </p>
                    <p className="mobbin-caption text-text-tertiary">
                      © 2024 Allowance Guard
                    </p>
                  </div>

                  {/* Support Call-to-Action */}
                  <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Star className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="mobbin-body font-medium text-primary-700">Love Allowance Guard?</p>
                        <p className="mobbin-caption text-primary-600">Support our mission to secure DeFi</p>
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
