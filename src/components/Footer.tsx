'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Container from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import DonationButton from '@/components/DonationButton'
import { Heart, Shield, Code, Users, BookOpen, Github, MessageCircle, Mail, ChevronDown, ChevronUp } from 'lucide-react'

interface FooterSectionProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  icon?: React.ReactNode
}

function FooterSection({ title, children, isOpen, onToggle, icon }: FooterSectionProps) {
  return (
    <div className="border-b border-gray-800 md:border-b-0">
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={`footer-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="flex items-center justify-between w-full py-4 md:py-0 md:pointer-events-none cursor-pointer rounded-md hover:bg-gray-800/50 transition-colors duration-200"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <div className="md:hidden">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      <div 
        id={`footer-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className={`md:block ${isOpen ? 'block' : 'hidden'} pb-4 md:pb-0`}
      >
        {children}
      </div>
    </div>
  )
}

export default function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    quickLinks: false,
    community: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <footer className="bg-gray-900 text-white">
      <Container className="py-16 sm:py-20 lg:py-24">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h3 className="text-xl font-bold text-white">Allowance Guard</h3>
                <p className="text-gray-400 text-sm">Secure Token Approvals</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              The most comprehensive token allowance security platform for Web3. 
              Protect your digital assets with enterprise-grade security.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-primary-accent/10 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-accent" />
              </div>
              <span className="text-gray-300 text-sm">Open Source & Free Forever</span>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/EazyAccessEA/Allowance-guard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-accent rounded-lg flex items-center justify-center transition-all duration-200 group"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a 
                href="https://discord.gg/DsJ4Pa94" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-accent rounded-lg flex items-center justify-center transition-all duration-200 group"
                aria-label="Discord"
              >
                <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a 
                href="https://twitter.com/allowanceguard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-accent rounded-lg flex items-center justify-center transition-all duration-200 group"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links - Collapsible on Mobile */}
          <FooterSection
            title="Quick Links"
            icon={<BookOpen className="w-5 h-5 text-primary-accent" />}
            isOpen={openSections.quickLinks}
            onToggle={() => toggleSection('quickLinks')}
          >
            <ul className="space-y-4 mt-6 md:mt-6">
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-primary-accent transition-colors duration-200 block">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-300 hover:text-primary-accent transition-colors duration-200 block">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-300 hover:text-primary-accent transition-colors duration-200 block">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-gray-300 hover:text-primary-accent transition-colors duration-200 block">
                  Settings
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* Community & Support - Collapsible on Mobile */}
          <FooterSection
            title="Community"
            icon={<Users className="w-5 h-5 text-primary-accent" />}
            isOpen={openSections.community}
            onToggle={() => toggleSection('community')}
          >
            <ul className="space-y-4 mt-6 md:mt-6">
              <li>
                <a 
                  href="https://github.com/EazyAccessEA/Allowance-guard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-primary-accent transition-colors duration-200 flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://discord.gg/DsJ4Pa94" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-primary-accent transition-colors duration-200 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Discord
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary-accent transition-colors duration-200 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/docs/contributing" className="text-gray-300 hover:text-primary-accent transition-colors duration-200 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Contributing
                </Link>
              </li>
            </ul>
            
            {/* Donation Button */}
            <div className="mt-6">
              <DonationButton />
            </div>
          </FooterSection>
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  Open Source
                </Badge>
                <Badge variant="success" className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Free Forever
                </Badge>
              </div>
              <p className="text-gray-300 text-sm max-w-2xl">
                Open-source and free to use. Maintained by a small independent team and funded by{' '}
                <Link className="text-primary-accent hover:text-primary-accent/80 transition-colors duration-150" href="/docs/contributing">
                  donations and grants
                </Link>
                . No VC, no token.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>© 2025 Allowance Guard</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}