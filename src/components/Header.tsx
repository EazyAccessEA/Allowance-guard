'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-platinum border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 relative">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard"
                fill
                className="object-contain"
              />
            </div>
            <span className="fireart-heading-3 text-obsidian">Allowance Guard</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/docs" 
              className="fireart-body text-charcoal hover:text-obsidian transition-colors duration-200"
            >
              Docs
            </Link>
            <Link 
              href="/faq" 
              className="fireart-body text-charcoal hover:text-obsidian transition-colors duration-200"
            >
              FAQ
            </Link>
            <Link 
              href="/preferences" 
              className="fireart-body text-charcoal hover:text-obsidian transition-colors duration-200"
            >
              Preferences
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden fireart-button-ghost p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-charcoal" />
            ) : (
              <Menu className="w-6 h-6 text-charcoal" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/docs" 
                className="fireart-body text-charcoal hover:text-obsidian transition-colors duration-200 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <Link 
                href="/faq" 
                className="fireart-body text-charcoal hover:text-obsidian transition-colors duration-200 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/preferences" 
                className="fireart-body text-charcoal hover:text-obsidian transition-colors duration-200 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preferences
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
