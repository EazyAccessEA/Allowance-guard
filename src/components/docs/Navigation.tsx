'use client'

import { BookOpen, Rocket, Zap, Wrench, Shield, HelpCircle, MessageCircle } from 'lucide-react'

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const sections = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'quickstart', label: 'Quick Start', icon: Rocket },
  { id: 'features', label: 'Features', icon: Zap },
  { id: 'api', label: 'API Reference', icon: Wrench },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
]

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="sticky top-24">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text-secondary dark:text-secondary-400 uppercase tracking-wide mb-4">
          Documentation
        </h3>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
              activeSection === section.id
                ? 'bg-amber-500 text-slate-900'
                : 'text-text-secondary dark:text-secondary-400 hover:text-text-primary dark:hover:text-secondary-100 hover:bg-background-secondary dark:hover:bg-secondary-800'
            }`}
          >
            <section.icon className="inline w-4 h-4 mr-2" />
            {section.label}
          </button>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t-2 border-border-primary dark:border-secondary-700">
        <h3 className="text-sm font-semibold text-text-secondary dark:text-secondary-400 uppercase tracking-wide mb-4">
          Resources
        </h3>
        <div className="space-y-2">
          <a
            href="https://github.com/EazyAccessEA/Allowance-guard"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 text-sm text-text-secondary dark:text-secondary-400 hover:text-text-primary dark:hover:text-secondary-100 hover:bg-background-secondary dark:hover:bg-secondary-800 transition-colors"
          >
            <span className="mr-2">📦</span>
            GitHub Repository
          </a>
          <a
            href="https://discord.gg/allowanceguard"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 text-sm text-text-secondary dark:text-secondary-400 hover:text-text-primary dark:hover:text-secondary-100 hover:bg-background-secondary dark:hover:bg-secondary-800 transition-colors"
          >
            <MessageCircle className="inline w-4 h-4 mr-2" />
            Discord Community
          </a>
          <a
            href="https://x.com/allowanceguard"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 text-sm text-text-secondary dark:text-secondary-400 hover:text-text-primary dark:hover:text-secondary-100 hover:bg-background-secondary dark:hover:bg-secondary-800 transition-colors"
          >
            <span className="mr-2">𝕏</span>
            X Updates
          </a>
        </div>
      </div>
    </nav>
  )
}
