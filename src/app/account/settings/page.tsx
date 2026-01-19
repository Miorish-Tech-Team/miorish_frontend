'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Loader2, Mail, Smartphone, Eye, EyeOff } from 'lucide-react'
import AccountSidebar from '@/components/layout/AccountSidebar'
import { profileAPI } from '@/services/profileService'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function SettingsPage() {
  const [deleteReason, setDeleteReason] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorMethod, setTwoFactorMethod] = useState<'email' | 'authenticator'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)
  
  // 2FA Toggle Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'authenticator'>('email')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)

  useEffect(() => {
    loadTwoFactorStatus()
  }, [])

  const loadTwoFactorStatus = async () => {
    try {
      setIsLoadingStatus(true)
      const response = await profileAPI.getTwoFactorStatus()
      setTwoFactorEnabled(response.isTwoFactorAuthEnable)
      setTwoFactorMethod(response.twoFactorMethod || 'email')
      setSelectedMethod(response.twoFactorMethod || 'email')
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      console.error(error.response?.data?.message || 'Failed to load 2FA status')
      toast.error('Failed to load 2FA status')
    } finally {
      setIsLoadingStatus(false)
    }
  }

  const handleOpenModal = () => {
    setPassword('')
    setShowPassword(false)
    setQrCode(null)
    setSecret(null)
    setShowPasswordModal(true)
  }

  const handleCloseModal = () => {
    setShowPasswordModal(false)
    setPassword('')
    setQrCode(null)
    setSecret(null)
  }

  const handleToggle2FA = async () => {
    if (!password) {
      toast.error('Password is required')
      return
    }

    setIsLoading(true)

    try {
      const response = await profileAPI.toggleTwoFactorAuth({ 
        enable: !twoFactorEnabled,
        password,
        method: selectedMethod
      })
      
      if (response.success) {
        setTwoFactorEnabled(!twoFactorEnabled)
        setTwoFactorMethod(selectedMethod)
        
        // If enabling authenticator, show QR code
        if (!twoFactorEnabled && selectedMethod === 'authenticator' && response.qrCode) {
          setQrCode(response.qrCode)
          setSecret(response.secret || null)
          toast.success('Scan the QR code with your authenticator app')
        } else {
          handleCloseModal()
          toast.success(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`)
        }
        
        await loadTwoFactorStatus()
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Failed to toggle 2FA')
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

              {/* Security Section */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-dark mb-4">Security</h2>
                
                {isLoadingStatus ? (
                  <div className="border border-gray-200 rounded p-6 flex items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-accent" />
                  </div>
                ) : (
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
                                ? `Your account has an extra layer of security via ${twoFactorMethod}.` 
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
                          onClick={handleOpenModal}
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
                )}
              </section>

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

      {/* Password Modal for 2FA */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-dark mb-4">
                {twoFactorEnabled ? 'Disable' : 'Enable'} Two-Factor Authentication
              </h2>

              {!qrCode ? (
                <>
                  {/* Method Selection (only when enabling) */}
                  {!twoFactorEnabled && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-dark mb-3">
                        Choose Authentication Method
                      </label>
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => setSelectedMethod('email')}
                          className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${
                            selectedMethod === 'email'
                              ? 'border-accent bg-accent/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Mail size={24} className="text-accent" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-dark">Email</div>
                            <div className="text-xs text-gray-500">
                              Receive codes via email
                            </div>
                          </div>
                          {selectedMethod === 'email' && (
                            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedMethod('authenticator')}
                          className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${
                            selectedMethod === 'authenticator'
                              ? 'border-accent bg-accent/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Smartphone size={24} className="text-accent" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-dark">Authenticator App</div>
                            <div className="text-xs text-gray-500">
                              Use Google Authenticator or similar
                            </div>
                          </div>
                          {selectedMethod === 'authenticator' && (
                            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Password Input */}
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
                      Confirm Your Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-dark"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleToggle2FA}
                      disabled={isLoading || !password}
                      className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading && <Loader2 size={18} className="animate-spin" />}
                      Confirm
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* QR Code Display */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="flex justify-center mb-4">
                      <Image
                        src={qrCode}
                        alt="QR Code"
                        width={200}
                        height={200}
                        className="border-2 border-gray-200 rounded-lg p-2"
                      />
                    </div>
                    {secret && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-xs text-gray-500 mb-1">Or enter this code manually:</p>
                        <p className="font-mono text-sm text-dark break-all">{secret}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCloseModal}
                    className="w-full px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
