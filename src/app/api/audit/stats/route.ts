import { NextRequest, NextResponse } from 'next/server'
import { getAuditStats } from '@/lib/audit-enhanced'
import { secureLogger } from '@/lib/secure-logger'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Parse date range parameters
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
    
    // Validate date range
    if (startDate && endDate && startDate > endDate) {
      return NextResponse.json({ error: 'Start date cannot be after end date' }, { status: 400 })
    }
    
    // Get audit statistics
    const stats = await getAuditStats({
      startDate,
      endDate
    })
    
    return NextResponse.json(stats)
    
  } catch (error) {
    secureLogger.error('Failed to retrieve audit statistics', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
