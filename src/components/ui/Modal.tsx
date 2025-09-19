'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button } from './Button'

// Professional modal variants following design system
const modalVariants = cva(
  // Base styles - centered, responsive, accessible
  'fixed inset-0 z-50 flex items-center justify-center p-4',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        default: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-full',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const modalContentVariants = cva(
  'relative w-full rounded-base bg-white p-6 shadow-large animate-modal-in',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        default: 'max-w-md', // 480px as per design system
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-full mx-4 sm:mx-auto',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export interface ModalProps
  extends VariantProps<typeof modalVariants> {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  footer?: React.ReactNode
  className?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size,
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
  className,
}) => {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 animate-fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className={cn(modalVariants({ size }))}>
        <div
          className={cn(modalContentVariants({ size }), className)}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
        >
          {/* Header */}
          {(title || description || showCloseButton) && (
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                {title && (
                  <h2 
                    id="modal-title"
                    className="text-xl font-semibold text-text-primary"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p 
                    id="modal-description"
                    className="mt-1 text-sm text-text-secondary"
                  >
                    {description}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 text-text-muted hover:text-text-primary"
                  aria-label="Close modal"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              )}
            </div>
          )}
          
          {/* Content */}
          {children && (
            <div className="mb-4 last:mb-0">
              {children}
            </div>
          )}
          
          {/* Footer */}
          {footer && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-border-default">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Confirmation Modal Component
export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const getConfirmVariant = () => {
    switch (variant) {
      case 'danger':
        return 'destructive'
      case 'warning':
        return 'primary'
      case 'info':
        return 'primary'
      default:
        return 'primary'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmVariant()}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    />
  )
}

export { Modal, modalVariants }
