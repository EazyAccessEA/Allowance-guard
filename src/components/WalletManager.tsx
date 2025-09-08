'use client'

import { useEffect, useMemo, useState } from 'react'
import { load, save } from '@/lib/storage'

type Saved = { address: string; label: string }

const KEY = 'ag.savedWallets'
const normalize = (a: string) => a.trim().toLowerCase()

export default function WalletManager({
  selected,
  onSelect,
  onSavedChange
}: {
  selected: string | null
  onSelect: (addr: string) => void
  onSavedChange?: (list: Saved[]) => void
}) {
  const [saved, setSaved] = useState<Saved[]>(() => load<Saved[]>(KEY, []))
  const [addr, setAddr] = useState('')
  const [label, setLabel] = useState('')

  useEffect(() => { onSavedChange?.(saved) }, [saved, onSavedChange])

  function add() {
    const a = normalize(addr)
    if (!/^0x[a-f0-9]{40}$/.test(a)) return alert('Enter a valid 0x address')
    const exists = saved.find(s => s.address === a)
    const next = exists ? saved.map(s => (s.address === a ? { ...s, label: label || s.label } : s)) : [...saved, { address: a, label: label || a.slice(0, 10) }]
    setSaved(next); save(KEY, next); setAddr(''); setLabel('')
    if (!selected) onSelect(a)
  }

  function remove(a: string) {
    const next = saved.filter(s => s.address !== a)
    setSaved(next); save(KEY, next)
    if (selected === a) onSelect(next[0]?.address ?? '')
  }

  const current = useMemo(() => saved.find(s => s.address === selected), [saved, selected])

  return (
    <section className="mt-6 space-y-3">
      <h2 className="text-base font-semibold">Wallets</h2>

      <div className="flex gap-2">
        <input className="input w-[22rem] font-mono"
               placeholder="0x... address" value={addr} onChange={e => setAddr(e.target.value)} />
        <input className="input w-[14rem]"
               placeholder="Label (optional)" value={label} onChange={e => setLabel(e.target.value)} />
        <button onClick={add} className="btn-primary">Save</button>
      </div>

      {saved.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            className="input font-mono"
            value={selected ?? ''}
            onChange={(e) => onSelect(e.target.value)}
          >
            {saved.map(s => (
              <option key={s.address} value={s.address}>{s.label} — {s.address.slice(0,10)}…</option>
            ))}
          </select>
          {current && (
            <button onClick={() => remove(current.address)} className="btn-secondary">
              Remove
            </button>
          )}
        </div>
      )}
    </section>
  )
}
