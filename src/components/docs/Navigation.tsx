'use client'

import {
  FileText, Rocket, Shield, Wrench, Settings, Puzzle, HelpCircle,
  Bell, Activity, Users, RotateCcw, Code2, MessageCircle, BookOpen,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Getting Started',
    items: [
      { id: 'overview', label: 'Overview', icon: FileText },
      { id: 'getting-started', label: 'Quick Start', icon: Rocket },
      { id: 'core-concepts', label: 'Core Concepts', icon: Shield },
    ],
  },
  {
    title: 'Using AllowanceGuard',
    items: [
      { id: 'usage-guides', label: 'Usage Guides', icon: Wrench },
      { id: 'revoking', label: 'Revoking Approvals', icon: RotateCcw },
      { id: 'alerts', label: 'Alerts', icon: Bell },
      { id: 'monitoring', label: 'Monitoring', icon: Activity },
      { id: 'teams', label: 'Teams', icon: Users },
    ],
  },
  {
    title: 'Developers',
    items: [
      { id: 'advanced-topics', label: 'Architecture', icon: Settings },
      { id: 'api', label: 'API & Settings', icon: Code2 },
      { id: 'browser-extension', label: 'Extension', icon: Puzzle },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
      { id: 'faq', label: 'FAQ', icon: MessageCircle },
    ],
  },
]

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="sticky top-24 space-y-6">
      {navGroups.map((group) => (
        <div key={group.title}>
          <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-2 px-3">
            {group.title}
          </h3>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 transition-all duration-150',
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent',
                  )}
                >
                  <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-amber-400' : 'text-slate-500')} />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Resources */}
      <div className="pt-4 border-t border-slate-700/50">
        <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-2 px-3">
          Resources
        </h3>
        <div className="space-y-0.5">
          <a
            href="https://github.com/EazyAccessEA/Allowance-guard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            GitHub
          </a>
        </div>
      </div>
    </nav>
  )
}
