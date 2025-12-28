'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { authAPI } from '@/services/authService'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authAPI.resetPasswordOtp({ email })
      toast.success('Reset code sent to your email!')
      setStep('otp')
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Failed to send reset code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authAPI.verifyResetOtp({ verificationCode: otp })
      setStep('success')
      toast.success(response.message || 'Code verified! Check your email for reset link.')
      // Don't redirect, show success message to check email
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Invalid or expired code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Back to Login Link */}
          <Link 
            href="/auth/login" 
            className="inline-flex items-center gap-2 text-sm text-accent hover:underline mb-6"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>

          {step === 'email' ? (
            <>
              {/* Header */}
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-dark mb-2">Forgot Password?</h1>
                <p className="text-sm md:text-base text-gray-600">
                  No worries, we'll send you reset instructions
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-dark text-sm md:text-base"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent text-white py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 size={20} className="animate-spin" />}
                  Send Reset Code
                </button>
              </form>
            </>
          ) : step === 'otp' ? (
            <>
              {/* Header */}
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-dark mb-2">Enter Verification Code</h1>
                <p className="text-sm md:text-base text-gray-600">
                  We've sent a 6-digit code to {email}
                </p>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleOtpVerify} className="space-y-4 md:space-y-5">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-dark mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-dark text-center text-lg tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent text-white py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 size={20} className="animate-spin" />}
                  Verify Code
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-accent text-sm hover:underline"
                >
                  Use different email
                </button>
              </form>
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
                <h1 className="text-2xl md:text-3xl font-bold text-dark mb-2">Code Verified!</h1>
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  A password reset link has been sent to your email.
                </p>
                <p className="text-xs md:text-sm text-gray-500 text-center mb-6">
                  Please check your inbox and click the link to reset your password.
                </p>
                <Link 
                  href="/auth/login"
                  className="inline-block text-accent hover:underline text-sm font-medium"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}

          {/* Sign In Link */}
          {step === 'email' && (
            <p className="mt-6 text-center text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-accent font-medium hover:underline">
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
