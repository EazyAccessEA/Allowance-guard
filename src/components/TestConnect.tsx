'use client'
export default function TestConnect({ onConnect }:{ onConnect:(addr:string)=>void }) {
  if (process.env.NEXT_PUBLIC_E2E !== '1') return null
  const addr = '0x1111111111111111111111111111111111111111'
  return (
    <button
      data-testid="test-connect"
      onClick={() => onConnect(addr)}
      className="rounded border px-3 py-2 text-sm"
      aria-label="Connect test wallet"
    >
      Connect Test Wallet
    </button>
  )
}
