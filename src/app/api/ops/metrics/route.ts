import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { readToday } from '@/lib/metrics'

function authOk(req: Request) {
  const token = new URL(req.url).searchParams.get('token') || ''
  return token && token === process.env.OPS_DASH_TOKEN
}

export async function GET(req: Request) {
  try {
    if (!authOk(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get database size
    const db = await pool.query(`SELECT pg_database_size(current_database()) AS bytes`)
    
    // Get top tables by size
    const tables = await pool.query(`
      SELECT relname AS table, pg_total_relation_size(c.oid) AS bytes, n_live_tup AS rows
      FROM pg_class c
      JOIN pg_namespace n ON n.oid=c.relnamespace
      LEFT JOIN pg_stat_user_tables s ON s.relname=c.relname
      WHERE n.nspname='public' AND c.relkind='r'
      ORDER BY pg_total_relation_size(c.oid) DESC
      LIMIT 10`)
    
    // Get record counts for key tables
    const counts = await pool.query(`
      SELECT 'allowances' AS k, count(*)::bigint FROM allowances UNION ALL
      SELECT 'contributions', count(*)::bigint FROM contributions UNION ALL
      SELECT 'revocation_receipts', count(*)::bigint FROM revocation_receipts`)
    
    // Get today's metrics
    const today = await readToday()

    return NextResponse.json({
      dbBytes: Number(db.rows[0].bytes),
      topTables: tables.rows.map(r => ({ 
        table: r.table, 
        bytes: Number(r.bytes), 
        rows: Number(r.rows||0) 
      })),
      counts: Object.fromEntries(counts.rows.map(r => [r.k, Number(r.count)])),
      today,
      timestamp: new Date().toISOString()
    }, { headers: { 'cache-control': 'no-store' } })
    
  } catch (error) {
    console.error('Ops metrics API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
