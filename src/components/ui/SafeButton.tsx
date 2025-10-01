// Safe Button Component with Feature Flag Protection
// This component can be safely deployed without breaking existing functionality

import { Button, ButtonProps } from './Button'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { cn } from '@/lib/utils'

interface SafeButtonProps extends ButtonProps {
  // New UX features (controlled by feature flags)
  enableMicroInteractions?: boolean
  enableHapticFeedback?: boolean
  enableAdvancedAnimations?: boolean
}

export function SafeButton({ 
  enableMicroInteractions = false,
  enableHapticFeedback = false,
  enableAdvancedAnimations = false,
  className,
  children,
  ...props 
}: SafeButtonProps) {
  // Check feature flags
  const microInteractionsEnabled = isFeatureEnabled('enhancedMicroInteractions') && enableMicroInteractions
  const hapticEnabled = isFeatureEnabled('enhancedMicroInteractions') && enableHapticFeedback
  const animationsEnabled = isFeatureEnabled('smoothPageTransitions') && enableAdvancedAnimations
  
  // Safe className composition
  const safeClassName = cn(
    className,
    // Only apply new styles if feature is enabled
    microInteractionsEnabled && 'active:scale-95 transform transition-transform duration-150',
    animationsEnabled && 'animate-in fade-in-0 slide-in-from-bottom-2',
    // Fallback to original behavior if features disabled
    !microInteractionsEnabled && 'transition-colors duration-200'
  )
  
  // Safe click handler with haptic feedback
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Original click handler always works
    if (props.onClick) {
      props.onClick(e)
    }
    
    // Add haptic feedback only if enabled
    if (hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50) // Short vibration
    }
  }
  
  return (
    <Button
      {...props}
      className={safeClassName}
      onClick={handleClick}
    >
      {children}
    </Button>
  )
}

// Export both safe and original button for gradual migration
export { Button as OriginalButton } from './Button'
export { SafeButton as Button } // Default export is safe version
