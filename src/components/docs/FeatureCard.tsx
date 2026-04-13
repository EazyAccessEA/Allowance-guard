'use client'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={`bg-paper-sub border-2 border-ink-rule p-6 hover:border-ink-rule/70  transition-colors ${className}`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
      <p className="text-ink-muted text-sm leading-relaxed">{description}</p>
    </div>
  )
}
