'use client'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={`bg-background-secondary dark:bg-secondary-800 border-2 border-secondary-700 p-6 hover:border-secondary-700/70 dark:hover:border-secondary-600 transition-colors ${className}`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-text-primary dark:text-secondary-100 mb-2">{title}</h3>
      <p className="text-text-secondary dark:text-secondary-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
