// lib/cache.ts - Simple database-based caching to replace Redis
import { pool } from './db'

// Create cache table if it doesn't exist
export async function initCache() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cache (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
  
  // Create index for cleanup
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON cache(expires_at)
  `)
}

// Set a cache entry with TTL in seconds
export async function cacheSet(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000)
  const serializedValue = JSON.stringify(value)
  
  await pool.query(`
    INSERT INTO cache (key, value, expires_at) 
    VALUES ($1, $2, $3)
    ON CONFLICT (key) 
    DO UPDATE SET value = $2, expires_at = $3
  `, [key, serializedValue, expiresAt])
}

// Get a cache entry
export async function cacheGet<T = unknown>(key: string): Promise<T | null> {
  const { rows } = await pool.query(`
    SELECT value FROM cache 
    WHERE key = $1 AND expires_at > NOW()
  `, [key])
  
  if (rows.length === 0) return null
  
  try {
    return JSON.parse(rows[0].value) as T
  } catch {
    return null
  }
}

// Delete a cache entry (supports wildcard patterns)
export async function cacheDel(pattern: string): Promise<void> {
  if (pattern.includes('*')) {
    // Simple wildcard support - convert * to SQL LIKE pattern
    const sqlPattern = pattern.replace(/\*/g, '%')
    await pool.query('DELETE FROM cache WHERE key LIKE $1', [sqlPattern])
  } else {
    await pool.query('DELETE FROM cache WHERE key = $1', [pattern])
  }
}

// Clean up expired entries
export async function cleanupCache(): Promise<void> {
  await pool.query('DELETE FROM cache WHERE expires_at <= NOW()')
}

// Health check for cache
export async function cacheHealthCheck(): Promise<{ ok: boolean; message: string }> {
  try {
    await initCache()
    await cacheSet('health_check', { timestamp: Date.now() }, 60)
    const result = await cacheGet<{ timestamp: number }>('health_check')
    
    if (result && result.timestamp) {
      return { ok: true, message: 'ok' }
    } else {
      return { ok: false, message: 'cache read failed' }
    }
  } catch (error) {
    return { 
      ok: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}