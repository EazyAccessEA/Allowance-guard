'use client'

import { useState, useEffect } from 'react'
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
  ExternalLink
} from 'lucide-react'

interface MobileNavigationProps {
  isConnected: boolean
}

export default function MobileNavigation({ isConnected }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navigationItems = [
    {
      href: '/docs',
      label: 'Documentation',
      icon: <FileText className="w-5 h-5" />,
      description: 'Learn how to use Allowance Guard'
    },
    {
      href: '/features',
      label: 'Features',
      icon: <Shield className="w-5 h-5" />,
      description: 'Explore our security features'
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      description: 'Configure your preferences'
    },
    {
      href: '/contact',
      label: 'Support',
      icon: <Users className="w-5 h-5" />,
      description: 'Get help and support'
    }
  ]

  const externalLinks = [
    {
      href: 'https://github.com/EazyAccessEA/Allowance-guard',
      label: 'GitHub',
      icon: <ExternalLink className="w-4 h-4" />,
      description: 'View source code'
    },
    {
      href: 'https://discord.gg/DsJ4Pa94',
      label: 'Discord',
      icon: <ExternalLink className="w-4 h-4" />,
      description: 'Join our community'
    }
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="lg:hidden h-10 w-10 mobbin-focus-ring"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-background-primary shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-primary">
                <h2 className="mobbin-heading-3 text-text-primary">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-10 w-10 mobbin-focus-ring"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-3">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-150 mobbin-focus-ring ${
                        pathname?.startsWith(item.href)
                          ? 'bg-primary-50 text-primary-600 border border-primary-200'
                          : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className={`p-3 rounded-lg ${
                        pathname?.startsWith(item.href)
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-background-secondary text-text-tertiary'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="mobbin-body font-medium">{item.label}</div>
                        <div className="mobbin-caption text-text-tertiary">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* External Links */}
                <div className="px-6 py-4">
                  <div className="mobbin-caption font-medium text-text-tertiary uppercase tracking-wide mb-3">
                    External Links
                  </div>
                  <div className="space-y-2">
                    {externalLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-all duration-150 mobbin-focus-ring"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="p-3 rounded-lg bg-background-secondary text-text-tertiary">
                          {link.icon}
                        </div>
                        <div className="flex-1">
                          <div className="mobbin-body font-medium">{link.label}</div>
                          <div className="mobbin-caption text-text-tertiary">{link.description}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border-primary space-y-6">
                {/* Connection Status */}
                {isConnected ? (
                  <div className="flex items-center justify-between p-4 bg-semantic-success-50 rounded-lg border border-semantic-success-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-semantic-success-500 rounded-full" />
                      <span className="mobbin-body font-medium text-text-primary">Wallet Connected</span>
                    </div>
                    <Badge variant="success" size="sm">Connected</Badge>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div onClick={() => setIsOpen(false)}>
                      <ConnectButton 
                        variant="primary" 
                        className="w-full"
                      />
                    </div>
                    <p className="mobbin-caption text-text-tertiary text-center">
                      Connect your wallet to start scanning
                    </p>
                  </div>
                )}

                {/* App Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Badge variant="secondary" size="sm">Open Source</Badge>
                    <Badge variant="success" size="sm">Free Forever</Badge>
                  </div>
                  <p className="mobbin-caption text-text-tertiary">
                    © 2024 Allowance Guard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
