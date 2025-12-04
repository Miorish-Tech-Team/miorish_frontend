'use client'

import { useState } from 'react'
import Link from 'next/link'
import AccountSidebar from '@/components/AccountSidebar'

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [step, setStep] = useState(1) // 1 for email/otp, 2 for password reset

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-8 md:px-25 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/" className="text-accent hover:underline">Home</Link>
          <span className="text-gray-400">{'>'}</span>
          <Link href="/account" className="text-accent hover:underline">My Account</Link>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-dark">Reset Password</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <AccountSidebar activePage="password" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-serif text-dark mb-8">Reset Your Password</h1>

              <div className="max-w-md">
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <input
                        type="email"
                        placeholder="Enter Registered Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm placeholder:text-accent/60"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Enter 6 digit OTP"
                        value={formData.otp}
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                        className="w-full px-4 py-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm placeholder:text-accent/60"
                      />
                    </div>

                    <button 
                      onClick={() => setStep(2)}
                      className="w-full bg-accent text-white py-3 rounded font-medium hover:bg-opacity-90 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <input
                        type="password"
                        placeholder="Enter new Password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm placeholder:text-accent/60"
                      />
                    </div>

                    <div>
                      <input
                        type="password"
                        placeholder="Re-Enter Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm placeholder:text-accent/60"
                      />
                    </div>

                    <button 
                      className="w-full bg-accent text-white py-3 rounded font-medium hover:bg-opacity-90 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
