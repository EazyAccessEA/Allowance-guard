import React from 'react'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'white' | 'black' | 'cobalt' | 'emerald' | 'crimson'
  variant?: 'spinner' | 'dots' | 'pulse' | 'hex'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'white', 
  variant = 'spinner',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }
  
  const colorClasses = {
    white: 'border-white',
    black: 'border-black',
    cobalt: 'border-cobalt',
    emerald: 'border-emerald',
    crimson: 'border-crimson'
  }

  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${sizeClasses[size]} rounded-full bg-current animate-pulse`}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-current animate-pulse ${className}`} />
    )
  }

  if (variant === 'hex') {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div className="relative w-full h-full">
          <div className="absolute inset-0 border-2 border-transparent border-t-current rounded-full animate-spin" />
          <div className="absolute inset-1 border-2 border-transparent border-b-current rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
      </div>
    )
  }

  // Default spinner
  return (
    <div 
      className={`animate-spin rounded-full border-2 border-transparent border-t-current ${sizeClasses[size]} ${colorClasses[color]} ${className}`} 
    />
  )
}

// Fireart-specific loading states
export function FireartLoadingSpinner({ size = 'md', className = '' }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <LoadingSpinner size={size} color="cobalt" variant="hex" />
      <div className="absolute inset-0 animate-ping">
        <LoadingSpinner size={size} color="cobalt" variant="pulse" />
      </div>
    </div>
  )
}

// Loading text component
interface LoadingTextProps {
  text?: string
  showSpinner?: boolean
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function LoadingText({ 
  text = 'Loading...', 
  showSpinner = true, 
  spinnerSize = 'sm',
  className = '' 
}: LoadingTextProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {showSpinner && (
        <LoadingSpinner size={spinnerSize} color="cobalt" className="mr-2" />
      )}
      <span className="text-text-tertiary animate-pulse">{text}</span>
    </div>
  )
}
