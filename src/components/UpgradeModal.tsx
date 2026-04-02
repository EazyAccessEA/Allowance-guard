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
        <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
          <Lock className="w-7 h-7 text-primary-600 dark:text-primary-400" />
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {feature} is a {requiredPlan} Feature
        </h3>

        <p className="text-sm text-text-secondary leading-relaxed">
          Upgrade to the <span className="font-medium text-primary-600 dark:text-primary-400">{requiredPlan} plan</span>{' '}
          {requiredPlan === 'Pro' ? 'starting at $9.99/month ' : 'starting at $49.99/month '}
          to unlock {feature.toLowerCase()}, plus continuous monitoring, batch revocation, and more.
        </p>
      </div>
    </Modal>
  )
}
