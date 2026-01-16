'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Loader2 } from 'lucide-react'
import AccountSidebar from '@/components/layout/AccountSidebar'
import { profileAPI } from '@/services/profileService'
// import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
  // const { user } = useAuth()
  const [deleteReason, setDeleteReason] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadTwoFactorStatus()
  }, [])

  const loadTwoFactorStatus = async () => {
    try {
      const response = await profileAPI.getTwoFactorStatus()
      setTwoFactorEnabled(response.isTwoFactorAuthEnable)
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      console.error(error.response?.data?.message || 'Failed to load 2FA status')
    }
  }

  const handleToggle2FA = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await profileAPI.toggleTwoFactorAuth({ enable: !twoFactorEnabled })
      
      if (response.success) {
        setTwoFactorEnabled(!twoFactorEnabled)
        setSuccess(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`)
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Failed to toggle 2FA')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-8 md:px-25 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/" className="text-accent hover:underline">Home</Link>
          <span className="text-gray-400">{'>'}</span>
          <Link href="/account" className="text-accent hover:underline">My Account</Link>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-dark">Account Settings</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <AccountSidebar activePage="settings" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-serif text-dark mb-8">Account Settings</h1>

              {/* Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              {/* Security Section */}
              {/* <section className="mb-8">
                <h2 className="text-xl font-semibold text-dark mb-4">Security</h2>
                
                <div className="border border-gray-200 rounded p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-accent/10 rounded">
                      <Shield size={24} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-dark mb-1">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600">
                            {twoFactorEnabled 
                              ? 'Your account has an extra layer of security.' 
                              : 'Add extra protection to your account.'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
                          twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">
                        When enabled, you&apos;ll need to enter a verification code each time you sign in.
                      </p>
                      <button
                        onClick={handleToggle2FA}
                        disabled={isLoading}
                        className={`px-6 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm ${
                          twoFactorEnabled
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-accent text-white hover:bg-opacity-90'
                        }`}
                      >
                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                        {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                      </button>
                    </div>
                  </div>
                </div>
              </section> */}

              {/* Delete Account Section */}
              <section>
                <h2 className="text-xl font-semibold text-dark mb-4">Delete Account</h2>
                
                <div className="border border-gray-200 rounded p-6">
                  <p className="text-sm text-gray-700 mb-4">
                    Submitting this request will notify our support team. Your account will not be deleted immediately — we&apos;ll follow up shortly to confirm.
                  </p>
                  
                  <div className="mb-6">
                    <label htmlFor="deleteReason" className="block text-sm font-medium text-dark mb-2">
                      Reason for deletion
                    </label>
                    <select 
                      id="deleteReason"
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 text-gray-700"
                    >
                      <option value="">Select reason</option>
                      <option value="not-using">Not using the service anymore</option>
                      <option value="privacy">Privacy concerns</option>
                      <option value="alternative">Found an alternative</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <button 
                    disabled={!deleteReason}
                    className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                  >
                    Request Account Deletion
                  </button>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
