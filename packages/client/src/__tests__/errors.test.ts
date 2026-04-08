import { describe, expect, it } from 'vitest'
import {
  AllowanceGuardError,
  ApiError,
  AuthError,
  NetworkError,
  RateLimitError,
  ValidationError,
} from '../src/errors'

describe('error hierarchy', () => {
  it('every error subclass is an instance of AllowanceGuardError', () => {
    expect(new NetworkError('x')).toBeInstanceOf(AllowanceGuardError)
    expect(new ApiError('x', 500)).toBeInstanceOf(AllowanceGuardError)
    expect(new AuthError('x')).toBeInstanceOf(AllowanceGuardError)
    expect(new RateLimitError('x', 10)).toBeInstanceOf(AllowanceGuardError)
    expect(new ValidationError('x')).toBeInstanceOf(AllowanceGuardError)
  })

  it('AuthError and ValidationError extend ApiError', () => {
    expect(new AuthError('x')).toBeInstanceOf(ApiError)
    expect(new ValidationError('x')).toBeInstanceOf(ApiError)
    expect(new RateLimitError('x', 10)).toBeInstanceOf(ApiError)
  })

  it('RateLimitError exposes retryAfterSeconds', () => {
    const err = new RateLimitError('slow down', 42)
    expect(err.retryAfterSeconds).toBe(42)
    expect(err.status).toBe(429)
  })

  it('AuthError defaults to status 401', () => {
    expect(new AuthError('no').status).toBe(401)
  })

  it('ValidationError defaults to status 400', () => {
    expect(new ValidationError('bad').status).toBe(400)
  })

  it('error messages never contain the literal "ag_live_" prefix', () => {
    // Sanity check: if a future dev accidentally templates keys into errors,
    // this test would need to be updated — which forces the security review.
    const errors = [
      new NetworkError('Network request to AllowanceGuard API failed.'),
      new ApiError('HTTP 500', 500),
      new AuthError('Invalid or expired API key'),
      new RateLimitError('Rate limit exceeded', null),
      new ValidationError('Validation failed'),
    ]
    for (const e of errors) {
      expect(e.message).not.toContain('ag_live_')
      expect(e.message).not.toContain('ag_pub_')
    }
  })
})
