import { db } from '@/db'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

function money(minor: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency.toUpperCase() }).format(minor / 100)
}
function when(s: string) { return new Date(s).toLocaleString() }

export default async function Recent() {
  const q = sql`
    (
      SELECT created_at, amount_total AS amount_minor, currency, 'stripe' AS source,
             stripe_session_id AS ref, payment_status AS status, email
      FROM donations
    )
    UNION ALL
    (
      SELECT created_at, local_amount AS amount_minor, local_currency AS currency, 'coinbase' AS source,
             charge_code AS ref, status, email
      FROM coinbase_donations
    )
    ORDER BY created_at DESC
    LIMIT 200
  `
  const { rows } = await db.execute(q as unknown as any)

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Recent Donations (Unified)</h1>
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Currency</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Reference</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-500">No donations yet.</td></tr>
            ) : rows.map((r: unknown, i: number) => {
              const row = r as { created_at: string; amount_minor: number; currency: string; source: string; ref: string; status: string; email: string | null }
              return (
              <tr key={`${row.source}-${row.ref}-${i}`} className="border-t">
                <td className="px-4 py-3 whitespace-nowrap">{when(row.created_at)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{money(row.amount_minor, row.currency)}</td>
                <td className="px-4 py-3">{(row.currency || '').toUpperCase()}</td>
                <td className="px-4 py-3">{row.source}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">{row.email ?? '—'}</td>
                <td className="px-4 py-3 font-mono">{row.ref}</td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  )
}
