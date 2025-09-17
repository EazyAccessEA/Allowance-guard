/**
 * Email obfuscation utilities to protect email addresses from spam bots
 */

/**
 * Obfuscates an email address by encoding it with a simple ROT13-like cipher
 * This makes it harder for bots to harvest email addresses while keeping them readable
 */
export function obfuscateEmail(email: string): string {
  return email
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      // Only obfuscate letters, leave numbers and symbols unchanged
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + 13) % 26) + 65)
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + 13) % 26) + 97)
      }
      return char
    })
    .join('')
}

/**
 * Deobfuscates an email address (reverse of obfuscateEmail)
 */
export function deobfuscateEmail(obfuscatedEmail: string): string {
  return obfuscatedEmail
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      // Only deobfuscate letters, leave numbers and symbols unchanged
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 - 13 + 26) % 26) + 65)
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 - 13 + 26) % 26) + 97)
      }
      return char
    })
    .join('')
}

/**
 * Creates a mailto link with obfuscated email
 */
export function createObfuscatedMailtoLink(email: string, subject?: string): string {
  const obfuscatedEmail = obfuscateEmail(email)
  const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return `mailto:${obfuscatedEmail}${subjectParam}`
}

/**
 * React component for displaying obfuscated email addresses
 * Automatically deobfuscates on click/hover for better UX
 */
export function ObfuscatedEmail({ 
  email, 
  subject, 
  className = '',
  children 
}: { 
  email: string
  subject?: string
  className?: string
  children?: React.ReactNode
}) {
  const [isRevealed, setIsRevealed] = React.useState(false)
  const [isClient, setIsClient] = React.useState(false)
  
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const handleClick = () => {
    setIsRevealed(true)
    // Create mailto link with deobfuscated email
    const mailtoLink = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`
    window.location.href = mailtoLink
  }

  const handleMouseEnter = () => {
    setIsRevealed(true)
  }

  const handleMouseLeave = () => {
    setIsRevealed(false)
  }

  if (!isClient) {
    // Server-side rendering: show obfuscated version
    return (
      <span className={className}>
        {children || obfuscateEmail(email)}
      </span>
    )
  }

  return (
    <span 
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title="Click to send email"
    >
      {children || (isRevealed ? email : obfuscateEmail(email))}
    </span>
  )
}

/**
 * Advanced obfuscation using HTML entities and JavaScript
 * This method is more robust against simple text-based scrapers
 */
export function createAdvancedObfuscatedEmail(email: string): string {
  return email
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      return `&#${code};`
    })
    .join('')
}

/**
 * Creates a span with data attributes for JavaScript-based deobfuscation
 */
export function createDataObfuscatedEmail(email: string): {
  'data-email': string
  'data-obfuscated': string
} {
  return {
    'data-email': email,
    'data-obfuscated': obfuscateEmail(email)
  }
}

// Common email addresses used in the application
export const EMAIL_ADDRESSES = {
  SUPPORT: 'support@allowanceguard.com',
  SECURITY: 'security@allowanceguard.com',
  LEGAL: 'legal.support@allowanceguard.com',
  NO_REPLY: 'no_reply@allowanceguard.com'
} as const
