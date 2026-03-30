import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'default' | 'lg' | 'xl'
  center?: boolean
  fluid?: boolean
}

export default function Container({ 
  children, 
  className = '',
  size = 'default',
  padding = 'default',
  center = true,
  fluid = false
}: ContainerProps) {
  // Sketch-inspired responsive container sizes
  const sizeClasses = {
    xs: 'max-w-xs',        // 320px
    sm: 'max-w-2xl',       // 672px
    default: 'max-w-container', // 1200px from design tokens
    lg: 'max-w-6xl',       // 1152px
    xl: 'max-w-7xl',       // 1280px
    '2xl': 'max-w-8xl',    // 1408px
    full: 'max-w-full'
  }

  // Sketch-inspired responsive padding system
  const paddingClasses = {
    none: 'px-0',
    sm: 'px-2 sm:px-4',           // 8px mobile, 16px desktop
    default: 'px-4 sm:px-6 lg:px-8', // 16px mobile, 24px tablet, 32px desktop
    lg: 'px-6 sm:px-8 lg:px-12',  // 24px mobile, 32px tablet, 48px desktop
    xl: 'px-8 sm:px-12 lg:px-16', // 32px mobile, 48px tablet, 64px desktop
  }

  return (
    <div className={cn(
      'w-full',
      center && !fluid && 'mx-auto',
      !fluid && sizeClasses[size],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  )
}