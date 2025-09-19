// Sketch-Inspired Accessibility Utilities
// Professional accessibility enhancements following Sketch's design principles

export const accessibilityTokens = {
  // Focus ring styles following Sketch's accessibility guidelines
  focus: {
    ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    ringDanger: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-danger focus-visible:ring-offset-2',
    ringSuccess: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-success focus-visible:ring-offset-2',
    ringWarning: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-warning focus-visible:ring-offset-2',
    ringInfo: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-info focus-visible:ring-offset-2',
  },
  
  // High contrast mode support
  highContrast: {
    text: 'text-text-primary dark:text-white',
    background: 'bg-white dark:bg-neutral-900',
    border: 'border-neutral-300 dark:border-neutral-600',
  },
  
  // Reduced motion support
  reducedMotion: {
    transition: 'transition-all duration-150 motion-reduce:transition-none',
    animation: 'animate-fade-in motion-reduce:animate-none',
  },
  
  // Touch target sizes (minimum 44px as per Sketch guidelines)
  touchTargets: {
    minimum: 'min-h-[44px] min-w-[44px]',
    small: 'h-9 w-9',      // 36px
    default: 'h-10 w-10',  // 40px
    large: 'h-11 w-11',    // 44px
    xlarge: 'h-12 w-12',   // 48px
  },
  
  // Screen reader only content
  srOnly: 'sr-only',
  notSrOnly: 'not-sr-only',
  
  // Skip links for keyboard navigation
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-base z-50',
}

// Utility function to combine accessibility classes
export function getAccessibilityClasses(options: {
  focus?: keyof typeof accessibilityTokens.focus
  highContrast?: boolean
  reducedMotion?: boolean
  touchTarget?: keyof typeof accessibilityTokens.touchTargets
  srOnly?: boolean
}) {
  const classes = []
  
  if (options.focus) {
    classes.push(accessibilityTokens.focus[options.focus])
  }
  
  if (options.highContrast) {
    classes.push(accessibilityTokens.highContrast.text)
    classes.push(accessibilityTokens.highContrast.background)
    classes.push(accessibilityTokens.highContrast.border)
  }
  
  if (options.reducedMotion) {
    classes.push(accessibilityTokens.reducedMotion.transition)
    classes.push(accessibilityTokens.reducedMotion.animation)
  }
  
  if (options.touchTarget) {
    classes.push(accessibilityTokens.touchTargets[options.touchTarget])
  }
  
  if (options.srOnly) {
    classes.push(accessibilityTokens.srOnly)
  }
  
  return classes.join(' ')
}

// ARIA attributes helper
export const ariaAttributes = {
  // Common ARIA roles
  roles: {
    button: 'role="button"',
    link: 'role="link"',
    menu: 'role="menu"',
    menuitem: 'role="menuitem"',
    dialog: 'role="dialog"',
    alert: 'role="alert"',
    status: 'role="status"',
    progressbar: 'role="progressbar"',
    tab: 'role="tab"',
    tabpanel: 'role="tabpanel"',
    tablist: 'role="tablist"',
  },
  
  // Common ARIA properties
  properties: {
    expanded: (expanded: boolean) => `aria-expanded="${expanded}"`,
    selected: (selected: boolean) => `aria-selected="${selected}"`,
    checked: (checked: boolean) => `aria-checked="${checked}"`,
    disabled: (disabled: boolean) => `aria-disabled="${disabled}"`,
    hidden: (hidden: boolean) => `aria-hidden="${hidden}"`,
    label: (label: string) => `aria-label="${label}"`,
    describedBy: (id: string) => `aria-describedby="${id}"`,
    controls: (id: string) => `aria-controls="${id}"`,
    owns: (id: string) => `aria-owns="${id}"`,
    live: (polite: boolean = true) => `aria-live="${polite ? 'polite' : 'assertive'}"`,
  },
  
  // Common ARIA states
  states: {
    busy: 'aria-busy="true"',
    invalid: 'aria-invalid="true"',
    required: 'aria-required="true"',
    readonly: 'aria-readonly="true"',
  },
}

// Color contrast utilities
export const contrastRatios = {
  // WCAG AA compliance ratios
  normal: {
    large: 3.0,    // 18pt+ or 14pt+ bold
    regular: 4.5,  // Regular text
  },
  enhanced: {
    large: 4.5,    // 18pt+ or 14pt+ bold
    regular: 7.0,  // Regular text
  },
}

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Common keyboard event handlers
  onEnter: (callback: () => void) => ({
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        callback()
      }
    }
  }),
  
  onEscape: (callback: () => void) => ({
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        callback()
      }
    }
  }),
  
  onArrowKeys: (callbacks: {
    up?: () => void
    down?: () => void
    left?: () => void
    right?: () => void
  }) => ({
    onKeyDown: (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          callbacks.up?.()
          break
        case 'ArrowDown':
          e.preventDefault()
          callbacks.down?.()
          break
        case 'ArrowLeft':
          e.preventDefault()
          callbacks.left?.()
          break
        case 'ArrowRight':
          e.preventDefault()
          callbacks.right?.()
          break
      }
    }
  }),
}

// Focus management utilities
export const focusManagement = {
  // Trap focus within an element
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }
    
    element.addEventListener('keydown', handleTabKey)
    firstElement?.focus()
    
    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  },
  
  // Restore focus to previous element
  restoreFocus: (element: HTMLElement) => {
    const previousElement = document.activeElement as HTMLElement
    element.focus()
    
    return () => {
      previousElement?.focus()
    }
  },
}

// Screen reader announcements
export const screenReaderAnnouncements = {
  // Announce text to screen readers
  announce: (text: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = text
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },
  
  // Announce page changes
  announcePageChange: (pageTitle: string) => {
    screenReaderAnnouncements.announce(`Navigated to ${pageTitle}`)
  },
  
  // Announce form validation errors
  announceValidationError: (errorMessage: string) => {
    screenReaderAnnouncements.announce(`Error: ${errorMessage}`, 'assertive')
  },
  
  // Announce success messages
  announceSuccess: (message: string) => {
    screenReaderAnnouncements.announce(`Success: ${message}`)
  },
}

const accessibilityUtils = {
  accessibilityTokens,
  getAccessibilityClasses,
  ariaAttributes,
  contrastRatios,
  keyboardNavigation,
  focusManagement,
  screenReaderAnnouncements,
}

export default accessibilityUtils
