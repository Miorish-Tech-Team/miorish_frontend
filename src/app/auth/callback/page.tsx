'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { profileAPI } from '@/services/profileService'
import toast from 'react-hot-toast'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Token is now stored in httpOnly cookie, no need to access it manually
        // Just fetch user profile - the cookie will be sent automatically
        const response = await profileAPI.getProfile()
        
        if (response.success && response.user) {
          login(response.user)
          toast.success('Successfully signed in!')
          router.push('/')
        } else {
          setError('Failed to fetch user profile')
          toast.error('Authentication failed')
          setTimeout(() => router.push('/auth/login'), 2000)
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('Authentication failed. Redirecting to login...')
        toast.error('Authentication failed')
        setTimeout(() => router.push('/auth/login'), 2000)
      }
    }

    handleCallback()
  }, [router, login])

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {error ? (
          <div>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-dark mb-2">Authentication Failed</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : (
          <div>
            <Loader2 className="w-16 h-16 text-accent animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-dark mb-2">Completing Sign In</h2>
            <p className="text-gray-600">Please wait while we complete your authentication...</p>
          </div>
        )}
      </div>
    </div>
  )
}
