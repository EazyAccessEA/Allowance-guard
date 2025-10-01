// Build Cache Invalidation System
// Ensures users always get the latest build without constant refreshes

import { pool } from './db'

export interface BuildCache {
  buildId: string
  version: string
  timestamp: Date
  isActive: boolean
  staticAssets: string[]
  apiEndpoints: string[]
}

/**
 * Track build information for cache invalidation
 */
export async function trackBuild(
  buildId: string,
  version: string,
  staticAssets: string[],
  apiEndpoints: string[]
): Promise<void> {
  try {
    // Mark previous builds as inactive
    await pool.query(`
      UPDATE build_cache 
      SET is_active = false 
      WHERE is_active = true
    `)

    // Insert new build
    await pool.query(`
      INSERT INTO build_cache (build_id, version, timestamp, is_active, static_assets, api_endpoints)
      VALUES ($1, $2, NOW(), true, $3, $4)
    `, [buildId, version, JSON.stringify(staticAssets), JSON.stringify(apiEndpoints)])

    console.log('✅ Build tracked:', { buildId, version })
  } catch (error) {
    console.error('Failed to track build:', error)
  }
}

/**
 * Get current active build information
 */
export async function getCurrentBuild(): Promise<BuildCache | null> {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM build_cache 
      WHERE is_active = true 
      ORDER BY timestamp DESC 
      LIMIT 1
    `)

    if (rows.length === 0) return null

    const build = rows[0]
    return {
      buildId: build.build_id,
      version: build.version,
      timestamp: build.timestamp,
      isActive: build.is_active,
      staticAssets: JSON.parse(build.static_assets || '[]'),
      apiEndpoints: JSON.parse(build.api_endpoints || '[]')
    }
  } catch (error) {
    console.error('Failed to get current build:', error)
    return null
  }
}

/**
 * Check if build has changed and needs cache invalidation
 */
export async function checkBuildChange(currentBuildId: string): Promise<{
  hasChanged: boolean
  newBuild?: BuildCache
}> {
  try {
    const currentBuild = await getCurrentBuild()
    
    if (!currentBuild) {
      return { hasChanged: true }
    }

    if (currentBuild.buildId !== currentBuildId) {
      return { hasChanged: true, newBuild: currentBuild }
    }

    return { hasChanged: false }
  } catch (error) {
    console.error('Failed to check build change:', error)
    return { hasChanged: false }
  }
}

/**
 * Generate cache invalidation headers
 */
export function generateCacheHeaders(buildId: string): Record<string, string> {
  return {
    'X-Build-ID': buildId,
    'X-Cache-Control': 'no-cache, must-revalidate',
    'Cache-Control': 'no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
}

/**
 * Check if resource should be invalidated based on build
 */
export function shouldInvalidateResource(
  resourcePath: string,
  buildId: string,
  staticAssets: string[]
): boolean {
  // Always invalidate build-specific resources
  if (resourcePath.includes('/_next/static/chunks/') || 
      resourcePath.includes('/_next/static/css/') ||
      resourcePath.includes('/_next/static/js/')) {
    return true
  }

  // Check if resource is in static assets list
  return staticAssets.some(asset => resourcePath.includes(asset))
}

/**
 * Clean up old build records
 */
export async function cleanupOldBuilds(): Promise<void> {
  try {
    // Keep only last 5 builds
    await pool.query(`
      DELETE FROM build_cache 
      WHERE id NOT IN (
        SELECT id FROM build_cache 
        ORDER BY timestamp DESC 
        LIMIT 5
      )
    `)
    
    console.log('✅ Old builds cleaned up')
  } catch (error) {
    console.error('Failed to cleanup old builds:', error)
  }
}
