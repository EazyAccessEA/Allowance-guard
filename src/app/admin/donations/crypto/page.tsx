import { db } from '@/db'
import { coinbaseDonations } from '@/db/schema'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

function formatMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format((amountMinor || 0) / 100)
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleString()
}

export default async function AdminCryptoDonationsPage() {
  const rows = await db
    .select()
    .from(coinbaseDonations)
    .orderBy(desc(coinbaseDonations.createdAt))
    .limit(200)

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Crypto Contributions (Coinbase)</h1>

      <section className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Charge</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Currency</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Hosted</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No crypto contributions yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.chargeCode} className="border-t">
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3 font-mono">{r.chargeCode}</td>
                  <td className="px-4 py-3">{r.status}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatMoney(r.localAmount, r.localCurrency)}</td>
                  <td className="px-4 py-3">{r.localCurrency}</td>
                  <td className="px-4 py-3">{r.email ?? '—'}</td>
                  <td className="px-4 py-3">
                    {r.hostedUrl ? (
                      <a className="text-blue-600 underline" href={r.hostedUrl} target="_blank" rel="noreferrer">
                        open
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}
