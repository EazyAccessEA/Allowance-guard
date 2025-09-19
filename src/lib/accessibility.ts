/**
 * Accessibility Utilities
 * Comprehensive accessibility helpers following WCAG 2.1 AA guidelines
 */

// Accessibility class generators
export const getAccessibilityClasses = (options: {
  focus?: 'ring' | 'outline' | 'none'
  reducedMotion?: boolean
  highContrast?: boolean
  touchTarget?: boolean
}) => {
  const classes: string[] = []

  // Focus styles
  if (options.focus === 'ring') {
    classes.push('focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2')
  } else if (options.focus === 'outline') {
    classes.push('focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2')
  }

  // Touch target optimization
  if (options.touchTarget) {
    classes.push('touch-target')
  }

  // Reduced motion support
  if (options.reducedMotion) {
    classes.push('motion-reduce:transition-none motion-reduce:transform-none')
  }

  // High contrast support
  if (options.highContrast) {
    classes.push('contrast-more:border-2 contrast-more:border-current')
  }

  return classes.join(' ')
}

// Keyboard navigation helpers
export const keyboardNavigation = {
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
    onUp?: () => void
    onDown?: () => void
    onLeft?: () => void
    onRight?: () => void
  }) => ({
    onKeyDown: (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          callbacks.onUp?.()
          break
        case 'ArrowDown':
          e.preventDefault()
          callbacks.onDown?.()
          break
        case 'ArrowLeft':
          e.preventDefault()
          callbacks.onLeft?.()
          break
        case 'ArrowRight':
          e.preventDefault()
          callbacks.onRight?.()
          break
      }
    }
  })
}

// ARIA helpers
export const ariaHelpers = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix: string = 'aria') => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
  
  // Screen reader announcements
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },
  
  // Focus management
  focus: {
    trap: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
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
      
      container.addEventListener('keydown', handleTabKey)
      firstElement?.focus()
      
      return () => {
        container.removeEventListener('keydown', handleTabKey)
      }
    },
    
    restore: (element: HTMLElement | null) => {
      if (element) {
        element.focus()
      }
    }
  }
}

// Color contrast utilities
export const colorContrast = {
  // Calculate relative luminance
  getLuminance: (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  },
  
  // Calculate contrast ratio
  getContrastRatio: (color1: [number, number, number], color2: [number, number, number]) => {
    const lum1 = colorContrast.getLuminance(...color1)
    const lum2 = colorContrast.getLuminance(...color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)
  },
  
  // Check if contrast meets WCAG AA standards
  meetsWCAGAA: (color1: [number, number, number], color2: [number, number, number]) => {
    const ratio = colorContrast.getContrastRatio(color1, color2)
    return ratio >= 4.5 // WCAG AA standard for normal text
  }
}

// Form accessibility helpers
export const formAccessibility = {
  // Generate form field IDs and labels
  generateFieldId: (name: string) => `field-${name}`,
  generateErrorId: (name: string) => `error-${name}`,
  generateHelpId: (name: string) => `help-${name}`,
  
  // Validate form accessibility
  validateForm: (form: HTMLFormElement) => {
    const issues: string[] = []
    
    // Check for labels
    const inputs = form.querySelectorAll('input, select, textarea')
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id')
      const label = form.querySelector(`label[for="${id}"]`)
      
      if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        issues.push(`Input ${index + 1} is missing a label`)
      }
    })
    
    // Check for error associations
    const errorElements = form.querySelectorAll('[role="alert"]')
    errorElements.forEach((error, index) => {
      const id = error.getAttribute('id')
      if (!id) {
        issues.push(`Error message ${index + 1} is missing an ID`)
      }
    })
    
    return issues
  }
}

// Table accessibility helpers
export const tableAccessibility = {
  // Generate table caption
  generateCaption: (table: HTMLTableElement, caption: string) => {
    const captionElement = document.createElement('caption')
    captionElement.textContent = caption
    table.insertBefore(captionElement, table.firstChild)
  },
  
  // Add column headers
  addColumnHeaders: (table: HTMLTableElement, headers: string[]) => {
    const thead = table.querySelector('thead') || table.createTHead()
    const row = thead.insertRow()
    
    headers.forEach(header => {
      const th = document.createElement('th')
      th.textContent = header
      th.setAttribute('scope', 'col')
      row.appendChild(th)
    })
  },
  
  // Add row headers
  addRowHeaders: (table: HTMLTableElement, rowIndex: number, header: string) => {
    const tbody = table.querySelector('tbody')
    if (tbody) {
      const row = tbody.rows[rowIndex]
      if (row) {
        const firstCell = row.cells[0]
        if (firstCell) {
          firstCell.setAttribute('scope', 'row')
          firstCell.textContent = header
        }
      }
    }
  }
}

// Animation accessibility helpers
export const animationAccessibility = {
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
  
  // Apply reduced motion styles
  applyReducedMotion: (element: HTMLElement) => {
    if (animationAccessibility.prefersReducedMotion()) {
      element.style.animation = 'none'
      element.style.transition = 'none'
    }
  },
  
  // Respect user's motion preferences
  respectMotionPreference: (callback: () => void) => {
    if (!animationAccessibility.prefersReducedMotion()) {
      callback()
    }
  }
}

// Export all utilities
export default {
  getAccessibilityClasses,
  keyboardNavigation,
  ariaHelpers,
  colorContrast,
  formAccessibility,
  tableAccessibility,
  animationAccessibility
}