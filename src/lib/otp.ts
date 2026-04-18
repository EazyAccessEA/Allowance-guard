/**
 * OTP (one-time code) email auth. Issued by /api/auth/otp-request,
 * verified by /api/auth/otp-verify. Powers the email-first upgrade
 * funnel; chosen over magic-link for mobile reliability and because
 * email previews / spam scanners commonly consume link tokens before
 * the user clicks.
 *
 * Security invariants:
 *  - The plaintext code is never persisted. Only HMAC-SHA256(code,
 *    OTP_SECRET) is stored. A DB leak does not reveal codes.
 *  - 10-minute expiry enforced in SQL and re-checked in verifyOtp.
 *  - Max 5 wrong attempts per code; attempts counter prevents a leaked
 *    hash from being brute-forced against 10^6 combinations.
 *  - Single-use: consumed_at is set atomically inside verifyOtp so a
 *    replay race cannot issue two sessions.
 *  - Issuing a new code invalidates prior outstanding codes for the
 *    same email — otherwise a user with a stale + a fresh code could
 *    typo into an always-valid older one.
 *
 * Rate limiting lives at the API layer, not here.
 */
import { createHmac, randomInt, timingSafeEqual } from 'crypto'
import { pool } from '@/lib/db'

const CODE_TTL_MIN = 10
const MAX_ATTEMPTS = 5

function getSecret(): string {
  const secret = process.env.OTP_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('OTP_SECRET is not configured (min 32 chars)')
  }
  return secret
}

export function generateCode(): string {
  // randomInt is CSPRNG-backed. 6 digits = 10^6 space; combined with
  // the 5-attempt-per-code lock and per-email rate limit, targeted
  // brute force in the TTL window is infeasible.
  const n = randomInt(0, 1_000_000)
  return n.toString().padStart(6, '0')
}

function hashCode(code: string): string {
  return createHmac('sha256', getSecret()).update(code).digest('hex')
}

function safeEquals(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

/**
 * Persist a freshly-generated code for `email` and return it for the
 * caller to send by mail. Any prior unconsumed codes for this email
 * are invalidated first so only the newest is ever accepted.
 */
export async function issueOtp(email: string): Promise<string> {
  const emailLower = email.toLowerCase()
  const code = generateCode()
  const codeHash = hashCode(code)

  // Invalidate prior outstanding codes — prevents a stale code from
  // racing ahead of the one the user is about to receive.
  await pool.query(
    `UPDATE otp_codes
        SET consumed_at = NOW()
      WHERE LOWER(email) = $1
        AND consumed_at IS NULL`,
    [emailLower],
  )

  await pool.query(
    `INSERT INTO otp_codes (email, code_hash, expires_at)
     VALUES ($1, $2, NOW() + ($3 || ' minutes')::interval)`,
    [emailLower, codeHash, String(CODE_TTL_MIN)],
  )

  return code
}

export type OtpVerifyResult =
  | { ok: true; email: string }
  | { ok: false; error: 'expired' | 'invalid' | 'locked' | 'not_found' }

/**
 * Verify a code for an email. Returns a discriminated result so the
 * caller can surface a single generic error message without branching
 * on internals (no oracle for attackers).
 */
export async function verifyOtp(email: string, code: string): Promise<OtpVerifyResult> {
  const emailLower = email.toLowerCase()
  const codeHash = hashCode(code)

  const { rows } = await pool.query(
    `SELECT id, code_hash, attempts, expires_at
       FROM otp_codes
      WHERE LOWER(email) = $1
        AND consumed_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1`,
    [emailLower],
  )
  const raw = rows[0]
  if (!raw) return { ok: false, error: 'not_found' }

  const row = raw as {
    id: number
    code_hash: string
    attempts: number
    expires_at: string | Date
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, error: 'expired' }
  }

  if (row.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: 'locked' }
  }

  if (!safeEquals(row.code_hash, codeHash)) {
    await pool.query(
      `UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1`,
      [row.id],
    )
    return { ok: false, error: 'invalid' }
  }

  // Atomic consume guards a replay race between two simultaneous verifies.
  const consumed = await pool.query(
    `UPDATE otp_codes
        SET consumed_at = NOW()
      WHERE id = $1
        AND consumed_at IS NULL
      RETURNING id`,
    [row.id],
  )
  if (consumed.rowCount === 0) {
    return { ok: false, error: 'invalid' }
  }

  return { ok: true, email: emailLower }
}
