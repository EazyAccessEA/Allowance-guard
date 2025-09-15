export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

function base(fields: Record<string, unknown>) { 
  return { t: new Date().toISOString(), ...fields } 
}

export function log(level: LogLevel, msg: string, extra: Record<string, unknown> = {}) {
  const obj = base({ lvl: level, msg, ...extra })
  const line = JSON.stringify(obj)
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
  service?: string
}

class Logger {
  private service: string
  private isDevelopment: boolean

  constructor(service: string = 'allowance-guard') {
    this.service = service
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      service: this.service
    }

    // In production, only log errors and warnings
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return
    }

    // Format the log entry
    const prefix = `[${entry.timestamp}] [${entry.service}] [${level.toUpperCase()}]`
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, data || '')
        break
      case 'info':
        console.info(prefix, message, data || '')
        break
      case 'warn':
        console.warn(prefix, message, data || '')
        break
      case 'error':
        console.error(prefix, message, data || '')
        break
    }
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data)
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data)
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data)
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data)
  }
}

// Create service-specific loggers
export const logger = new Logger('allowance-guard')
export const apiLogger = new Logger('api')
export const dbLogger = new Logger('database')
export const emailLogger = new Logger('email')
export const walletLogger = new Logger('wallet')
export const scanLogger = new Logger('scanner')

// Utility function for API responses
export function logApiCall(method: string, endpoint: string, status: number, duration?: number) {
  const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info'
  const message = `${method} ${endpoint} - ${status}${duration ? ` (${duration}ms)` : ''}`
  
  if (level === 'error') {
    apiLogger.error(message)
  } else if (level === 'warn') {
    apiLogger.warn(message)
  } else {
    apiLogger.info(message)
  }
}

// Utility function for database operations
export function logDbOperation(operation: string, table: string, success: boolean, duration?: number) {
  const message = `${operation} on ${table}${duration ? ` (${duration}ms)` : ''}`
  
  if (success) {
    dbLogger.info(message)
  } else {
    dbLogger.error(message)
  }
}

// Utility function for email operations
export function logEmailOperation(operation: string, recipient: string, success: boolean, error?: string) {
  const message = `${operation} to ${recipient}`
  
  if (success) {
    emailLogger.info(message)
  } else {
    emailLogger.error(message, { error })
  }
}

// Utility function for wallet operations
export function logWalletOperation(operation: string, address: string, success: boolean, error?: string) {
  const message = `${operation} for ${address.slice(0, 10)}...`
  
  if (success) {
    walletLogger.info(message)
  } else {
    walletLogger.error(message, { error })
  }
}

// Utility function for scan operations
export function logScanOperation(operation: string, address: string, chainId: number, success: boolean, error?: string) {
  const message = `${operation} for ${address.slice(0, 10)}... on chain ${chainId}`
  
  if (success) {
    scanLogger.info(message)
  } else {
    scanLogger.error(message, { error })
  }
}

// Enhanced logger with request ID support
export function withReq(req: Request) {
  const rid = (req.headers.get('x-request-id') || crypto.randomUUID()).toString()
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || null
  
  return {
    rid,
    info: (msg: string, extra: Record<string, unknown> = {}) => log('info', msg, { rid, ip, ...extra }),
    warn: (msg: string, extra: Record<string, unknown> = {}) => log('warn', msg, { rid, ip, ...extra }),
    error: (msg: string, extra: Record<string, unknown> = {}) => log('error', msg, { rid, ip, ...extra }),
  }
}
