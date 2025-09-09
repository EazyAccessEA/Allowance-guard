'use client'

import React, { useState } from 'react'
import { HexButton } from './HexButton'
import { ArrowRight, Twitter, Linkedin, Youtube, MessageCircle } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    // Here you would typically call an API to subscribe the user
    console.log('Subscribing email:', email)
    setSubscribed(true)
    setEmail('')
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubscribed(false), 3000)
  }

  const footerLinks = {
    developers: [
      { label: 'Docs', href: '/docs' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'GitHub', href: 'https://github.com/EazyAccessEA/Allowance-guard' },
      { label: 'Status', href: '/status' },
      { label: 'Security', href: '/security' },
      { label: 'FAQ', href: '/faq' },
    ],
    solutions: [
      { label: 'DeFi', href: '/solutions/defi' },
      { label: 'Payments', href: '/solutions/payments' },
      { label: 'Custodians', href: '/solutions/custodians' },
      { label: 'Compliance', href: '/solutions/compliance' },
      { label: 'Mobile Wallets', href: '/solutions/mobile' },
      { label: 'Gaming', href: '/solutions/gaming' },
      { label: 'Marketplaces', href: '/solutions/marketplaces' },
      { label: 'Social', href: '/solutions/social' },
    ],
    connect: [
      { label: 'X (Twitter)', href: 'https://twitter.com/allowanceguard', icon: Twitter },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/allowance-guard', icon: Linkedin },
      { label: 'YouTube', href: 'https://youtube.com/@allowanceguard', icon: Youtube },
      { label: 'Discord', href: 'https://discord.gg/allowanceguard', icon: MessageCircle },
      { label: 'Farcaster', href: 'https://warpcast.com/allowanceguard' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Enterprise', href: '/enterprise' },
      { label: 'Blog', href: '/blog' },
      { label: 'Newsroom', href: '/newsroom' },
      { label: 'Careers', href: '/careers' },
      { label: 'Media Kit', href: '/media-kit' },
      { label: 'Contact', href: '/contact' },
    ],
  }

  return (
    <footer className="bg-surface border-t border-border">
      {/* Newsletter Section */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Subscribe to our newsletter.
              </h3>
              <p className="text-muted-foreground">
                You can unsubscribe at any time. Our{' '}
                <a href="/privacy" className="underline hover:text-foreground transition-colors">
                  Privacy Policy
                </a>{' '}
                is available here.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-input border-2 border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary rounded-full"
                required
              />
              <HexButton
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white border-primary hover:border-primary/90"
                size="md"
              >
                <ArrowRight className="w-4 h-4" />
              </HexButton>
            </form>
            
            {subscribed && (
              <div className="text-sm text-emerald font-medium">
                Successfully subscribed!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Product */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Product</h4>
            <ul className="space-y-4">
              <li><a href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a></li>
              <li><a href="/security" className="text-muted-foreground hover:text-foreground transition-colors">Security</a></li>
              <li><a href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="/integrations" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Developers</h4>
            <ul className="space-y-4">
              {footerLinks.developers.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="/status" className="text-muted-foreground hover:text-foreground transition-colors">Status</a></li>
              <li><a href="/help" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="/community" className="text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Connect</h4>
            <ul className="space-y-4">
              {footerLinks.connect.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-wrap gap-8">
              <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </a>
            </div>
            
            <div className="flex items-center gap-6">
              <p className="text-muted-foreground">
                © 2025 Allowance Guard. All rights reserved.
              </p>
              
              {/* Brand Elements */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-background rounded-full"></div>
                </div>
                <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                  <div className="text-background text-lg font-bold">/</div>
                </div>
                <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                  <span className="text-background text-sm font-bold">AG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
