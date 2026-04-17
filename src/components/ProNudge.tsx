'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Bell, Layers, FileDown, Mail, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProNudgeProps {
 variant: 'monitoring' | 'batch-revoke' | 'export' | 'alerts'
 className?: string
}

const nudgeConfig = {
 monitoring: {
 icon: Bell,
 message: 'Unlock continuous monitoring — get alerted when new approvals appear',
 borderColor: 'border-l-primary-500',
 iconColor: 'text-amber-deep ',
 bgColor: 'bg-paper-sub ',
 },
 'batch-revoke': {
 icon: Layers,
 message: 'Unlock batch revoke — clear multiple approvals in one transaction',
 borderColor: 'border-l-semantic-info-500',
 iconColor: 'text-semantic-info-600 ',
 bgColor: 'bg-semantic-info-50 ',
 },
 export: {
 icon: FileDown,
 message: 'Unlock audit export — download your security report as PDF or CSV',
 borderColor: 'border-l-semantic-success-500',
 iconColor: 'text-semantic-success-600 ',
 bgColor: 'bg-semantic-success-50 ',
 },
 alerts: {
 icon: Mail,
 message: 'Unlock email alerts — get notified when risky approvals are detected',
 borderColor: 'border-l-semantic-warning-500',
 iconColor: 'text-semantic-warning-600 ',
 bgColor: 'bg-semantic-warning-50 ',
 },
} as const

export const ProNudge: React.FC<ProNudgeProps> = ({ variant, className }) => {
 const [dismissed, setDismissed] = useState(false)

 if (dismissed) {
 return null
 }

 const config = nudgeConfig[variant]
 const Icon = config.icon

 return (
 <div
 className={cn(
 'relative flex items-center gap-3 rounded-md border border-l-4 px-4 py-3',
 config.borderColor,
 config.bgColor,
 'border-neutral-200 ',
 className
 )}
 role="complementary"
 aria-label={`Pro feature: ${config.message}`}
 >
 <Icon className={cn('h-5 w-5 shrink-0', config.iconColor)} />

 <p className="flex-1 text-sm text-ink-soft">{config.message}</p>

 <Link
 href="/pricing"
 className="shrink-0 text-sm font-medium text-amber-deep transition-colors duration-150 hover:text-amber-deep hover:underline"
 >
 See plans
 </Link>

 <button
 onClick={() => setDismissed(true)}
 className="shrink-0 rounded-full p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 transition-colors duration-150 hover:bg-neutral-200 hover:text-ink-muted"
 aria-label="Dismiss nudge"
 >
 <X className="h-3.5 w-3.5" />
 </button>
 </div>
 )
}

export default ProNudge
