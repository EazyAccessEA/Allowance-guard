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
        className="lg:hidden h-10 w-10"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background-dark/75 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border-default">
                <h2 className="text-lg font-semibold text-text-primary">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 ${
                        pathname?.startsWith(item.href)
                          ? 'bg-primary-accent/10 text-primary-accent'
                          : 'text-text-secondary hover:text-text-primary hover:bg-background-light'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className={`p-2 rounded-lg ${
                        pathname?.startsWith(item.href)
                          ? 'bg-primary-accent/20'
                          : 'bg-background-light'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-text-muted">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* External Links */}
                <div className="px-4 py-2">
                  <div className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
                    External Links
                  </div>
                  <div className="space-y-1">
                    {externalLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-light transition-colors duration-150"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="p-2 rounded-lg bg-background-light">
                          {link.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{link.label}</div>
                          <div className="text-sm text-text-muted">{link.description}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border-default space-y-4">
                {/* Connection Status */}
                {isConnected ? (
                  <div className="flex items-center justify-between p-3 bg-semantic-success/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-semantic-success rounded-full" />
                      <span className="text-sm font-medium text-text-primary">Wallet Connected</span>
                    </div>
                    <Badge variant="success" size="sm">Connected</Badge>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div onClick={() => setIsOpen(false)}>
                      <ConnectButton 
                        variant="primary" 
                        className="w-full"
                      />
                    </div>
                    <p className="text-xs text-text-muted text-center">
                      Connect your wallet to start scanning
                    </p>
                  </div>
                )}

                {/* App Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge variant="secondary" size="sm">Open Source</Badge>
                    <Badge variant="success" size="sm">Free Forever</Badge>
                  </div>
                  <p className="text-xs text-text-muted">
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
