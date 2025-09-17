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
 * Multiple obfuscation methods for different use cases
 */

/**
 * HTML entity obfuscation - converts characters to HTML entities
 */
export function obfuscateEmailHTML(email: string): string {
  return email
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      return `&#${code};`
    })
    .join('')
}

/**
 * JavaScript string concatenation obfuscation
 */
export function obfuscateEmailJS(email: string): string {
  const [local, domain] = email.split('@')
  return `'${local}' + String.fromCharCode(64) + '${domain}'`
}

/**
 * Base64 obfuscation
 */
export function obfuscateEmailBase64(email: string): string {
  return btoa(email)
}

/**
 * Hexadecimal obfuscation
 */
export function obfuscateEmailHex(email: string): string {
  return email
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      return `\\x${code.toString(16).padStart(2, '0')}`
    })
    .join('')
}

/**
 * Unicode escape obfuscation
 */
export function obfuscateEmailUnicode(email: string): string {
  return email
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      return `\\u${code.toString(16).padStart(4, '0')}`
    })
    .join('')
}

/**
 * Mixed obfuscation - combines multiple methods
 */
export function obfuscateEmailMixed(email: string): string {
  const [local, domain] = email.split('@')
  const methods = [
    () => `${local}@${domain}`, // Plain
    () => `${local}&#64;${domain}`, // HTML entities for @
    () => `${local}${String.fromCharCode(64)}${domain}`, // Char code for @
    () => `${local}%40${domain}`, // URL encoding for @
  ]
  
  // Use different method based on email hash for consistency
  const hash = email.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  return methods[hash % methods.length]()
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
