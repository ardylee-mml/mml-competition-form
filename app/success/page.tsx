'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()

  const handleClose = () => {
    window.close()
    // Fallback to home page if window.close() is blocked
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Application Submitted!</h1>
        <p className="text-gray-300 mb-6">
          Thank you for submitting your application. We will review it and get back to you soon.
        </p>
        <Button
          onClick={handleClose}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded"
        >
          Close Window
        </Button>
      </div>
    </div>
  )
} 