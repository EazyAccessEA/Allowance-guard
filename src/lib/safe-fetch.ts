/**
 * SSRF-safe fetch wrapper.
 *
 * Used wherever the server fetches a customer-supplied URL (currently
 * only the webhook dispatcher). Layers two defences:
 *
 *   1. **Pre-resolve DNS, validate IP.** Before opening the connection,
 *      lookup the URL hostname and reject if any resolved address is
 *      private/loopback/link-local/metadata. This catches DNS-rebind
 *      where a public hostname resolves to a private IP — the common
 *      SSRF vector that pure URL syntax validation (validateWebhookUrl)
 *      misses.
 *
 *   2. **Disable redirects.** redirect: 'manual' on the underlying
 *      fetch — a 30x response is returned to the caller without being
 *      followed. Following redirects would re-introduce the SSRF
 *      vector via an attacker-controlled Location header pointing to
 *      a private address.
 *
 * Residual risk (acknowledged):
 *
 *   - **TOCTOU between resolve and connect.** Native fetch in Node
 *     re-resolves DNS at connect time. An attacker with DNS authority
 *     over the hostname AND very low TTL AND timing precision could
 *     rebind in the microsecond window between our resolve and Node's
 *     resolve. To close this completely, the dispatcher would need to
 *     use undici's Agent with a custom connect.lookup that runs the
 *     same validation. Tracked as a follow-up — adding undici as a
 *     direct dependency is the right move when we have real customer
 *     traffic to defend.
 *
 *   - **IPv6 multi-record edge case.** dns.lookup returns the first
 *     resolved address by default. If the hostname has both a public
 *     IPv6 and a private IPv4 (or vice versa), the validation depends
 *     on which family Node prefers. We use { all: true } to fetch all
 *     records and validate every one.
 *
 * Council:
 *   #4 Security (lead): closes the DNS-rebind class against literal-IP
 *     SSRF defended at the validateWebhookUrl layer. Residual TOCTOU
 *     risk small relative to current state (no DNS check at all).
 *   #34 Debug engineer: errors carry the original URL hostname AND
 *     the resolved address(es) so triage can distinguish "hostname
 *     doesn't resolve" from "hostname resolves to private IP".
 *   #15 Staff engineer: no new runtime dependency; built on Node's
 *     built-in dns.promises + native fetch.
 */

import { lookup } from 'node:dns/promises'
import { isPrivateIp } from './safe-webhook-url'

export interface SafeFetchError {
  ok: false
  reason: string
  /** Resolved IP addresses, if DNS resolution succeeded */
  resolved?: string[]
}

export interface SafeFetchResult {
  ok: true
  response: Response
}

/**
 * Fetch a URL after asserting its hostname doesn't resolve to a
 * private/loopback/metadata address.
 *
 * Returns a discriminated union so callers can branch on the failure
 * mode. The caller is responsible for reading the response body and
 * handling timeouts (the underlying fetch is invoked with the passed
 * RequestInit; pass `signal` from an AbortController for timeout).
 *
 * Always sets `redirect: 'manual'` to prevent redirect-based SSRF;
 * 30x responses are returned to the caller as Response objects with
 * status 30x — the caller decides whether that's a failure.
 */
export async function safeFetch(
  url: string,
  init: RequestInit = {},
): Promise<SafeFetchResult | SafeFetchError> {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return { ok: false, reason: 'Invalid URL format' }
  }

  if (!['https:', 'http:'].includes(parsed.protocol)) {
    return { ok: false, reason: 'URL must use HTTP or HTTPS' }
  }

  // If the hostname is itself a literal IP, validateWebhookUrl handles
  // that at submission. As a defence-in-depth re-check, validate here
  // too — caller might have skipped the syntactic check.
  const hostname = parsed.hostname
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.includes(':')) {
    if (isPrivateIp(hostname)) {
      return { ok: false, reason: 'URL points to a private or loopback address' }
    }
  } else {
    // DNS hostname — resolve and validate every returned address.
    let resolved: { address: string; family: number }[]
    try {
      resolved = await lookup(hostname, { all: true })
    } catch (err) {
      return {
        ok: false,
        reason: `DNS resolution failed: ${err instanceof Error ? err.message : 'unknown'}`,
      }
    }

    if (resolved.length === 0) {
      return { ok: false, reason: 'Hostname did not resolve to any address' }
    }

    const privateOnes = resolved.filter((r) => isPrivateIp(r.address))
    if (privateOnes.length > 0) {
      return {
        ok: false,
        reason: 'Hostname resolves to a private or loopback address',
        resolved: resolved.map((r) => r.address),
      }
    }
  }

  // Resolution clean. Issue the fetch with manual redirect handling.
  // Caller may pass their own signal/headers/body; we only enforce
  // redirect: 'manual'.
  const response = await fetch(parsed.toString(), {
    ...init,
    redirect: 'manual',
  })

  return { ok: true, response }
}
