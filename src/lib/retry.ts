export interface WithRetryOpts {
  tries?: number
  baseMs?: number
  maxMs?: number
  /**
   * Inspect an error and decide whether to retry.
   * Return `false` to stop retrying.
   * Return `true` to retry using the default backoff.
   * Return a number to retry after that many milliseconds (wins over backoff).
   */
  shouldRetry?: (err: unknown, attempt: number) => boolean | number
}

/**
 * HTTP status codes that indicate the upstream is overloaded/throttled and
 * the request should be retried with backoff.
 *   429 Too Many Requests — rate limited
 *   503 Service Unavailable — temporary upstream failure
 *   529 Site is Overloaded — Anthropic-style overload signal
 */
export function isOverloadStatus(status: number): boolean {
  return status === 429 || status === 503 || status === 529
}

/**
 * Parse an HTTP `Retry-After` header value. Supports both delta-seconds
 * (`"120"`) and HTTP-date (`"Wed, 21 Oct 2015 07:28:00 GMT"`).
 * Returns milliseconds to wait, or undefined if the header is missing/invalid.
 */
export function parseRetryAfter(header: string | null | undefined): number | undefined {
  if (!header) return undefined
  const seconds = Number(header)
  if (Number.isFinite(seconds) && seconds >= 0) return Math.floor(seconds * 1000)
  const dateMs = Date.parse(header)
  if (!Number.isNaN(dateMs)) {
    const delta = dateMs - Date.now()
    return delta > 0 ? delta : 0
  }
  return undefined
}

/**
 * Extract overload hints from an error-like object. Recognises:
 *   - thrown Response objects (fetch-style)
 *   - errors with `status`/`statusCode` fields
 *   - errors with a `response` property (axios-style)
 *   - errors with a `headers` property carrying Retry-After
 */
export function overloadHint(err: unknown): { isOverload: boolean; retryAfterMs?: number } {
  if (!err || typeof err !== 'object') return { isOverload: false }

  const e = err as {
    status?: number
    statusCode?: number
    response?: { status?: number; headers?: Headers | Record<string, string | undefined> }
    headers?: Headers | Record<string, string | undefined>
  }

  const status = e.status ?? e.statusCode ?? e.response?.status
  if (typeof status !== 'number' || !isOverloadStatus(status)) return { isOverload: false }

  const headers = e.response?.headers ?? e.headers
  let retryAfter: string | null | undefined
  if (headers instanceof Headers) {
    retryAfter = headers.get('retry-after')
  } else if (headers && typeof headers === 'object') {
    const h = headers as Record<string, string | undefined>
    retryAfter = h['retry-after'] ?? h['Retry-After']
  }
  return { isOverload: true, retryAfterMs: parseRetryAfter(retryAfter) }
}

function computeBackoff(attempt: number, baseMs: number, maxMs: number): number {
  const exp = Math.min(maxMs, baseMs * Math.pow(2, attempt))
  const jitter = Math.random() * exp * 0.3
  return Math.min(maxMs, exp + jitter)
}

export async function withRetry<T>(fn: () => Promise<T>, opts: WithRetryOpts = {}): Promise<T> {
  const { tries = 3, baseMs = 250, maxMs = 30_000, shouldRetry } = opts
  let last: unknown

  for (let i = 0; i < tries; i++) {
    try {
      return await fn()
    } catch (e: unknown) {
      last = e
      if (i === tries - 1) break

      let waitMs: number | undefined

      if (shouldRetry) {
        const decision = shouldRetry(e, i + 1)
        if (decision === false) break
        if (typeof decision === 'number') waitMs = decision
      } else {
        const hint = overloadHint(e)
        if (hint.isOverload && hint.retryAfterMs !== undefined) {
          waitMs = Math.min(maxMs, hint.retryAfterMs)
        }
      }

      if (waitMs === undefined) waitMs = computeBackoff(i, baseMs, maxMs)
      await new Promise(r => setTimeout(r, Math.max(0, waitMs)))
    }
  }
  throw last
}

export function withTimeout<T>(p: Promise<T>, ms = 45_000): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))
  ])
}
