/**
 * Turnstile — Cloudflare bot verification, server side.
 *
 * Verifies the token the client receives from the Turnstile widget by
 * calling Cloudflare's siteverify endpoint. Returns true when verified,
 * false on any failure.
 *
 * Dev fallback: when TURNSTILE_SECRET_KEY is not set, verification is
 * skipped and returns true. This keeps local development unblocked while
 * production deployments get real bot protection.
 *
 * Council:
 *  #4 Security: fail closed on any non-200 or non-success response
 *  #24 Data protection: token + IP are the only data sent to Cloudflare
 *  Thane: 5-second timeout so a Cloudflare outage cannot hang the request
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TIMEOUT_MS = 5000

interface SiteverifyResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
  action?: string
  cdata?: string
}

/** True when Turnstile is configured for the current deployment. */
export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY)
}

/**
 * Verify a Turnstile token against Cloudflare's siteverify endpoint.
 *
 * @param token   The token returned by the client-side widget
 * @param ip      The visitor's IP (x-forwarded-for). Optional but recommended.
 * @returns       true on success, false on any failure
 */
export async function verifyTurnstileToken(
  token: string | undefined | null,
  ip?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  // Dev fallback: no secret configured, skip verification
  if (!secret) {
    return true
  }

  if (!token || typeof token !== 'string') {
    return false
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip && ip !== 'unknown') body.append('remoteip', ip)

    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controller.signal,
    })

    if (!res.ok) return false

    const data = (await res.json()) as SiteverifyResponse
    return data.success === true
  } catch (err) {
    console.error('[turnstile] siteverify failed', err)
    return false
  } finally {
    clearTimeout(timeout)
  }
}
