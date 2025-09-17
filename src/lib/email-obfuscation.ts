/**
 * Email obfuscation utilities - Safe and pretty implementation
 * Uses mixed obfuscation with click-to-reveal for optimal UX and security
 */

/**
 * Creates a safe, pretty obfuscated email display
 * Uses HTML entities for @ symbol and dots, making it bot-resistant but human-readable
 */
export function obfuscateEmail(email: string): string {
  return email
    .replace(/@/g, '&#64;')
    .replace(/\./g, '&#46;')
}

/**
 * Creates a mailto link with proper encoding
 */
export function createObfuscatedMailtoLink(email: string, subject?: string): string {
  const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return `mailto:${email}${subjectParam}`
}

// Common email addresses used in the application
export const EMAIL_ADDRESSES = {
  SUPPORT: 'support@allowanceguard.com',
  SECURITY: 'security@allowanceguard.com',
  LEGAL: 'legal.support@allowanceguard.com',
  NO_REPLY: 'no_reply@allowanceguard.com'
} as const
