// /src/app/admin/donations/page.tsx
import { db } from '@/db'
import { sql } from 'drizzle-orm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type SearchParams = { page?: string; per?: string }

function formatMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountMinor / 100)
}

function formatDate(d: string) {
  return new Date(d).toLocaleString()
}

export default async function AdminDonationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Math.max(parseInt(params?.page ?? '1', 10) || 1, 1)
  const per = Math.min(Math.max(parseInt(params?.per ?? '20', 10) || 20, 1), 100)
  const offset = (page - 1) * per

  // total count for pagination
  const countRes = await db.execute(sql`SELECT COUNT(*)::int AS c FROM donations`)
  const total = (countRes.rows?.[0]?.c as number) ?? 0
  const totalPages = Math.max(Math.ceil(total / per), 1)

  // rows for this page
  const rows = await db.execute(sql`
    SELECT * FROM donations 
    ORDER BY created_at DESC 
    LIMIT ${per} OFFSET ${offset}
  `)

  // basic analytics
  const metrics = await db.execute(sql`
    WITH agg AS (
      SELECT
        COUNT(*)::int                                      AS count_all,
        COALESCE(SUM(amount_total), 0)::int               AS sum_all,
        COALESCE(AVG(amount_total), 0)::numeric           AS avg_all,
        COALESCE(SUM(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN amount_total END), 0)::int AS sum_7d
      FROM donations
    ),
    by_currency AS (
      SELECT currency, COUNT(*)::int AS cnt, COALESCE(SUM(amount_total),0)::int AS sum
      FROM donations
      GROUP BY currency
      ORDER BY sum DESC
    )
    SELECT
      (SELECT row_to_json(agg) FROM agg) AS agg,
      (SELECT json_agg(by_currency) FROM by_currency) AS by_currency
  `)

  const agg = (metrics.rows?.[0]?.agg as { count_all: number; sum_all: number; avg_all: number; sum_7d: number }) || { count_all: 0, sum_all: 0, avg_all: 0, sum_7d: 0 }
  const byCurrency = (metrics.rows?.[0]?.by_currency as Array<{ currency: string; cnt: number; sum: number }>) || []

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
                <h1 className="text-2xl font-semibold">Contributions</h1>
          <p className="text-sm text-gray-600">
            Recent contributions with simple analytics. This page is dynamic and queries Neon directly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/donations/export"
            className="rounded-md border px-3 py-2 hover:bg-gray-50"
          >
            Download CSV
          </a>
          <Link
            href="/contribute"
            className="rounded-md bg-cobalt px-3 py-2 text-white hover:bg-cobalt/90"
          >
                  Test Contribution
          </Link>
        </div>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border p-4">
          <div className="text-xs text-gray-500">Total count</div>
          <div className="mt-1 text-2xl font-semibold">{agg.count_all}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-gray-500">Sum last 7 days</div>
          <div className="mt-1 text-2xl font-semibold">
            {byCurrency.length === 1
              ? formatMoney(agg.sum_7d, byCurrency[0].currency)
              : `${(agg.sum_7d / 100).toFixed(2)} (mixed)`}
          </div>
        </div>
        <div className="rounded-xl border p-4">
                 <div className="text-xs text-gray-500">Average contribution</div>
          <div className="mt-1 text-2xl font-semibold">
            {byCurrency.length === 1
              ? formatMoney(Number(agg.avg_all), byCurrency[0].currency)
              : `${(Number(agg.avg_all) / 100).toFixed(2)} (mixed)`}
          </div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-gray-500">Currencies</div>
          <div className="mt-1 text-sm">
            {byCurrency.length === 0
              ? '—'
              : byCurrency.map((c) => `${c.currency.toUpperCase()}: ${(c.sum / 100).toFixed(2)} (${c.cnt})`).join('  ·  ')}
          </div>
        </div>
      </section>

      <section className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Currency</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Session ID</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {!rows.rows || rows.rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                         No contributions yet.
                </td>
              </tr>
            ) : (
              rows.rows.map((r: Record<string, unknown>) => (
                <tr key={String(r.stripeSessionId)} className="border-t">
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(String(r.createdAt))}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatMoney(Number(r.amountTotal), String(r.currency))}</td>
                  <td className="px-4 py-3">{String(r.currency)?.toUpperCase()}</td>
                  <td className="px-4 py-3">{r.email ? String(r.email) : '—'}</td>
                  <td className="px-4 py-3">{r.payerName ? String(r.payerName) : '—'}</td>
                  <td className="px-4 py-3 font-mono">{String(r.stripeSessionId)}</td>
                  <td className="px-4 py-3">{String(r.paymentStatus)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <nav className="mt-6 flex items-center justify-between">
        <div className="text-xs text-gray-600">
          Page {page} of {totalPages} • {total} total
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/donations?page=${Math.max(page - 1, 1)}&per=${per}`}
            className="rounded-md border px-3 py-2 hover:bg-gray-50"
            aria-disabled={page <= 1}
          >
            Previous
          </Link>
          <Link
            href={`/admin/donations?page=${Math.min(page + 1, totalPages)}&per=${per}`}
            className="rounded-md border px-3 py-2 hover:bg-gray-50"
            aria-disabled={page >= totalPages}
          >
            Next
          </Link>
        </div>
      </nav>
    </main>
  )
}
