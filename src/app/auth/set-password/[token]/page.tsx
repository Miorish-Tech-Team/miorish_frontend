'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Eye, EyeOff, Lock, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { authAPI } from '@/services/authService'
import toast from 'react-hot-toast'
import CandleLoader from '@/components/CandleLoader'

function SetPasswordForm() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    // Validate token on mount
    const validateToken = async () => {
      if (!token) {
        toast.error('Invalid reset link')
        router.push('/auth/login')
        return
      }

      try {
        setIsValidating(true)
        // Token validation will happen when submitting
        setIsTokenValid(true)
      } catch (error) {
        toast.error('Invalid or expired reset link')
        setTimeout(() => {
          router.push('/auth/forgot-password')
        }, 2000)
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    if (!token) {
      toast.error('Invalid reset token')
      return
    }

    setIsLoading(true)

    try {
      await authAPI.resetPasswordFromUrl(token, formData.password)
      setIsReset(true)
      toast.success('Password reset successfully!')
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      const errorMessage = error.response?.data?.message || 'Failed to reset password'
      toast.error(errorMessage)
      
      // If token is invalid or expired, redirect to forgot password
      if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        setTimeout(() => {
          router.push('/auth/forgot-password')
        }, 2000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isValidating) {
    return <CandleLoader />
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-center">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-dark mb-2">Invalid Link</h1>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link 
              href="/auth/forgot-password"
              className="inline-block bg-accent text-white px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {!isReset ? (
            <>
              {/* Header */}
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-dark mb-2">Set New Password</h1>
                <p className="text-sm md:text-base text-gray-600">
                  Create a strong password for your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {/* New Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-dark text-sm md:text-base"
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 6 characters long
                  </p>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-dark text-sm md:text-base"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent text-white py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 size={20} className="animate-spin" />}
                  Reset Password
                </button>
              </form>

              {/* Back to Login */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-accent font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-dark mb-2">Password Reset!</h1>
                <p className="text-sm md:text-base text-gray-600 mb-6">
                  Your password has been successfully reset.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Redirecting to login page...
                </p>
                <Link 
                  href="/auth/login"
                  className="inline-block bg-accent text-white px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Go to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<CandleLoader />}>
      <SetPasswordForm />
    </Suspense>
  )
}
