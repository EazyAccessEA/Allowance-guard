'use client'

import { useState, useCallback, useMemo } from 'react'
import { Heart, Coffee } from 'lucide-react'
import DonationModal from './DonationModal'

interface DonationButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export default function DonationButton({ 
  variant = 'primary',
  size = 'md',
  className = '',
  showIcon = true,
  children
}: DonationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
  
  const variantClasses = useMemo(() => ({
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25 focus:ring-4 focus:ring-primary-600/20",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 focus:ring-4 focus:ring-slate-300/20",
    ghost: "text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:ring-4 focus:ring-slate-300/20"
  }), [])
  
  const sizeClasses = useMemo(() => ({
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  }), [])

  const handleOpenModal = useCallback(() => setIsModalOpen(true), [])
  const handleCloseModal = useCallback(() => setIsModalOpen(false), [])

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        {showIcon && <Heart className="w-4 h-4" />}
        {children || 'Support Us'}
      </button>

      <DonationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  )
}

// Alternative coffee-themed button
export function CoffeeButton({ className = '' }: { className?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 transition-colors ${className}`}
      >
        <Coffee className="w-4 h-4" />
        Buy us a coffee
      </button>

      <DonationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}