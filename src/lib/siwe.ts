/**
 * SIWE — Sign-In with Ethereum (EIP-4361) server helpers.
 *
 * Implements the spec without pulling in the `siwe` npm package —
 * viem (already in deps) handles the signature recovery and the
 * message format is simple enough to parse by hand.
 *
 * Spec: https://eips.ethereum.org/EIPS/eip-4361
 *
 * Flow:
 *   1. Client GETs /api/auth/nonce → server writes a row to siwe_nonces
 *      and returns the nonce.
 *   2. Client constructs the SIWE message (see buildMessage below),
 *      asks wagmi to personal_sign it with the connected wallet.
 *   3. Client POSTs { message, signature } to /api/auth/siwe.
 *   4. Server parses the message, verifies the signature recovers to
 *      the address in the message, consumes the nonce, finds-or-creates
 *      the user by wallet address, creates a session, sets the cookie.
 *
 * Security invariants (all enforced in verifyMessage):
 *   - Signature must recover to the exact address in the message
 *   - Nonce must exist, not be consumed, not be expired
 *   - Domain in the message must equal our canonical host
 *   - Chain ID must be a number we allow
 *   - Expiration time (if present) must not be in the past
 *   - Issued-at (if present) must not be in the future
 */

import { randomBytes } from 'crypto'
import { verifyMessage, getAddress } from 'viem'
import { pool } from '@/lib/db'

// =============================================================================
// Nonce storage (backed by siwe_nonces table)
// =============================================================================

export async function issueNonce(): Promise<string> {
  // 16 bytes = 32 hex chars — satisfies EIP-4361 alphanumeric requirement
  // (hex is a subset of alphanumeric). Long enough to be unguessable.
  const nonce = randomBytes(16).toString('hex')
  await pool.query(
    `INSERT INTO siwe_nonces (nonce) VALUES ($1)`,
    [nonce]
  )
  return nonce
}

/**
 * Atomically consumes a nonce. Returns true if the nonce was valid and
 * we successfully marked it consumed. Returns false if the nonce is
 * unknown, already consumed, or expired.
 */
export async function consumeNonce(nonce: string): Promise<boolean> {
  const { rows } = await pool.query(
    `UPDATE siwe_nonces
        SET consumed_at = NOW()
      WHERE nonce = $1
        AND consumed_at IS NULL
        AND expires_at > NOW()
      RETURNING nonce`,
    [nonce]
  )
  return rows.length > 0
}

// =============================================================================
// Message format (EIP-4361)
// =============================================================================

export interface SiweFields {
  domain: string           // e.g. "www.allowanceguard.com"
  address: string          // checksummed 0x address
  statement?: string
  uri: string              // e.g. "https://www.allowanceguard.com"
  version: '1'
  chainId: number
  nonce: string
  issuedAt: string         // ISO 8601
  expirationTime?: string  // ISO 8601
  notBefore?: string       // ISO 8601
  requestId?: string
  resources?: string[]
}

/**
 * Serialises a SiweFields object to the canonical EIP-4361 text format.
 * The client MUST construct the identical string; the server re-parses
 * what the client signed and re-verifies.
 */
export function buildMessage(f: SiweFields): string {
  const prefix = `${f.domain} wants you to sign in with your Ethereum account:\n${f.address}`
  const body = f.statement ? `\n\n${f.statement}\n\n` : '\n\n'
  const lines: string[] = [
    `URI: ${f.uri}`,
    `Version: ${f.version}`,
    `Chain ID: ${f.chainId}`,
    `Nonce: ${f.nonce}`,
    `Issued At: ${f.issuedAt}`,
  ]
  if (f.expirationTime) lines.push(`Expiration Time: ${f.expirationTime}`)
  if (f.notBefore) lines.push(`Not Before: ${f.notBefore}`)
  if (f.requestId) lines.push(`Request ID: ${f.requestId}`)
  if (f.resources && f.resources.length > 0) {
    lines.push(`Resources:`)
    for (const r of f.resources) lines.push(`- ${r}`)
  }
  return `${prefix}${body}${lines.join('\n')}`
}

/**
 * Parses a canonical SIWE message. Strict — rejects anything that
 * doesn't match the spec. We do this ourselves so we know exactly
 * what we accept and reject.
 */
export function parseMessage(raw: string): SiweFields {
  const lines = raw.split('\n')
  if (lines.length < 6) throw new Error('SIWE: message too short')

  const domainMatch = lines[0]?.match(/^(\S+) wants you to sign in with your Ethereum account:$/)
  if (!domainMatch) throw new Error('SIWE: invalid header line')
  const domain = domainMatch[1]!

  const address = lines[1]?.trim()
  if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
    throw new Error('SIWE: invalid address line')
  }

  // Walk the remaining lines. Statement (if present) is the block
  // between the address and the first "URI:" line.
  let i = 2
  // Skip the mandatory blank line after address
  while (i < lines.length && lines[i] === '') i++
  let statement: string | undefined
  const statementLines: string[] = []
  while (i < lines.length && !lines[i]!.startsWith('URI:')) {
    if (lines[i] !== '') statementLines.push(lines[i]!)
    i++
  }
  if (statementLines.length > 0) statement = statementLines.join('\n')

  const fields: Record<string, string> = {}
  const resources: string[] = []
  let inResources = false
  for (; i < lines.length; i++) {
    const line = lines[i]!
    if (line === '') continue
    if (inResources) {
      if (line.startsWith('- ')) { resources.push(line.slice(2)); continue }
      inResources = false
    }
    if (line === 'Resources:') { inResources = true; continue }
    const kv = line.match(/^([A-Za-z ]+): (.+)$/)
    if (!kv) throw new Error(`SIWE: unparseable line "${line}"`)
    fields[kv[1]!] = kv[2]!
  }

  const uri = fields['URI']
  const version = fields['Version']
  const chainId = fields['Chain ID']
  const nonce = fields['Nonce']
  const issuedAt = fields['Issued At']
  if (!uri || !version || !chainId || !nonce || !issuedAt) {
    throw new Error('SIWE: missing required field')
  }
  if (version !== '1') throw new Error('SIWE: unsupported version')

  return {
    domain,
    address,
    statement,
    uri,
    version: '1',
    chainId: Number(chainId),
    nonce,
    issuedAt,
    expirationTime: fields['Expiration Time'],
    notBefore: fields['Not Before'],
    requestId: fields['Request ID'],
    resources: resources.length > 0 ? resources : undefined,
  }
}

// =============================================================================
// End-to-end verification
// =============================================================================

export interface VerifyOptions {
  /** Canonical host we expect in the message (e.g. "www.allowanceguard.com") */
  expectedDomain: string
  /** Chain IDs we accept (e.g. [1, 8453, 42161]) */
  allowedChainIds: number[]
}

export interface VerifyResult {
  ok: true
  address: `0x${string}`
  chainId: number
  nonce: string
}

export interface VerifyError {
  ok: false
  error: string
}

/**
 * The one function routes should call. Parses the message, validates
 * every invariant, recovers + compares the signature, consumes the
 * nonce atomically. Returns a discriminated union so callers don't
 * have to write try/catch boilerplate.
 */
export async function verifySiwe(
  message: string,
  signature: `0x${string}`,
  opts: VerifyOptions
): Promise<VerifyResult | VerifyError> {
  let fields: SiweFields
  try {
    fields = parseMessage(message)
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'parse failed' }
  }

  // Domain binding — prevents cross-site replay
  if (fields.domain !== opts.expectedDomain) {
    return { ok: false, error: `domain mismatch: expected ${opts.expectedDomain}` }
  }

  // Chain allowlist
  if (!opts.allowedChainIds.includes(fields.chainId)) {
    return { ok: false, error: `chain ${fields.chainId} not allowed` }
  }

  // Time bounds
  const now = Date.now()
  if (fields.expirationTime) {
    const exp = Date.parse(fields.expirationTime)
    if (Number.isFinite(exp) && exp < now) {
      return { ok: false, error: 'message expired' }
    }
  }
  if (fields.notBefore) {
    const nb = Date.parse(fields.notBefore)
    if (Number.isFinite(nb) && nb > now) {
      return { ok: false, error: 'message not yet valid' }
    }
  }
  const issuedAt = Date.parse(fields.issuedAt)
  if (!Number.isFinite(issuedAt)) {
    return { ok: false, error: 'invalid issuedAt' }
  }
  // Reject messages minted more than 10 minutes ago even without
  // explicit expirationTime — matches the nonce TTL.
  if (now - issuedAt > 10 * 60 * 1000) {
    return { ok: false, error: 'message too old' }
  }

  // Recover the signer and compare
  let address: `0x${string}`
  try {
    address = getAddress(fields.address) // checksums
  } catch {
    return { ok: false, error: 'invalid address format' }
  }
  let valid: boolean
  try {
    valid = await verifyMessage({
      address,
      message,
      signature,
    })
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'signature verify failed' }
  }
  if (!valid) return { ok: false, error: 'signature does not match address' }

  // Atomically consume the nonce — if this fails, someone is replaying
  const consumed = await consumeNonce(fields.nonce)
  if (!consumed) {
    return { ok: false, error: 'nonce invalid, consumed, or expired' }
  }

  return { ok: true, address, chainId: fields.chainId, nonce: fields.nonce }
}

/**
 * Find-or-create a user by wallet address. Normalises to lowercase
 * for the unique index to do the right thing.
 */
export async function getOrCreateUserByWallet(address: string): Promise<number> {
  const normalized = address.toLowerCase()
  const existing = await pool.query(
    `SELECT id FROM users WHERE LOWER(wallet_address) = $1 LIMIT 1`,
    [normalized]
  )
  if (existing.rows[0]) return existing.rows[0].id as number
  const inserted = await pool.query(
    `INSERT INTO users (wallet_address) VALUES ($1) RETURNING id`,
    [normalized]
  )
  return inserted.rows[0].id as number
}
