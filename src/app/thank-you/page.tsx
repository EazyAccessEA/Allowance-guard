import Image from 'next/image'
import { CheckCircle, Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600">
            Your donation helps us keep Allowance Guard free and secure for everyone.
          </p>
        </div>

        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-pink-700">
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-sm font-medium">Your support makes a difference</span>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Allowance Guard
          </Link>
          
          <p className="text-xs text-gray-500">
            You should receive a receipt via email shortly.
          </p>
        </div>
      </div>
    </div>
  )
}
