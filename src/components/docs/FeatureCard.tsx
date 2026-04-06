'use client'

import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: LucideIcon | string
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  const isStringIcon = typeof Icon === 'string'

  return (
    <div className={cn(
      'group relative rounded-xl p-6',
      'bg-slate-800/40 border border-slate-700/50',
      'hover:bg-slate-800/60 hover:border-amber-500/30',
      'transition-all duration-200',
      className
    )}>
      {/* Amber glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

      <div className="relative">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
          {isStringIcon ? (
            <span className="text-xl">{Icon}</span>
          ) : (
            <Icon className="w-5 h-5 text-amber-400" />
          )}
        </div>
        <h3 className="text-base font-semibold text-slate-100 mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
