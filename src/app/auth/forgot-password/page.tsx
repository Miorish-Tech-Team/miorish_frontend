'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password logic here
    console.log('Forgot password for:', email)
    setIsSubmitted(true)
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

          {!isSubmitted ? (
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
                  className="w-full bg-accent text-white py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg"
                >
                  Send Reset Link
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
                <h1 className="text-2xl md:text-3xl font-bold text-dark mb-2">Check Your Email</h1>
                <p className="text-sm md:text-base text-gray-600 mb-6">
                  We've sent a password reset link to
                </p>
                <p className="text-sm md:text-base font-medium text-dark mb-6">
                  {email}
                </p>
                <p className="text-xs md:text-sm text-gray-500 mb-6">
                  Didn't receive the email? Check your spam folder or
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-accent hover:underline font-medium text-sm md:text-base"
                >
                  Try another email address
                </button>
              </div>
            </>
          )}

          {/* Sign In Link */}
          {!isSubmitted && (
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
