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
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <Heart className="w-4 h-4 fill-current" />
        <span className="text-sm font-medium">Support Us</span>
      </button>
      
      <DonationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
