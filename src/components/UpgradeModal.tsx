'use client'

import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Lock, Sparkles } from 'lucide-react'

export interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
  requiredPlan?: string
}

export default function UpgradeModal({ isOpen, onClose, feature, requiredPlan = 'Pro' }: UpgradeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Maybe Later
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              window.location.href = '/pricing'
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            View Plans
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center py-2">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 ring-1 ring-amber-500/20 flex items-center justify-center mb-4">
          <Lock className="w-7 h-7 text-amber-deep" />
        </div>

        <h3 className="text-lg font-semibold text-ink mb-2">
          Unlock {feature}
        </h3>

        <p className="text-sm text-ink-muted leading-relaxed">
          {feature} is available on the{' '}
          <span className="font-medium text-amber-deep">{requiredPlan} plan</span>
          {requiredPlan === 'Pro' ? ' starting at $9.99/mo' : ' starting at $49.99/mo'}.
          Includes continuous monitoring, batch revoke, and more.
        </p>
      </div>
    </Modal>
  )
}
