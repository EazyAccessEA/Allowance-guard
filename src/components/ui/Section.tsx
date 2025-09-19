import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
  background?: 'default' | 'muted' | 'accent' | 'transparent'
  fullWidth?: boolean
  center?: boolean
}

export default function Section({ 
  children, 
  className = '',
  size = 'default',
  background = 'default',
  fullWidth = false,
  center = true
}: SectionProps) {
  // Sketch-inspired responsive section spacing
  const sizeClasses = {
    xs: 'py-8 sm:py-12',        // 32px mobile, 48px desktop
    sm: 'py-12 sm:py-16',       // 48px mobile, 64px desktop
    default: 'py-16 sm:py-20',  // 64px mobile, 80px desktop
    lg: 'py-20 sm:py-24',       // 80px mobile, 96px desktop
    xl: 'py-24 sm:py-32',       // 96px mobile, 128px desktop
    '2xl': 'py-32 sm:py-40',    // 128px mobile, 160px desktop
  }

  // Sketch-inspired background variants
  const backgroundClasses = {
    default: 'bg-white',
    muted: 'bg-neutral-50',
    accent: 'bg-primary/5',
    transparent: 'bg-transparent',
  }

  return (
    <section className={cn(
      'w-full',
      sizeClasses[size],
      backgroundClasses[background],
      fullWidth ? 'px-0' : 'px-4 sm:px-6 lg:px-8',
      center && 'text-center',
      className
    )}>
      {children}
    </section>
  )
}
