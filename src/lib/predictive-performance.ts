// Predictive Performance System
// Builds upon existing performance monitoring infrastructure

import { pool } from './db'

export interface UserBehaviorPattern {
  userId: string
  pageUrl: string
  visitCount: number
  avgSessionDuration: number
  commonPaths: string[]
  deviceType: 'mobile' | 'desktop' | 'tablet'
  connectionSpeed: 'slow' | 'medium' | 'fast'
  lastVisit: Date
  preferences: {
    riskOnly: boolean
    chainIds: number[]
    pageSize: number
  }
}

export interface PredictiveCache {
  userId: string
  predictedPages: string[]
  priority: 'high' | 'medium' | 'low'
  confidence: number
  expiresAt: Date
}

/**
 * Track user behavior patterns for predictive optimization
 */
export async function trackUserBehavior(
  userId: string,
  pageUrl: string,
  sessionDuration: number,
  deviceInfo: {
    userAgent: string
    connectionSpeed?: string
  },
  preferences?: {
    riskOnly?: boolean
    chainIds?: number[]
    pageSize?: number
  }
): Promise<void> {
  try {
    // Determine device type from user agent
    const deviceType = getDeviceType(deviceInfo.userAgent)
    const connectionSpeed = getConnectionSpeed(deviceInfo.connectionSpeed)
    
    // Update or insert user behavior pattern
    await pool.query(`
      INSERT INTO user_behavior_patterns (
        user_id, page_url, visit_count, avg_session_duration,
        device_type, connection_speed, last_visit, preferences
      ) VALUES ($1, $2, 1, $3, $4, $5, NOW(), $6)
      ON CONFLICT (user_id, page_url) 
      DO UPDATE SET 
        visit_count = user_behavior_patterns.visit_count + 1,
        avg_session_duration = (user_behavior_patterns.avg_session_duration + $3) / 2,
        last_visit = NOW(),
        preferences = COALESCE($6, user_behavior_patterns.preferences)
    `, [
      userId,
      pageUrl,
      sessionDuration,
      deviceType,
      connectionSpeed,
      preferences ? JSON.stringify(preferences) : null
    ])
  } catch (error) {
    console.warn('Failed to track user behavior:', error)
    // Don't break the user experience if tracking fails
  }
}

/**
 * Predict which pages a user is likely to visit next
 */
export async function predictUserNavigation(
  userId: string,
  currentPage: string
): Promise<PredictiveCache[]> {
  try {
    // Get user's historical patterns
    const { rows } = await pool.query(`
      SELECT page_url, visit_count, avg_session_duration, common_paths
      FROM user_behavior_patterns 
      WHERE user_id = $1 
      ORDER BY visit_count DESC, last_visit DESC
      LIMIT 10
    `, [userId])

    // Get similar users' patterns
    const { rows: similarUsers } = await pool.query(`
      SELECT page_url, visit_count
      FROM user_behavior_patterns 
      WHERE page_url != $2 
      AND user_id != $1
      AND device_type = (
        SELECT device_type FROM user_behavior_patterns WHERE user_id = $1 LIMIT 1
      )
      ORDER BY visit_count DESC
      LIMIT 5
    `, [userId, currentPage])

    // Simple prediction algorithm
    const predictions: PredictiveCache[] = []
    
    // High confidence: User's own patterns
    rows.forEach((row: any) => {
      if (row.page_url !== currentPage) {
        predictions.push({
          userId,
          predictedPages: [row.page_url],
          priority: 'high',
          confidence: Math.min(row.visit_count / 10, 1),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        })
      }
    })

    // Medium confidence: Similar users
    similarUsers.forEach((row: any) => {
      predictions.push({
        userId,
        predictedPages: [row.page_url],
        priority: 'medium',
        confidence: Math.min(row.visit_count / 20, 0.7),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      })
    })

    return predictions.slice(0, 3) // Limit to top 3 predictions
  } catch (error) {
    console.warn('Failed to predict user navigation:', error)
    return []
  }
}

/**
 * Smart preloading based on predictions
 */
export async function getSmartPreloadResources(
  userId: string,
  currentPage: string
): Promise<string[]> {
  try {
    const predictions = await predictUserNavigation(userId, currentPage)
    const resources: string[] = []

    predictions.forEach(prediction => {
      if (prediction.confidence > 0.5) {
        // Preload critical resources for predicted pages
        prediction.predictedPages.forEach(page => {
          resources.push(page)
          // Add common resources for that page
          if (page.includes('/donate')) {
            resources.push('/api/chains', '/api/healthz')
          } else if (page.includes('/blog')) {
            resources.push('/api/analytics/performance')
          }
        })
      }
    })

    return [...new Set(resources)] // Remove duplicates
  } catch (error) {
    console.warn('Failed to get smart preload resources:', error)
    return []
  }
}

/**
 * Adaptive loading strategy based on user's connection
 */
export async function getAdaptiveLoadingStrategy(
  userId: string
): Promise<{
  preloadImages: boolean
  preloadScripts: boolean
  preloadStyles: boolean
  cacheStrategy: 'aggressive' | 'conservative'
}> {
  try {
    const { rows } = await pool.query(`
      SELECT connection_speed, device_type
      FROM user_behavior_patterns 
      WHERE user_id = $1 
      ORDER BY last_visit DESC 
      LIMIT 1
    `, [userId])

    if (rows.length === 0) {
      return {
        preloadImages: true,
        preloadScripts: true,
        preloadStyles: true,
        cacheStrategy: 'aggressive'
      }
    }

    const { connection_speed, device_type } = rows[0]

    // Adaptive strategy based on connection speed
    if (connection_speed === 'slow' || device_type === 'mobile') {
      return {
        preloadImages: false,
        preloadScripts: true,
        preloadStyles: true,
        cacheStrategy: 'aggressive'
      }
    }

    return {
      preloadImages: true,
      preloadScripts: true,
      preloadStyles: true,
      cacheStrategy: 'aggressive'
    }
  } catch (error) {
    console.warn('Failed to get adaptive loading strategy:', error)
    return {
      preloadImages: true,
      preloadScripts: true,
      preloadStyles: true,
      cacheStrategy: 'aggressive'
    }
  }
}

// Helper functions
function getDeviceType(userAgent: string): 'mobile' | 'desktop' | 'tablet' {
  if (/Mobile|Android|iPhone/i.test(userAgent)) return 'mobile'
  if (/Tablet|iPad/i.test(userAgent)) return 'tablet'
  return 'desktop'
}

function getConnectionSpeed(connectionSpeed?: string): 'slow' | 'medium' | 'fast' {
  if (!connectionSpeed) return 'medium'
  if (connectionSpeed.includes('slow') || connectionSpeed.includes('2g')) return 'slow'
  if (connectionSpeed.includes('fast') || connectionSpeed.includes('4g')) return 'fast'
  return 'medium'
}
