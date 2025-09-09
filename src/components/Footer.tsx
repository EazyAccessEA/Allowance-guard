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
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Subscribe to our newsletter.
              </h3>
              <p className="text-sm text-gray-600">
                You can unsubscribe at any time. Our{' '}
                <a href="/privacy" className="underline hover:text-gray-900">
                  Privacy Policy
                </a>{' '}
                is available here.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <HexButton
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                size="md"
              >
                <ArrowRight className="w-4 h-4" />
              </HexButton>
            </form>
            
            {subscribed && (
              <div className="text-sm text-emerald-600 font-medium">
                Successfully subscribed!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Developers */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Developers</h4>
            <ul className="space-y-3">
              {footerLinks.developers.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Connect</h4>
            <ul className="space-y-3">
              {footerLinks.connect.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
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

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-6">
              <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
              <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
              <a href="/cookies" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Cookie Policy
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                © 2025 Allowance Guard. All rights reserved.
              </p>
              
              {/* Brand Elements */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-white text-sm font-bold">/</div>
                </div>
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
