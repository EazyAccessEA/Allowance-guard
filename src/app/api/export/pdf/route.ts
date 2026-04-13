import { NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { pool } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { checkFeature } from '@/lib/feature-gate'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'

// Brand colors
const TEAL = '#00C2B3'
const DARK_TEXT = '#0F172A'
const SECONDARY_TEXT = '#475569'
const TERTIARY_TEXT = '#64748B'
const BORDER_COLOR = '#E2E8F0'
const LIGHT_BG = '#F8FAFC'

export async function GET(req: Request) {
  // Feature gate: export requires Pro+ plan
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const access = await checkFeature(session.user_id as number, 'export')
  if (!access.allowed) {
    return NextResponse.json(
      { error: 'PDF export requires a Pro or Sentinel plan', requiredPlan: access.requiredPlan },
      { status: 403 },
    )
  }

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

  // Load logo
  let logoBuffer: Buffer | null = null
  try {
    logoBuffer = readFileSync(join(process.cwd(), 'public', 'images/branding/ag-logo.png'))
  } catch {
    // Logo not available — continue without it
  }

  const margin = 40
  const pageWidth = 595.28 // A4 width in points
  const contentWidth = pageWidth - margin * 2

  // ---------------------------------------------------------------------------
  // Header with logo and branding
  // ---------------------------------------------------------------------------
  function drawHeader() {
    const headerY = doc.y

    if (logoBuffer) {
      doc.image(logoBuffer, margin, headerY, { width: 40, height: 40 })
    }

    const textX = logoBuffer ? margin + 50 : margin
    doc.font('Helvetica-Bold').fontSize(18).fillColor(TEAL)
       .text('AllowanceGuard', textX, headerY + 4)
    doc.font('Helvetica').fontSize(9).fillColor(TERTIARY_TEXT)
       .text('Wallet Security Report', textX, headerY + 26)

    doc.y = headerY + 48

    // Teal divider line
    doc.moveTo(margin, doc.y).lineTo(pageWidth - margin, doc.y)
       .strokeColor(TEAL).lineWidth(2).stroke()
    doc.moveDown(0.6)
  }

  drawHeader()

  // Report metadata box
  const metaY = doc.y
  doc.rect(margin, metaY, contentWidth, 52).fill(LIGHT_BG)
  doc.font('Helvetica-Bold').fontSize(9).fillColor(DARK_TEXT)
     .text('Wallet:', margin + 10, metaY + 8)
  doc.font('Helvetica').fillColor(SECONDARY_TEXT)
     .text(wallet, margin + 50, metaY + 8)

  doc.font('Helvetica-Bold').fillColor(DARK_TEXT)
     .text('Generated:', margin + 10, metaY + 22)
  doc.font('Helvetica').fillColor(SECONDARY_TEXT)
     .text(new Date().toLocaleString(), margin + 68, metaY + 22)

  doc.font('Helvetica-Bold').fillColor(DARK_TEXT)
     .text('Filter:', margin + 10, metaY + 36)
  doc.font('Helvetica').fillColor(SECONDARY_TEXT)
     .text(riskOnly ? 'Risky approvals only' : 'All approvals', margin + 45, metaY + 36)

  doc.y = metaY + 62
  doc.moveDown(0.4)

  // ---------------------------------------------------------------------------
  // Table
  // ---------------------------------------------------------------------------
  const cols = ['Chain', 'Token', 'Spender', 'Std', 'Type', 'Amount', 'Risk']
  const widths = [40, 130, 140, 35, 55, 70, 45]
  const x0 = margin

  function drawTableHeader() {
    const y = doc.y
    // Teal header background
    doc.rect(x0, y, contentWidth, 16).fill(TEAL)
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#FFFFFF')
    let x = x0
    for (let i = 0; i < cols.length; i++) {
      doc.text(cols[i], x + 3, y + 4, { width: widths[i] - 6, lineBreak: false })
      x += widths[i]
    }
    doc.y = y + 20
    doc.fillColor(DARK_TEXT)
  }

  drawTableHeader()

  const fmt = (r: Record<string, unknown>) => ({
    chain: String(r.chain_id || ''),
    token: String(r.token_symbol || r.token_name || r.token_address || ''),
    spender: String(r.spender_label || r.spender_address || ''),
    std: String(r.standard || ''),
    type: String(r.allowance_type || ''),
    amt: r.is_unlimited ? 'UNLIMITED' : String(r.amount || ''),
    badges: [
      r.is_unlimited ? 'UNLIMITED' : null,
      Array.isArray(r.risk_flags) && r.risk_flags.includes('STALE') ? 'STALE' : null,
    ].filter(Boolean).join(' '),
  })

  let rowIndex = 0
  for (const r of rows) {
    // Page break check
    if (doc.y > 740) {
      drawFooter(doc, margin, pageWidth)
      doc.addPage()
      drawHeader()
      drawTableHeader()
      rowIndex = 0
    }

    const v = fmt(r)
    const y = doc.y

    // Alternate row shading
    if (rowIndex % 2 === 1) {
      doc.rect(x0, y, contentWidth, 14).fill(LIGHT_BG)
    }

    doc.font('Helvetica').fontSize(7.5).fillColor(DARK_TEXT)
    let x = x0
    const vals = [v.chain, v.token, v.spender, v.std, v.type, v.amt, v.badges]
    for (let i = 0; i < vals.length; i++) {
      // Color UNLIMITED/STALE badges in red
      if (i === 6 && vals[i]) {
        doc.fillColor('#EF4444')
      }
      doc.text(String(vals[i] ?? ''), x + 3, y + 3, { width: widths[i] - 6, lineBreak: false })
      if (i === 6) doc.fillColor(DARK_TEXT)
      x += widths[i]
    }
    doc.y = y + 14
    rowIndex++
  }

  // Bottom border of table
  doc.moveTo(x0, doc.y).lineTo(pageWidth - margin, doc.y)
     .strokeColor(BORDER_COLOR).lineWidth(0.5).stroke()

  // ---------------------------------------------------------------------------
  // Compliance metadata
  // ---------------------------------------------------------------------------
  doc.moveDown(0.8)
  const reportId = crypto.randomUUID()
  doc.font('Helvetica-Bold').fontSize(9).fillColor(DARK_TEXT)
     .text('Compliance Metadata')
  doc.moveDown(0.2)
  doc.font('Helvetica').fontSize(8).fillColor(SECONDARY_TEXT)
     .text(`Report ID: ${reportId}`)
     .text(`Exported by: ${session.email ?? 'unknown'}`)
     .text(`Timestamp: ${new Date().toISOString()}`)
     .text(`Total approvals: ${rows.length}`)
  doc.moveDown(0.3)
  doc.font('Helvetica-Bold').fillColor(TEAL).fontSize(8)
     .text('Tip: Revoke UNLIMITED approvals first to protect your assets.')

  // Final page footer
  drawFooter(doc, margin, pageWidth)

  doc.end()
  await done

  function drawFooter(d: typeof doc, m: number, pw: number) {
    d.font('Helvetica').fontSize(7).fillColor(TERTIARY_TEXT)
    d.text(
      'Generated by AllowanceGuard  |  allowanceguard.com  |  Web3 Wallet Security',
      m, 800, { width: pw - m * 2, align: 'center' },
    )
  }

  return new NextResponse(Buffer.concat(chunks), {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="allowances_${wallet}.pdf"`
    }
  })
}
