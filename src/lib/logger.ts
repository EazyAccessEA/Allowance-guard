// src/lib/logger.ts — Structured JSON logging with request ID tracing and sensitive data redaction
import { redactSensitive } from './secure-logger'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const MIN_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug'

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[MIN_LEVEL]
}

interface StructuredLogEntry {
  timestamp: string
  level: LogLevel
  message: string
  service?: string
  requestId?: string
  userId?: string
  path?: string
  duration_ms?: number
  metadata?: Record<string, unknown>
}

/**
 * Core structured log function. Outputs JSON to stdout/stderr.
 */
export function log(level: LogLevel, message: string, extra: Record<string, unknown> = {}) {
  if (!shouldLog(level)) return

  const entry: StructuredLogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...extra,
  }

  // Redact sensitive data
  const safe = redactSensitive(entry) as StructuredLogEntry
  const line = JSON.stringify(safe)

  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

/**
 * Service-specific logger with structured JSON output.
 */
class Logger {
  private service: string

  constructor(service: string = 'allowance-guard') {
    this.service = service
  }

  debug(message: string, data?: Record<string, unknown>): void {
    log('debug', message, { service: this.service, ...data })
  }

  info(message: string, data?: Record<string, unknown>): void {
    log('info', message, { service: this.service, ...data })
  }

  warn(message: string, data?: Record<string, unknown>): void {
    log('warn', message, { service: this.service, ...data })
  }

  error(message: string, data?: Record<string, unknown>): void {
    log('error', message, { service: this.service, ...data })
  }
}

// Service-specific loggers
export const logger = new Logger('allowance-guard')
export const apiLogger = new Logger('api')
export const dbLogger = new Logger('database')
export const emailLogger = new Logger('email')
export const walletLogger = new Logger('wallet')
export const scanLogger = new Logger('scanner')

/**
 * Create a request-scoped logger with a unique request ID.
 * Attaches X-Request-Id to all log entries for tracing.
 */
export function withReq(req: Request) {
  const rid = (req.headers.get('x-request-id') || crypto.randomUUID()).toString()
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || undefined
  const path = new URL(req.url).pathname
  const method = req.method

  return {
    rid,
    info: (msg: string, extra: Record<string, unknown> = {}) =>
      log('info', msg, { requestId: rid, ip, path, method, ...extra }),
    warn: (msg: string, extra: Record<string, unknown> = {}) =>
      log('warn', msg, { requestId: rid, ip, path, method, ...extra }),
    error: (msg: string, extra: Record<string, unknown> = {}) =>
      log('error', msg, { requestId: rid, ip, path, method, ...extra }),
    debug: (msg: string, extra: Record<string, unknown> = {}) =>
      log('debug', msg, { requestId: rid, ip, path, method, ...extra }),
    /**
     * Log the completion of an API request with duration.
     */
    done: (status: number, extra: Record<string, unknown> = {}) => {
      const level: LogLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
      log(level, `${method} ${path} ${status}`, { requestId: rid, ip, path, method, status, ...extra })
    },
  }
}

// Utility functions for specific operation types

export function logApiCall(method: string, endpoint: string, status: number, duration?: number) {
  const level: LogLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
  log(level, `${method} ${endpoint} ${status}`, {
    service: 'api', method, endpoint, status, duration_ms: duration,
  })
}

export function logDbOperation(operation: string, table: string, success: boolean, duration?: number) {
  log(success ? 'info' : 'error', `db:${operation}:${table}`, {
    service: 'database', operation, table, success, duration_ms: duration,
  })
}

export function logEmailOperation(operation: string, recipient: string, success: boolean, error?: string) {
  log(success ? 'info' : 'error', `email:${operation}`, {
    service: 'email', operation, recipient, success, ...(error ? { error } : {}),
  })
}

export function logWalletOperation(operation: string, address: string, success: boolean, error?: string) {
  log(success ? 'info' : 'error', `wallet:${operation}`, {
    service: 'wallet', operation, address: address.slice(0, 10) + '...', success, ...(error ? { error } : {}),
  })
}

export function logScanOperation(operation: string, address: string, chainId: number, success: boolean, error?: string) {
  log(success ? 'info' : 'error', `scan:${operation}`, {
    service: 'scanner', operation, address: address.slice(0, 10) + '...', chainId, success, ...(error ? { error } : {}),
  })
}

export function logSubscriptionEvent(event: string, userId: string, plan?: string, extra?: Record<string, unknown>) {
  log('info', `subscription:${event}`, {
    service: 'billing', userId, plan, ...extra,
  })
}

export function logRateLimitHit(ip: string, endpoint: string) {
  log('warn', 'rate_limit_exceeded', {
    service: 'security', ip, endpoint,
  })
}

export function logAuthFailure(reason: string, ip?: string, extra?: Record<string, unknown>) {
  log('warn', `auth_failure:${reason}`, {
    service: 'security', ip, ...extra,
  })
}
