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
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cobalt hover:bg-cobalt/90 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cobalt/30"
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
