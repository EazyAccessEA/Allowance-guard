'use client'
import { useEffect, useState } from 'react'

type Cat = { id: number; name: string; description?: string; icon?: string; color?: string; tokenCount: number }

export default function CategoriesAdminPage() {
  const [cats, setCats] = useState<Cat[]>([])
  const [name, setName] = useState('')

  const load = async () => {
    const res = await fetch('/api/tokens/categories', { cache: 'no-store' })
    const j = await res.json()
    setCats(j.data || [])
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    if (!name.trim()) return
    await fetch('/api/tokens/categories', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name })
    })
    setName('')
    load()
  }

  const del = async (id: number) => {
    await fetch(`/api/tokens/categories/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Token Categories</h1>

      <div className="flex gap-2 mb-6">
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="New category name" className="border px-3 py-2 rounded w-full" />
        <button onClick={add} className="px-4 py-2 rounded bg-black text-white">Add</button>
      </div>

      <ul className="space-y-2">
        {cats.map(c => (
          <li key={c.id} className="border rounded px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">{c.icon ?? '🏷️'}</span>
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-500">{c.tokenCount} tokens</div>
              </div>
            </div>
            <button onClick={() => del(c.id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
