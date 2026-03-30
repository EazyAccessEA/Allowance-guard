// Enhanced Audit Logging System
// Comprehensive audit trail for security, compliance, and debugging

import { pool } from '@/lib/db'
import { secureLogger } from '@/lib/secure-logger'
import { NextRequest } from 'next/server'

export interface AuditEvent {
  actorType: 'user' | 'system' | 'webhook' | 'admin' | 'api'
  actorId: string | null
  action: string
  subject: string | null
  meta: Record<string, unknown>
  ip?: string | null
  path?: string | null
  userAgent?: string | null
  sessionId?: string | null
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'security' | 'compliance'
}

// Enhanced audit logging function
export async function auditEvent(event: AuditEvent): Promise<void> {
  try {
    const query = `
      INSERT INTO audit_logs (
        actor_type, actor_id, action, subject, meta, ip, path, 
        user_agent, session_id, severity, category, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
    `
    
    const values: unknown[] = [
      event.actorType,
      event.actorId,
      event.action,
      event.subject,
      JSON.stringify(event.meta),
      event.ip,
      event.path,
      event.userAgent,
      event.sessionId,
      event.severity,
      event.category
    ]
    
    await pool.query(query, values)
    
    // Log high-severity events to secure logger
    if (event.severity === 'high' || event.severity === 'critical') {
      secureLogger.security(`Audit: ${event.action}`, {
        actorType: event.actorType,
        actorId: event.actorId,
        subject: event.subject,
        severity: event.severity,
        category: event.category,
        ip: event.ip,
        path: event.path
      })
    }
    
  } catch (error) {
    secureLogger.error('Failed to write audit log', { error, event })
    throw error
  }
}

// Convenience functions for common audit events
export async function auditUserAction(
  action: string,
  actorId: string | null,
  subject: string | null,
  meta: Record<string, unknown> = {},
  request?: NextRequest,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  category: AuditEvent['category'] = 'data_access'
): Promise<void> {
  const event: AuditEvent = {
    actorType: 'user',
    actorId,
    action,
    subject,
    meta,
    ip: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || null,
    path: request?.nextUrl.pathname || null,
    userAgent: request?.headers.get('user-agent') || null,
    sessionId: request?.headers.get('x-session-id') || null,
    severity,
    category
  }
  
  await auditEvent(event)
}

export async function auditSystemEvent(
  action: string,
  subject: string | null,
  meta: Record<string, unknown> = {},
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  category: AuditEvent['category'] = 'system'
): Promise<void> {
  const event: AuditEvent = {
    actorType: 'system',
    actorId: 'system',
    action,
    subject,
    meta,
    severity,
    category
  }
  
  await auditEvent(event)
}

export async function auditSecurityEvent(
  action: string,
  actorId: string | null,
  subject: string | null,
  meta: Record<string, unknown> = {},
  request?: NextRequest,
  severity: 'medium' | 'high' | 'critical' = 'high'
): Promise<void> {
  const event: AuditEvent = {
    actorType: 'user',
    actorId,
    action,
    subject,
    meta,
    ip: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || null,
    path: request?.nextUrl.pathname || null,
    userAgent: request?.headers.get('user-agent') || null,
    sessionId: request?.headers.get('x-session-id') || null,
    severity,
    category: 'security'
  }
  
  await auditEvent(event)
}

export async function auditAdminAction(
  action: string,
  actorId: string,
  subject: string | null,
  meta: Record<string, unknown> = {},
  request?: NextRequest,
  severity: 'medium' | 'high' | 'critical' = 'high'
): Promise<void> {
  const event: AuditEvent = {
    actorType: 'admin',
    actorId,
    action,
    subject,
    meta,
    ip: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || null,
    path: request?.nextUrl.pathname || null,
    userAgent: request?.headers.get('user-agent') || null,
    sessionId: request?.headers.get('x-session-id') || null,
    severity,
    category: 'authorization'
  }
  
  await auditEvent(event)
}

export async function auditWebhookEvent(
  provider: string,
  action: string,
  subject: string | null,
  meta: Record<string, unknown> = {},
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): Promise<void> {
  const event: AuditEvent = {
    actorType: 'webhook',
    actorId: provider,
    action,
    subject,
    meta,
    path: `/api/${provider}/webhook`,
    severity,
    category: 'system'
  }
  
  await auditEvent(event)
}

// Audit middleware for API routes
export function withAuditLogging(
  handler: (req: NextRequest, ...args: unknown[]) => Promise<Response>,
  options: {
    action: string
    category?: AuditEvent['category']
    severity?: AuditEvent['severity']
    extractActorId?: (req: NextRequest) => string | null
    extractSubject?: (req: NextRequest, ...args: unknown[]) => string | null
    extractMeta?: (req: NextRequest, ...args: unknown[]) => Record<string, unknown>
  }
) {
  return async (req: NextRequest, ...args: unknown[]): Promise<Response> => {
    const startTime = Date.now()
    let response: Response | undefined
    let error: Error | null = null
    
    try {
      response = await handler(req, ...args)
      return response
    } catch (err) {
      error = err as Error
      throw err
    } finally {
      const duration = Date.now() - startTime
      
      try {
        const actorId = options.extractActorId ? options.extractActorId(req) : null
        const subject = options.extractSubject ? options.extractSubject(req, ...args) : null
        const meta = {
          ...(options.extractMeta ? options.extractMeta(req, ...args) : {}),
          duration,
          status: response?.status || 500,
          error: error?.message || null
        }
        
        await auditUserAction(
          options.action,
          actorId,
          subject,
          meta,
          req,
          options.severity || 'medium',
          options.category || 'data_access'
        )
      } catch (auditError) {
        secureLogger.error('Failed to audit API call', { auditError, action: options.action })
      }
    }
  }
}

// Query audit logs
export async function getAuditLogs(options: {
  limit?: number
  offset?: number
  actorType?: string
  action?: string
  category?: string
  severity?: string
  startDate?: Date
  endDate?: Date
  actorId?: string
} = {}): Promise<{
  logs: Array<{
    id: number
    createdAt: Date
    actorType: string
    actorId: string | null
    action: string
    subject: string | null
    meta: Record<string, unknown>
    ip: string | null
    path: string | null
    userAgent: string | null
    sessionId: string | null
    severity: string
    category: string
  }>
  total: number
}> {
  const {
    limit = 100,
    offset = 0,
    actorType,
    action,
    category,
    severity,
    startDate,
    endDate,
    actorId
  } = options
  
    const whereConditions: string[] = []
    const queryParams: unknown[] = []
  let paramIndex = 1
  
  if (actorType) {
    whereConditions.push(`actor_type = $${paramIndex}`)
    queryParams.push(actorType)
    paramIndex++
  }
  
  if (action) {
    whereConditions.push(`action = $${paramIndex}`)
    queryParams.push(action)
    paramIndex++
  }
  
  if (category) {
    whereConditions.push(`category = $${paramIndex}`)
    queryParams.push(category)
    paramIndex++
  }
  
  if (severity) {
    whereConditions.push(`severity = $${paramIndex}`)
    queryParams.push(severity)
    paramIndex++
  }
  
  if (startDate) {
    whereConditions.push(`created_at >= $${paramIndex}`)
    queryParams.push(startDate)
    paramIndex++
  }
  
  if (endDate) {
    whereConditions.push(`created_at <= $${paramIndex}`)
    queryParams.push(endDate)
    paramIndex++
  }
  
  if (actorId) {
    whereConditions.push(`actor_id = $${paramIndex}`)
    queryParams.push(actorId)
    paramIndex++
  }
  
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
  
  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM audit_logs ${whereClause}`
  const { rows: countRows } = await pool.query(countQuery, queryParams)
  const total = parseInt(countRows[0].total)
  
  // Get logs
  const logsQuery = `
    SELECT 
      id, created_at, actor_type, actor_id, action, subject, meta, 
      ip, path, user_agent, session_id, severity, category
    FROM audit_logs 
    ${whereClause}
    ORDER BY created_at DESC 
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `
  
  queryParams.push(limit, offset)
  const { rows } = await pool.query(logsQuery, queryParams)
  
  return {
    logs: rows.map(row => ({
      id: row.id,
      createdAt: row.created_at,
      actorType: row.actor_type,
      actorId: row.actor_id,
      action: row.action,
      subject: row.subject,
      meta: row.meta,
      ip: row.ip,
      path: row.path,
      userAgent: row.user_agent,
      sessionId: row.session_id,
      severity: row.severity,
      category: row.category
    })),
    total
  }
}

// Audit log statistics
export async function getAuditStats(options: {
  startDate?: Date
  endDate?: Date
} = {}): Promise<{
  totalEvents: number
  eventsByCategory: Record<string, number>
  eventsBySeverity: Record<string, number>
  eventsByActorType: Record<string, number>
  topActions: Array<{ action: string; count: number }>
  topActors: Array<{ actorId: string; count: number }>
}> {
  const { startDate, endDate } = options
  
  let whereClause = ''
    const queryParams: unknown[] = []
  
  if (startDate || endDate) {
    const conditions: string[] = []
    if (startDate) {
      conditions.push(`created_at >= $1`)
      queryParams.push(startDate)
    }
    if (endDate) {
      conditions.push(`created_at <= $${queryParams.length + 1}`)
      queryParams.push(endDate)
    }
    whereClause = `WHERE ${conditions.join(' AND ')}`
  }
  
  // Total events
  const totalQuery = `SELECT COUNT(*) as total FROM audit_logs ${whereClause}`
  const { rows: totalRows } = await pool.query(totalQuery, queryParams)
  const totalEvents = parseInt(totalRows[0].total)
  
  // Events by category
  const categoryQuery = `
    SELECT category, COUNT(*) as count 
    FROM audit_logs ${whereClause}
    GROUP BY category 
    ORDER BY count DESC
  `
  const { rows: categoryRows } = await pool.query(categoryQuery, queryParams)
  const eventsByCategory = categoryRows.reduce((acc, row) => {
    acc[row.category] = parseInt(row.count)
    return acc
  }, {} as Record<string, number>)
  
  // Events by severity
  const severityQuery = `
    SELECT severity, COUNT(*) as count 
    FROM audit_logs ${whereClause}
    GROUP BY severity 
    ORDER BY count DESC
  `
  const { rows: severityRows } = await pool.query(severityQuery, queryParams)
  const eventsBySeverity = severityRows.reduce((acc, row) => {
    acc[row.severity] = parseInt(row.count)
    return acc
  }, {} as Record<string, number>)
  
  // Events by actor type
  const actorTypeQuery = `
    SELECT actor_type, COUNT(*) as count 
    FROM audit_logs ${whereClause}
    GROUP BY actor_type 
    ORDER BY count DESC
  `
  const { rows: actorTypeRows } = await pool.query(actorTypeQuery, queryParams)
  const eventsByActorType = actorTypeRows.reduce((acc, row) => {
    acc[row.actor_type] = parseInt(row.count)
    return acc
  }, {} as Record<string, number>)
  
  // Top actions
  const actionsQuery = `
    SELECT action, COUNT(*) as count 
    FROM audit_logs ${whereClause}
    GROUP BY action 
    ORDER BY count DESC 
    LIMIT 10
  `
  const { rows: actionsRows } = await pool.query(actionsQuery, queryParams)
  const topActions = actionsRows.map(row => ({
    action: row.action,
    count: parseInt(row.count)
  }))
  
  // Top actors
  const actorsQuery = `
    SELECT actor_id, COUNT(*) as count 
    FROM audit_logs ${whereClause}
    WHERE actor_id IS NOT NULL
    GROUP BY actor_id 
    ORDER BY count DESC 
    LIMIT 10
  `
  const { rows: actorsRows } = await pool.query(actorsQuery, queryParams)
  const topActors = actorsRows.map(row => ({
    actorId: row.actor_id,
    count: parseInt(row.count)
  }))
  
  return {
    totalEvents,
    eventsByCategory,
    eventsBySeverity,
    eventsByActorType,
    topActions,
    topActors
  }
}
