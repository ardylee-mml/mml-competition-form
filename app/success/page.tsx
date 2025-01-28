'use client'

import Link from 'next/link'

export default function SuccessPage() {
  const handleClose = () => {
    window.close()
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-cyan-400">Application Submitted Successfully!</h1>
          <div className="space-y-4 text-gray-300">
            <p>Thank you for applying to the MML Game Development Competition!</p>
            <p>A confirmation email has been sent to your email address.</p>
            <p>Please check your inbox (and spam folder) for further instructions.</p>
          </div>
          <button 
            onClick={handleClose}
            className="mt-8 inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
          >
            Close Window
          </button>
        </div>
      </main>
    </div>
  )
} 