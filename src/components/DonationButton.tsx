'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import DonationModal from './DonationModal'

export default function DonationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fireart-button bg-gradient-to-r from-crimson to-pink-500 hover:from-crimson-hover hover:to-pink-600"
      >
        <Heart className="w-4 h-4 fill-current" />
        <span>Support Us</span>
      </button>
      
      <DonationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
