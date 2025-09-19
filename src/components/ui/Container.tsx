import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full'
}

export default function Container({ 
  children, 
  className = '',
  size = 'default'
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    default: 'max-w-container', // 1200px from design tokens
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className={cn(
      'mx-auto w-full px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  )
}