import { NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') || '').toLowerCase()
  const riskOnly = (searchParams.get('riskOnly') || 'true') === 'true'
  
  if (!/^0x[a-f0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }

  const q = `
    SELECT a.chain_id, a.token_address, a.spender_address, a.standard, a.allowance_type,
           a.amount, a.is_unlimited, a.risk_flags, a.risk_score,
           tm.symbol AS token_symbol, tm.name AS token_name,
           sl.label AS spender_label
    FROM allowances a
    LEFT JOIN token_metadata tm ON tm.chain_id=a.chain_id AND tm.token_address=a.token_address
    LEFT JOIN spender_labels sl ON sl.chain_id=a.chain_id AND sl.address=a.spender_address
    WHERE a.wallet_address=$1 ${riskOnly ? 'AND (a.is_unlimited=true OR a.risk_score>0 OR \'STALE\' = ANY(a.risk_flags))' : ''}
    ORDER BY a.is_unlimited DESC, a.amount DESC
    LIMIT 2000
  `
  
  const { rows } = await pool.query(q, [wallet])

  const doc = new PDFDocument({ size: 'A4', margin: 40 })
  const chunks: Buffer[] = []
  let resolveCb: (v: boolean) => void
  doc.on('data', (c: Buffer) => chunks.push(c)).on('end', () => resolveCb(true))
  const done = new Promise<boolean>(res => (resolveCb = res))

  // Header
  doc.fontSize(18).text('Allowance Guard — Report', { continued: false })
  doc.moveDown(0.2).fontSize(10).fillColor('#555')
     .text(`Wallet: ${wallet}`)
     .text(`Generated: ${new Date().toLocaleString()}`)
     .text(`Filter: ${riskOnly ? 'Risky approvals only' : 'All approvals'}`)
  doc.fillColor('#000').moveDown(0.5)

  // Table headers
  const cols = ['Chain','Token','Spender','Std','Type','Amount','Badges']
  const widths = [40, 130, 140, 35, 55, 70, 70]
  const x0 = doc.x
  
  function row(vals: (string|number)[], bold=false) {
    let x = x0
    if (bold) doc.font('Helvetica-Bold')
    else doc.font('Helvetica')
    for (let i=0;i<vals.length;i++){
      const w = widths[i]
      doc.text(String(vals[i] ?? ''), x, doc.y, { width: w, continued: i < vals.length - 1 })
      x += w
    }
    doc.text('\n')
  }
  
  row(cols, true)
  doc.moveTo(x0, doc.y).lineTo(555, doc.y).strokeColor('#ddd').stroke().moveDown(0.3)

  // Rows
  const fmt = (r: Record<string, unknown>) => ({
    chain: r.chain_id,
    token: r.token_symbol || r.token_name || r.token_address,
    spender: r.spender_label || r.spender_address,
    std: r.standard,
    type: r.allowance_type,
    amt: r.is_unlimited ? 'UNLIMITED' : r.amount,
    badges: [r.is_unlimited ? 'UNLIMITED' : null, Array.isArray(r.risk_flags) && r.risk_flags.includes('STALE') ? 'STALE' : null].filter(Boolean).join(' ')
  })
  
  for (const r of rows) {
    const v = fmt(r)
    row([v.chain, v.token, v.spender, v.std, v.type, v.amt, v.badges])
    if (doc.y > 760) { 
      doc.addPage()
      row(cols, true)
      doc.moveTo(x0, doc.y).lineTo(555, doc.y).strokeColor('#ddd').stroke().moveDown(0.3) 
    }
  }

  // Footer
  doc.moveDown(0.5).fontSize(9).fillColor('#666')
     .text('Tip: Revoke UNLIMITED approvals first. Printed from Allowance Guard.')

  doc.end()
  await done

  return new NextResponse(Buffer.concat(chunks), {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="allowances_${wallet}.pdf"`
    }
  })
}
