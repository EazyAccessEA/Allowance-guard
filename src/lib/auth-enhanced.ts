import { cookies } from 'next/headers'
import { randomBytes, createHash } from 'crypto'
import { pool } from '@/lib/db'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import CryptoJS from 'crypto-js'

// Types
export interface User {
  id: number
  email: string
  name?: string
  avatar_url?: string
  two_factor_enabled: boolean
  last_login_at?: Date
  created_at: Date
}

export interface Session {
  id: number
  user_id: number
  token: string
  device_fingerprint?: string
  device_name?: string
  device_type?: string
  browser_name?: string
  browser_version?: string
  os_name?: string
  os_version?: string
  ip_address?: string
  user_agent?: string
  location_country?: string
  location_city?: string
  is_trusted: boolean
  last_activity_at: Date
  expires_at: Date
  created_at: Date
}

export interface DeviceInfo {
  fingerprint: string
  name: string
  type: string
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  ip: string
  userAgent: string
  country?: string
  city?: string
}

export interface SecurityEvent {
  event_type: string
  event_data: Record<string, unknown>
  ip_address?: string
  user_agent?: string
}

// Constants
const COOKIE = 'ag_sess'
const SESSION_DAYS = 30
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION_MINUTES = 15
const BACKUP_CODES_COUNT = 10

// Enhanced session management
export async function getSession(): Promise<(Session & { user: User }) | null> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return null

  const { rows } = await pool.query(
    `SELECT s.*, u.id as user_id, u.email, u.name, u.avatar_url, u.two_factor_enabled, u.last_login_at, u.created_at
     FROM sessions s 
     JOIN users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > NOW()`,
    [token]
  )

  if (!rows[0]) return null

  const session = rows[0]
  return {
    id: session.id,
    user_id: session.user_id,
    token: session.token,
    device_fingerprint: session.device_fingerprint,
    device_name: session.device_name,
    device_type: session.device_type,
    browser_name: session.browser_name,
    browser_version: session.browser_version,
    os_name: session.os_name,
    os_version: session.os_version,
    ip_address: session.ip_address,
    user_agent: session.user_agent,
    location_country: session.location_country,
    location_city: session.location_city,
    is_trusted: session.is_trusted,
    last_activity_at: session.last_activity_at,
    expires_at: session.expires_at,
    created_at: session.created_at,
    user: {
      id: session.user_id,
      email: session.email,
      name: session.name,
      avatar_url: session.avatar_url,
      two_factor_enabled: session.two_factor_enabled,
      last_login_at: session.last_login_at,
      created_at: session.created_at
    }
  }
}

export async function requireUser(): Promise<Session & { user: User }> {
  const session = await getSession()
  if (!session) throw new Error('UNAUTHENTICATED')
  return session
}

// Device fingerprinting
export function generateDeviceFingerprint(userAgent: string, ip: string): string {
  const data = `${userAgent}-${ip}`
  return createHash('sha256').update(data).digest('hex')
}

export function parseUserAgent(userAgent: string): Partial<DeviceInfo> {
  // Simple user agent parsing (in production, use a proper library like ua-parser-js)
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)
  const isTablet = /iPad|Tablet/.test(userAgent)
  
  let deviceType = 'desktop'
  if (isTablet) deviceType = 'tablet'
  else if (isMobile) deviceType = 'mobile'

  // Extract browser info
  let browser = 'Unknown'
  let browserVersion = 'Unknown'
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome'
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/)
    if (match) browserVersion = match[1]
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox'
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/)
    if (match) browserVersion = match[1]
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari'
    const match = userAgent.match(/Version\/(\d+\.\d+)/)
    if (match) browserVersion = match[1]
  }

  // Extract OS info
  let os = 'Unknown'
  let osVersion = 'Unknown'
  if (userAgent.includes('Windows')) {
    os = 'Windows'
    const match = userAgent.match(/Windows NT (\d+\.\d+)/)
    if (match) osVersion = match[1]
  } else if (userAgent.includes('Mac OS')) {
    os = 'macOS'
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/)
    if (match) osVersion = match[1].replace('_', '.')
  } else if (userAgent.includes('Linux')) {
    os = 'Linux'
  } else if (userAgent.includes('Android')) {
    os = 'Android'
    const match = userAgent.match(/Android (\d+\.\d+)/)
    if (match) osVersion = match[1]
  } else if (userAgent.includes('iOS')) {
    os = 'iOS'
    const match = userAgent.match(/OS (\d+[._]\d+)/)
    if (match) osVersion = match[1].replace('_', '.')
  }

  return {
    type: deviceType,
    browser,
    browserVersion,
    os,
    osVersion
  }
}

// Enhanced session creation
export async function createEnhancedSession(
  userId: number, 
  deviceInfo: DeviceInfo,
  createdVia: string = 'magic_link'
): Promise<string> {
  const token = randomBytes(32).toString('hex')
  
  const { rows } = await pool.query(
    `INSERT INTO sessions (
      user_id, token, device_fingerprint, device_name, device_type,
      browser_name, browser_version, os_name, os_version,
      ip_address, user_agent, location_country, location_city,
      expires_at, created_via
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW() + INTERVAL '${SESSION_DAYS} days', $14)
    RETURNING token`,
    [
      userId, token, deviceInfo.fingerprint, deviceInfo.name, deviceInfo.type,
      deviceInfo.browser, deviceInfo.browserVersion, deviceInfo.os, deviceInfo.osVersion,
      deviceInfo.ip, deviceInfo.userAgent, deviceInfo.country, deviceInfo.city,
      createdVia
    ]
  )

  if (!rows[0]) {
    throw new Error('Failed to create session')
  }

  // Update user's last login
  await pool.query(
    `UPDATE users SET last_login_at = NOW() WHERE id = $1`,
    [userId]
  )

  return rows[0].token
}

// 2FA Management
export async function generate2FASecret(userId: number): Promise<{ secret: string; qrCode: string }> {
  const secret = speakeasy.generateSecret({
    name: 'Allowance Guard',
    issuer: 'Allowance Guard',
    length: 32
  })

  // Store the secret (encrypted)
  const encryptedSecret = CryptoJS.AES.encrypt(secret.base32, process.env.NEXTAUTH_SECRET || 'fallback').toString()
  
  await pool.query(
    `UPDATE users SET two_factor_secret = $1 WHERE id = $2`,
    [encryptedSecret, userId]
  )

  // Generate QR code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url!)

  return {
    secret: secret.base32,
    qrCode
  }
}

export async function verify2FAToken(userId: number, token: string): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT two_factor_secret FROM users WHERE id = $1`,
    [userId]
  )

  if (!rows[0]?.two_factor_secret) return false

  // Decrypt the secret
  const decryptedSecret = CryptoJS.AES.decrypt(rows[0].two_factor_secret, process.env.NEXTAUTH_SECRET || 'fallback').toString(CryptoJS.enc.Utf8)

  return speakeasy.totp.verify({
    secret: decryptedSecret,
    encoding: 'base32',
    token,
    window: 2 // Allow 2 time steps of tolerance
  })
}

export async function enable2FA(userId: number, token: string): Promise<{ backupCodes: string[] }> {
  const isValid = await verify2FAToken(userId, token)
  if (!isValid) {
    throw new Error('Invalid 2FA token')
  }

  // Enable 2FA
  await pool.query(
    `UPDATE users SET two_factor_enabled = TRUE WHERE id = $1`,
    [userId]
  )

  // Generate backup codes
  const backupCodes = Array.from({ length: BACKUP_CODES_COUNT }, () => 
    randomBytes(4).toString('hex').toUpperCase()
  )

  // Store hashed backup codes
  const hashedCodes = backupCodes.map(code => 
    createHash('sha256').update(code).digest('hex')
  )

  await pool.query(
    `INSERT INTO user_backup_codes (user_id, code_hash) VALUES ${hashedCodes.map((_, i) => `($1, $${i + 2})`).join(', ')}`,
    [userId, ...hashedCodes]
  )

  return { backupCodes }
}

export async function verifyBackupCode(userId: number, code: string): Promise<boolean> {
  const hashedCode = createHash('sha256').update(code.toUpperCase()).digest('hex')
  
  const { rows } = await pool.query(
    `SELECT id FROM user_backup_codes 
     WHERE user_id = $1 AND code_hash = $2 AND used_at IS NULL`,
    [userId, hashedCode]
  )

  if (!rows[0]) return false

  // Mark code as used
  await pool.query(
    `UPDATE user_backup_codes SET used_at = NOW() WHERE id = $1`,
    [rows[0].id]
  )

  return true
}

// Security event logging
export async function logSecurityEvent(
  userId: number,
  sessionId: number | null,
  event: SecurityEvent
): Promise<void> {
  await pool.query(
    `INSERT INTO security_events (user_id, session_id, event_type, event_data, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, sessionId, event.event_type, JSON.stringify(event.event_data), event.ip_address, event.user_agent]
  )
}

// Login attempt tracking
export async function recordLoginAttempt(
  email: string,
  ip: string,
  userAgent: string,
  success: boolean,
  failureReason?: string
): Promise<void> {
  await pool.query(
    `INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
     VALUES ($1, $2, $3, $4, $5)`,
    [email, ip, userAgent, success, failureReason]
  )
}

// Account lockout management
export async function checkAccountLockout(email: string): Promise<{ locked: boolean; attemptsLeft: number }> {
  const { rows } = await pool.query(
    `SELECT login_attempts, locked_until FROM users WHERE email = $1`,
    [email.toLowerCase()]
  )

  if (!rows[0]) {
    return { locked: false, attemptsLeft: MAX_LOGIN_ATTEMPTS }
  }

  const user = rows[0]
  
  // Check if account is currently locked
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    return { locked: true, attemptsLeft: 0 }
  }

  // If lockout period has expired, reset attempts
  if (user.locked_until && new Date(user.locked_until) <= new Date()) {
    await pool.query(
      `UPDATE users SET login_attempts = 0, locked_until = NULL WHERE email = $1`,
      [email.toLowerCase()]
    )
    return { locked: false, attemptsLeft: MAX_LOGIN_ATTEMPTS }
  }

  const attemptsLeft = Math.max(0, MAX_LOGIN_ATTEMPTS - user.login_attempts)
  return { locked: false, attemptsLeft }
}

export async function incrementLoginAttempts(email: string): Promise<void> {
  const { rows } = await pool.query(
    `UPDATE users SET login_attempts = login_attempts + 1 WHERE email = $1 RETURNING login_attempts`,
    [email.toLowerCase()]
  )

  if (rows[0] && rows[0].login_attempts >= MAX_LOGIN_ATTEMPTS) {
    // Lock the account
    await pool.query(
      `UPDATE users SET locked_until = NOW() + INTERVAL '${LOCKOUT_DURATION_MINUTES} minutes' WHERE email = $1`,
      [email.toLowerCase()]
    )
  }
}

export async function resetLoginAttempts(email: string): Promise<void> {
  await pool.query(
    `UPDATE users SET login_attempts = 0, locked_until = NULL WHERE email = $1`,
    [email.toLowerCase()]
  )
}

// Device management
export async function getTrustedDevices(userId: number): Promise<unknown[]> {
  const { rows } = await pool.query(
    `SELECT * FROM trusted_devices WHERE user_id = $1 ORDER BY last_used_at DESC`,
    [userId]
  )
  return rows
}

export async function addTrustedDevice(userId: number, deviceInfo: DeviceInfo): Promise<void> {
  await pool.query(
    `INSERT INTO trusted_devices (
      user_id, device_fingerprint, device_name, device_type,
      browser_name, browser_version, os_name, os_version
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (user_id, device_fingerprint) 
    DO UPDATE SET last_used_at = NOW()`,
    [
      userId, deviceInfo.fingerprint, deviceInfo.name, deviceInfo.type,
      deviceInfo.browser, deviceInfo.browserVersion, deviceInfo.os, deviceInfo.osVersion
    ]
  )
}

export async function removeTrustedDevice(userId: number, deviceFingerprint: string): Promise<void> {
  await pool.query(
    `DELETE FROM trusted_devices WHERE user_id = $1 AND device_fingerprint = $2`,
    [userId, deviceFingerprint]
  )
}

// Session management
export async function updateSessionActivity(sessionId: number): Promise<void> {
  await pool.query(
    `UPDATE sessions SET last_activity_at = NOW() WHERE id = $1`,
    [sessionId]
  )
}

export async function invalidateSession(sessionId: number): Promise<void> {
  await pool.query(
    `UPDATE sessions SET expires_at = NOW() WHERE id = $1`,
    [sessionId]
  )
}

export async function invalidateAllUserSessions(userId: number, exceptSessionId?: number): Promise<void> {
  let query = `UPDATE sessions SET expires_at = NOW() WHERE user_id = $1`
  const params = [userId]
  
  if (exceptSessionId) {
    query += ` AND id != $2`
    params.push(exceptSessionId)
  }
  
  await pool.query(query, params)
}

// Cookie management
export async function setSessionCookie(token: string): Promise<void> {
  const c = await cookies()
  c.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * SESSION_DAYS
  })
}

export async function clearSessionCookie(): Promise<void> {
  const c = await cookies()
  c.delete(COOKIE)
}
