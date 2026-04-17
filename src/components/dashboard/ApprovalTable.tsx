'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { RISK_CONFIG, CHAIN_COLORS, type Approval } from './mock-data'

interface ApprovalTableProps {
 approvals: Approval[]
 selectedIds: Set<string>
 onToggle: (id: string) => void
 onToggleAll: () => void
 onRevoke: (id: string) => void
 isTimeMachine?: boolean
}

export default function ApprovalTable({
 approvals,
 selectedIds,
 onToggle,
 onToggleAll,
 onRevoke,
 isTimeMachine = false,
}: ApprovalTableProps) {
 const allSelected = approvals.length > 0 && approvals.every((a) => selectedIds.has(a.id))

 if (approvals.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center py-16 text-center">
 <div className="w-16 h-16 rounded-full bg-paper-sub flex items-center justify-center mb-4">
 <span className="text-2xl" aria-hidden="true">🛡️</span>
 </div>
 <p className="text-lg font-semibold text-ink">
 No approvals found
 </p>
 <p className="text-sm text-ink-whisper mt-1">
 {isTimeMachine
 ? 'All risky approvals resolved in this simulation.'
 : 'Try adjusting your filters or scan a wallet.'}
 </p>
 </div>
 )
 }

 return (
 <>
 {/* Desktop table */}
 <div className="hidden md:block overflow-x-auto">
 <table className="w-full text-sm" role="grid">
 <thead>
 <tr className="border-b border-ink-rule">
 <th className="w-10 py-3 px-2 text-left">
 <input
 type="checkbox"
 checked={allSelected}
 onChange={onToggleAll}
 aria-label="Select all approvals"
 className="h-4 w-4 rounded border-ink-rule text-amber-deep focus:ring-amber-deep0"
 />
 </th>
 <th className="py-3 px-3 text-left font-medium text-ink-whisper uppercase tracking-wide text-xs">
 Token
 </th>
 <th className="py-3 px-3 text-left font-medium text-ink-whisper uppercase tracking-wide text-xs">
 Spender
 </th>
 <th className="py-3 px-3 text-left font-medium text-ink-whisper uppercase tracking-wide text-xs">
 Amount
 </th>
 <th className="py-3 px-3 text-left font-medium text-ink-whisper uppercase tracking-wide text-xs">
 Risk
 </th>
 <th className="py-3 px-3 text-left font-medium text-ink-whisper uppercase tracking-wide text-xs">
 Chain
 </th>
 <th className="py-3 px-3 text-left font-medium text-ink-whisper uppercase tracking-wide text-xs">
 Last Active
 </th>
 <th className="py-3 px-3 text-right font-medium text-ink-whisper uppercase tracking-wide text-xs">
 Action
 </th>
 </tr>
 </thead>
 <tbody>
 {approvals.map((approval) => {
 const risk = RISK_CONFIG[approval.risk]
 const isSelected = selectedIds.has(approval.id)
 const isDimmed =
 isTimeMachine &&
 (approval.risk === 'high' || approval.risk === 'critical')

 return (
 <tr
 key={approval.id}
 className={cn(
 'border-b border-ink-rule/50 transition-all duration-150',
 'hover:bg-paper-sub ',
 isSelected && 'bg-paper-sub/50 ',
 isDimmed && 'opacity-30 pointer-events-none'
 )}
 >
 <td className="py-3 px-2">
 <input
 type="checkbox"
 checked={isSelected}
 onChange={() => onToggle(approval.id)}
 aria-label={`Select ${approval.tokenSymbol} approval`}
 className="h-4 w-4 rounded border-ink-rule text-amber-deep focus:ring-amber-deep0"
 />
 </td>
 <td className="py-3 px-3">
 <div className="flex items-center gap-2">
 <span className="font-semibold text-ink">
 {approval.tokenSymbol}
 </span>
 <span className="text-xs text-ink-muted hidden lg:inline">
 {approval.token}
 </span>
 </div>
 </td>
 <td className="py-3 px-3">
 <div>
 <span className="font-mono text-xs text-ink">
 {approval.spender}
 </span>
 {approval.spenderLabel && (
 <span className="block text-xs text-ink-muted mt-0.5">
 {approval.spenderLabel}
 </span>
 )}
 </div>
 </td>
 <td className="py-3 px-3">
 <span
 className={cn(
 'font-mono text-sm',
 approval.isUnlimited
 ? 'text-semantic-error-600 font-semibold'
 : 'text-ink'
 )}
 >
 {approval.amount}
 </span>
 </td>
 <td className="py-3 px-3">
 <span
 className={cn(
 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
 risk.className
 )}
 >
 <span aria-hidden="true">{risk.icon}</span>
 {risk.label}
 </span>
 </td>
 <td className="py-3 px-3">
 <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
 <span
 className="w-2 h-2 rounded-full flex-shrink-0"
 style={{
 backgroundColor: CHAIN_COLORS[approval.chain] || '#94A3B8',
 }}
 aria-hidden="true"
 />
 {approval.chain}
 </span>
 </td>
 <td className="py-3 px-3 text-xs text-ink-whisper">
 {approval.lastActive}
 </td>
 <td className="py-3 px-3 text-right">
 <button
 onClick={() => onRevoke(approval.id)}
 className="px-3 py-1 rounded-md text-xs font-medium text-semantic-error-600 border border-semantic-error-200 hover:bg-semantic-error-50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-error-500 focus-visible:ring-offset-2"
 aria-label={`Revoke ${approval.tokenSymbol} approval`}
 >
 Revoke
 </button>
 </td>
 </tr>
 )
 })}
 </tbody>
 </table>
 </div>

 {/* Mobile cards */}
 <div className="md:hidden space-y-3">
 {approvals.map((approval) => {
 const risk = RISK_CONFIG[approval.risk]
 const isSelected = selectedIds.has(approval.id)
 const isDimmed =
 isTimeMachine &&
 (approval.risk === 'high' || approval.risk === 'critical')

 return (
 <div
 key={approval.id}
 className={cn(
 'p-4 rounded-lg border transition-all duration-150',
 'border-ink-rule',
 'bg-paper ',
 isSelected && 'border-amber-deep/40 bg-paper-sub/30 ',
 isDimmed && 'opacity-30 pointer-events-none'
 )}
 >
 <div className="flex items-start justify-between mb-3">
 <div className="flex items-center gap-2">
 <input
 type="checkbox"
 checked={isSelected}
 onChange={() => onToggle(approval.id)}
 aria-label={`Select ${approval.tokenSymbol}`}
 className="h-4 w-4 rounded border-ink-rule text-amber-deep focus:ring-amber-deep0"
 />
 <span className="font-semibold text-ink">
 {approval.tokenSymbol}
 </span>
 <span
 className={cn(
 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
 risk.className
 )}
 >
 <span aria-hidden="true">{risk.icon}</span>
 {risk.label}
 </span>
 </div>
 <span className="inline-flex items-center gap-1 text-xs text-ink-whisper">
 <span
 className="w-2 h-2 rounded-full"
 style={{ backgroundColor: CHAIN_COLORS[approval.chain] || '#94A3B8' }}
 aria-hidden="true"
 />
 {approval.chain}
 </span>
 </div>
 <div className="grid grid-cols-2 gap-2 text-xs mb-3">
 <div>
 <span className="text-ink-muted">Spender</span>
 <p className="font-mono text-ink mt-0.5">
 {approval.spender}
 </p>
 </div>
 <div>
 <span className="text-ink-muted">Amount</span>
 <p
 className={cn(
 'font-mono mt-0.5',
 approval.isUnlimited
 ? 'text-semantic-error-600 font-semibold'
 : 'text-ink'
 )}
 >
 {approval.amount}
 </p>
 </div>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs text-ink-muted">
 {approval.lastActive}
 </span>
 <button
 onClick={() => onRevoke(approval.id)}
 className="px-3 py-1.5 rounded-md text-xs font-medium text-semantic-error-600 border border-semantic-error-200 hover:bg-semantic-error-50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-error-500"
 aria-label={`Revoke ${approval.tokenSymbol} approval`}
 >
 Revoke
 </button>
 </div>
 </div>
 )
 })}
 </div>
 </>
 )
}
