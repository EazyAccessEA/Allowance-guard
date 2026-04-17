/**
 * PII redaction helpers for log lines.
 *
 * Used wherever an email address (or other PII identifier) would
 * otherwise land in apiLogger / console output. Hashes the local part
 * but keeps the domain and a stable identifier prefix so logs remain
 * grep-able and useful for triage without exposing the full address.
 *
 * Council:
 *   #19 Privacy / GDPR (lead): operational logs without retention
 *     policy shouldn't carry full PII; redaction preserves the
 *     usefulness of the log line while removing the legally-sensitive
 *     identifier.
 *   #24 Data protection (VETO): redaction is a baseline — we
 *     additionally minimise log retention separately.
 *   #34 Debug engineer: must remain triage-able. The redacted form
 *     keeps the domain visible (so you can tell "all the failures
 *     are at @gmail.com") and a stable hash prefix (so you can
 *     correlate two log lines for the same user without exposing
 *     the user).
 */

import { createHash } from 'crypto'

/**
 * Redact an email address for log output.
 *
 * `john.doe@example.com` → `j***[a3f9]@example.com`
 *
 * - First letter of local part preserved (1 char of disambiguation)
 * - Stable 4-hex-char hash of the full lowercased address (correlation
 *   without disclosure)
 * - Full domain preserved (segment by ESP, regulatory jurisdiction)
 */
export function redactEmail(email: string | null | undefined): string {
  if (!email) return '[no-email]'
  const lower = email.toLowerCase()
  const at = lower.indexOf('@')
  if (at <= 0) return '[invalid-email]'
  const local = lower.slice(0, at)
  const domain = lower.slice(at + 1)
  const hash = createHash('sha256').update(lower).digest('hex').slice(0, 4)
  const firstChar = local[0] ?? '*'
  return `${firstChar}***[${hash}]@${domain}`
}

/**
 * Redact a wallet address for log output. Keeps first 6 + last 4 hex
 * chars, the standard Web3 short-form. Wallet addresses are public
 * information so this is more about log noise reduction than PII;
 * use the full address when the log is for debugging a specific
 * on-chain action.
 */
export function shortAddress(address: string | null | undefined): string {
  if (!address) return '[no-address]'
  if (address.length < 12) return '[invalid-address]'
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}
