import {
  isOverloadStatus,
  overloadHint,
  parseRetryAfter,
  withRetry,
} from '@/lib/retry'

describe('isOverloadStatus', () => {
  it('returns true for 429/503/529', () => {
    expect(isOverloadStatus(429)).toBe(true)
    expect(isOverloadStatus(503)).toBe(true)
    expect(isOverloadStatus(529)).toBe(true)
  })

  it('returns false for other statuses', () => {
    expect(isOverloadStatus(200)).toBe(false)
    expect(isOverloadStatus(400)).toBe(false)
    expect(isOverloadStatus(500)).toBe(false)
    expect(isOverloadStatus(502)).toBe(false)
  })
})

describe('parseRetryAfter', () => {
  it('parses delta-seconds into milliseconds', () => {
    expect(parseRetryAfter('30')).toBe(30_000)
    expect(parseRetryAfter('0')).toBe(0)
  })

  it('parses HTTP-date headers', () => {
    const future = new Date(Date.now() + 5_000).toUTCString()
    const ms = parseRetryAfter(future)
    expect(ms).toBeGreaterThan(0)
    expect(ms!).toBeLessThanOrEqual(5_000)
  })

  it('returns 0 for past HTTP-dates', () => {
    const past = new Date(Date.now() - 5_000).toUTCString()
    expect(parseRetryAfter(past)).toBe(0)
  })

  it('returns undefined for missing/invalid headers', () => {
    expect(parseRetryAfter(null)).toBeUndefined()
    expect(parseRetryAfter(undefined)).toBeUndefined()
    expect(parseRetryAfter('')).toBeUndefined()
    expect(parseRetryAfter('not-a-date')).toBeUndefined()
  })
})

describe('overloadHint', () => {
  it('detects overload from a top-level status field', () => {
    const hint = overloadHint({ status: 529 })
    expect(hint.isOverload).toBe(true)
  })

  it('detects overload from a nested response.status (axios-style)', () => {
    const hint = overloadHint({ response: { status: 503, headers: { 'retry-after': '5' } } })
    expect(hint.isOverload).toBe(true)
    expect(hint.retryAfterMs).toBe(5_000)
  })

  it('reads Retry-After from a Headers instance', () => {
    const hint = overloadHint({ status: 429, headers: new Headers({ 'retry-after': '2' }) })
    expect(hint).toEqual({ isOverload: true, retryAfterMs: 2_000 })
  })

  it('returns isOverload=false for non-overload errors', () => {
    expect(overloadHint({ status: 500 })).toEqual({ isOverload: false })
    expect(overloadHint(new Error('boom'))).toEqual({ isOverload: false })
    expect(overloadHint(null)).toEqual({ isOverload: false })
  })
})

describe('withRetry', () => {
  it('returns the value on first success', async () => {
    const fn = jest.fn().mockResolvedValue('ok')
    await expect(withRetry(fn, { tries: 3, baseMs: 1 })).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries and eventually succeeds', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('1'))
      .mockRejectedValueOnce(new Error('2'))
      .mockResolvedValue('ok')

    await expect(withRetry(fn, { tries: 3, baseMs: 1, maxMs: 5 })).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('throws the last error after exhausting tries', async () => {
    const err = new Error('nope')
    const fn = jest.fn().mockRejectedValue(err)

    await expect(withRetry(fn, { tries: 2, baseMs: 1, maxMs: 5 })).rejects.toBe(err)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('stops retrying when shouldRetry returns false', async () => {
    const err = { status: 400 }
    const fn = jest.fn().mockRejectedValue(err)
    const shouldRetry = jest.fn().mockReturnValue(false)

    await expect(withRetry(fn, { tries: 5, baseMs: 1, shouldRetry })).rejects.toBe(err)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(shouldRetry).toHaveBeenCalledTimes(1)
  })

  it('honours a numeric shouldRetry return as the wait time', async () => {
    const fn = jest.fn().mockRejectedValueOnce(new Error('boom')).mockResolvedValue('ok')
    const shouldRetry = jest.fn().mockReturnValue(0) // wait 0ms, then retry

    await expect(withRetry(fn, { tries: 2, baseMs: 1, shouldRetry })).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(2)
    expect(shouldRetry).toHaveBeenCalledWith(expect.any(Error), 1)
  })

  it('waits at least the Retry-After duration on overload errors', async () => {
    const overloadErr = { status: 529, headers: { 'retry-after': '1' } } // 1000ms
    const fn = jest.fn().mockRejectedValueOnce(overloadErr).mockResolvedValue('ok')
    const spy = jest.spyOn(global, 'setTimeout')

    const result = await withRetry(fn, { tries: 2, baseMs: 10, maxMs: 10_000 })

    expect(result).toBe('ok')
    const waits = spy.mock.calls.map(([, ms]) => ms as number)
    expect(waits.some((ms) => ms >= 1000)).toBe(true)
    spy.mockRestore()
  })

  it('caps Retry-After waits at maxMs', async () => {
    const overloadErr = { status: 429, headers: { 'retry-after': '600' } } // 10 minutes
    const fn = jest.fn().mockRejectedValueOnce(overloadErr).mockResolvedValue('ok')
    const spy = jest.spyOn(global, 'setTimeout')

    await withRetry(fn, { tries: 2, baseMs: 1, maxMs: 50 })

    const waits = spy.mock.calls.map(([, ms]) => ms as number)
    expect(Math.max(...waits)).toBeLessThanOrEqual(50)
    spy.mockRestore()
  })
})
