// Secure logging utility that prevents sensitive data exposure
interface LogLevel {
  ERROR: 'error'
  WARN: 'warn'
  INFO: 'info'
  DEBUG: 'debug'
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
}

// Sensitive patterns to redact
const SENSITIVE_PATTERNS = [
  /password/i,
  /secret/i,
  /key/i,
  /token/i,
  /auth/i,
  /credential/i,
  /private/i,
  /session/i,
  /cookie/i,
  /bearer/i,
  /api[_-]?key/i,
  /access[_-]?token/i,
  /refresh[_-]?token/i,
  /database[_-]?url/i,
  /connection[_-]?string/i,
  /smtp[_-]?pass/i,
  /wallet[_-]?private/i,
  /seed[_-]?phrase/i,
  /mnemonic/i
]

// Redact sensitive information from objects
function redactSensitive(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return redactSensitiveString(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(redactSensitive)
  }
  
  if (obj && typeof obj === 'object') {
    const redacted: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      if (SENSITIVE_PATTERNS.some(pattern => pattern.test(key))) {
        redacted[key] = '[REDACTED]'
      } else {
        redacted[key] = redactSensitive(value)
      }
    }
    return redacted
  }
  
  return obj
}

// Redact sensitive information from strings
function redactSensitiveString(str: string): string {
  return str.replace(/[a-zA-Z0-9]{20,}/g, (match) => {
    // Redact long strings that might be tokens/keys
    return match.length > 20 ? '[REDACTED]' : match
  })
}

// Secure logger class
class SecureLogger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  
  private formatMessage(level: string, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    
    if (data) {
      const redactedData = redactSensitive(data)
      return `${prefix} ${message} ${JSON.stringify(redactedData)}`
    }
    
    return `${prefix} ${message}`
  }
  
  error(message: string, data?: unknown): void {
    const formatted = this.formatMessage(LOG_LEVELS.ERROR, message, data)
    console.error(formatted)
  }
  
  warn(message: string, data?: unknown): void {
    const formatted = this.formatMessage(LOG_LEVELS.WARN, message, data)
    console.warn(formatted)
  }
  
  info(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      const formatted = this.formatMessage(LOG_LEVELS.INFO, message, data)
      console.log(formatted)
    }
  }
  
  debug(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      const formatted = this.formatMessage(LOG_LEVELS.DEBUG, message, data)
      console.log(formatted)
    }
  }
  
  // Security-specific logging
  security(event: string, details: unknown): void {
    const redactedDetails = redactSensitive(details)
    this.warn(`[SECURITY] ${event}`, redactedDetails)
  }
  
  // API request logging
  apiRequest(method: string, path: string, status: number, duration?: number): void {
    this.info('API Request', {
      method,
      path,
      status,
      duration: duration ? `${duration}ms` : undefined
    })
  }
  
  // Database operation logging
  dbOperation(operation: string, table: string, duration?: number): void {
    this.info('DB Operation', {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined
    })
  }
}

// Export singleton instance
export const secureLogger = new SecureLogger()

// Export types
export type { LogLevel }
export { LOG_LEVELS }
