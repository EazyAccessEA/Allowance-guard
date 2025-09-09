'use client'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={`bg-ag-panel border-2 border-ag-line p-6 hover:border-ag-line-hover transition-colors ${className}`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-ag-text mb-2">{title}</h3>
      <p className="text-ag-muted text-sm leading-relaxed">{description}</p>
    </div>
  )
}
