/**
 * Typed error hierarchy for @allowance-guard/client.
 *
 * All errors extend `AllowanceGuardError`, so consumers can do a single
 * `instanceof AllowanceGuardError` check to distinguish library errors from
 * arbitrary thrown values. More specific subclasses exist for the cases
 * worth branching on (auth, rate limit, validation, network, generic API).
 *
 * Error messages must never contain the API key. See §10 of the architecture
 * plan (security considerations).
 */

export class AllowanceGuardError extends Error {
  public readonly name: string = 'AllowanceGuardError'
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    // Maintains proper stack trace in V8.
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class NetworkError extends AllowanceGuardError {
  public override readonly name: string = 'NetworkError'
  constructor(message: string, cause?: unknown) {
    super(message, cause)
  }
}

export class ApiError extends AllowanceGuardError {
  public override readonly name: string = 'ApiError'
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message)
  }
}

export class AuthError extends ApiError {
  public override readonly name: string = 'AuthError'
  constructor(message: string, status = 401, details?: unknown) {
    super(message, status, 'AUTH_ERROR', details)
  }
}

export class RateLimitError extends ApiError {
  public override readonly name: string = 'RateLimitError'
  constructor(
    message: string,
    public readonly retryAfterSeconds: number | null,
    details?: unknown,
  ) {
    super(message, 429, 'RATE_LIMITED', details)
  }
}

export class ValidationError extends ApiError {
  public override readonly name: string = 'ValidationError'
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details)
  }
}
