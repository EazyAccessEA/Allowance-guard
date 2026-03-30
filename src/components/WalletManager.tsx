'use client'

import { useEffect, useMemo, useState } from 'react'
import { load, save } from '@/lib/storage'
import { HexButton } from './HexButton'

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
        <input className="flex-1 px-3 py-2 bg-input border-2 border-border text-text font-mono placeholder-muted-foreground focus:border-primary focus:outline-none rounded-full"
               placeholder="0x... address" value={addr} onChange={e => setAddr(e.target.value)} />
        <input className="flex-1 px-3 py-2 bg-input border-2 border-border text-text placeholder-muted-foreground focus:border-primary focus:outline-none rounded-full"
               placeholder="Label (optional)" value={label} onChange={e => setLabel(e.target.value)} />
        <HexButton onClick={add}>Save</HexButton>
      </div>

      {saved.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            className="px-3 py-2 bg-input border-2 border-border text-text font-mono focus:border-primary focus:outline-none rounded-full"
            value={selected ?? ''}
            onChange={(e) => onSelect(e.target.value)}
          >
            {saved.map(s => (
              <option key={s.address} value={s.address}>{s.label} — {s.address.slice(0,10)}…</option>
            ))}
          </select>
          {current && (
            <HexButton variant="ghost" onClick={() => remove(current.address)}>
              Remove
            </HexButton>
          )}
        </div>
      )}
    </section>
  )
}
