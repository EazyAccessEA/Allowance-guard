/**
 * SSRF-safe webhook URL validation.
 *
 * Customer-registered webhook URLs (Sentinel feature) are subsequently
 * fetched server-side by webhook-dispatcher. Without validation a
 * customer could point a webhook at internal infrastructure
 * (loopback, RFC1918, link-local, AWS instance metadata) and have
 * AllowanceGuard's backend exfiltrate or probe it.
 *
 * This validator covers the syntactic case — it rejects URLs whose
 * hostname literally references a private/loopback/metadata address.
 * It does NOT cover DNS rebinding (where a public hostname resolves
 * to a private IP at fetch time) — that requires a safe-fetch wrapper
 * that re-resolves at fetch time and asserts the IP. Tracked for a
 * follow-up.
 *
 * Council:
 *   #4 Security (lead): closes the literal-IP and *.localhost
 *     attack class; a follow-up safe-fetch wrapper closes DNS rebind.
 *   #15 Staff engineer: minimal helper, no new dependency, exported
 *     so any future fetch-from-user-URL surface can re-use it.
 */

const PRIVATE_IPV4_RANGES: Array<[number, number, number, number]> = [
  // 10.0.0.0/8
  [10, 0, 0, 0],
  // 172.16.0.0/12 — handled in code as a range, not a literal
  // 192.168.0.0/16
  [192, 168, 0, 0],
  // 127.0.0.0/8 (loopback)
  [127, 0, 0, 0],
  // 169.254.0.0/16 (link-local incl. AWS metadata 169.254.169.254)
  [169, 254, 0, 0],
  // 0.0.0.0/8
  [0, 0, 0, 0],
  // 100.64.0.0/10 (carrier-grade NAT)
  // 224.0.0.0/4 (multicast)
  // — covered explicitly below
]

export function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return false // not a valid IPv4; let URL parsing reject elsewhere
  }
  const [a, b] = parts as [number, number, number, number]
  // 10.0.0.0/8
  if (a === 10) return true
  // 172.16.0.0 — 172.31.255.255
  if (a === 172 && b >= 16 && b <= 31) return true
  // 192.168.0.0/16
  if (a === 192 && b === 168) return true
  // 127.0.0.0/8 loopback
  if (a === 127) return true
  // 169.254.0.0/16 link-local + AWS/GCP/Azure metadata
  if (a === 169 && b === 254) return true
  // 0.0.0.0/8
  if (a === 0) return true
  // 100.64.0.0/10 CGN
  if (a === 100 && b >= 64 && b <= 127) return true
  // 224.0.0.0/4 multicast
  if (a >= 224 && a <= 239) return true
  // 240.0.0.0/4 reserved
  if (a >= 240) return true
  // Mark 4-octet ranges used in PRIVATE_IPV4_RANGES so the import is used
  void PRIVATE_IPV4_RANGES
  return false
}

/**
 * Combined IPv4/IPv6 check. Used by safe-fetch.ts after DNS resolution
 * to assert the resolved IP isn't private before opening the connection.
 */
export function isPrivateIp(ip: string): boolean {
  if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return isPrivateIpv4(ip)
  if (ip.includes(':')) return isPrivateIpv6(ip)
  return false // not a recognisable IP literal
}

export function isPrivateIpv6(host: string): boolean {
  // Strip brackets, normalise.
  const bare = host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1).toLowerCase() : host.toLowerCase()
  // Loopback
  if (bare === '::1' || bare === '0:0:0:0:0:0:0:1') return true
  // Unspecified
  if (bare === '::' || bare === '0:0:0:0:0:0:0:0') return true
  // Link-local fe80::/10
  if (bare.startsWith('fe8') || bare.startsWith('fe9') || bare.startsWith('fea') || bare.startsWith('feb')) return true
  // Unique local fc00::/7
  if (bare.startsWith('fc') || bare.startsWith('fd')) return true
  // IPv4-mapped IPv6 (::ffff:a.b.c.d) — extract the v4 portion
  const mapped = bare.match(/^::ffff:([0-9.]+)$/)
  if (mapped && isPrivateIpv4(mapped[1]!)) return true
  return false
}

const FORBIDDEN_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata.google.internal',
  'metadata',
])

export interface UrlValidationResult {
  ok: boolean
  reason?: string
}

/**
 * Validate a customer-supplied webhook URL.
 *
 * Returns ok if the URL is syntactically valid AND the hostname does
 * not literally reference a loopback / private / link-local / metadata
 * address. Does not perform DNS resolution — the dispatcher should
 * additionally use a safe-fetch wrapper to re-validate the resolved
 * IP at fetch time (DNS-rebind protection).
 *
 * @param raw — the URL string from the request
 * @param options.requireHttps — if true, http:// URLs are rejected
 */
export function validateWebhookUrl(
  raw: string,
  options: { requireHttps?: boolean } = {},
): UrlValidationResult {
  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return { ok: false, reason: 'Invalid URL format' }
  }

  if (options.requireHttps) {
    if (parsed.protocol !== 'https:') {
      return { ok: false, reason: 'URL must use HTTPS' }
    }
  } else if (!['https:', 'http:'].includes(parsed.protocol)) {
    return { ok: false, reason: 'URL must use HTTP or HTTPS' }
  }

  const hostname = parsed.hostname.toLowerCase()

  if (FORBIDDEN_HOSTNAMES.has(hostname)) {
    return { ok: false, reason: 'URL hostname is not allowed' }
  }

  // Some clients accept *.localhost as loopback (RFC 6761).
  if (hostname.endsWith('.localhost')) {
    return { ok: false, reason: 'URL hostname is not allowed' }
  }

  // IPv4 literal check
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    if (isPrivateIpv4(hostname)) {
      return { ok: false, reason: 'URL points to a private or loopback address' }
    }
    return { ok: true }
  }

  // IPv6 literal check (URL.hostname strips brackets but keeps colons)
  if (hostname.includes(':')) {
    if (isPrivateIpv6(hostname)) {
      return { ok: false, reason: 'URL points to a private or loopback address' }
    }
    return { ok: true }
  }

  // Hostname (DNS name). The dispatcher must additionally re-validate
  // the resolved IP at fetch time to prevent DNS rebinding.
  return { ok: true }
}
