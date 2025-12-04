'use client'

import { useState } from 'react'
import Link from 'next/link'
import AccountSidebar from '@/components/AccountSidebar'

export default function SettingsPage() {
  const [deleteReason, setDeleteReason] = useState('')

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-8 md:px-25 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/" className="text-accent hover:underline">Home</Link>
          <span className="text-gray-400">{'>'}</span>
          <Link href="/account" className="text-accent hover:underline">My Account</Link>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-dark">Manage Address</span>
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
                
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
                  <div>
                    <h3 className="font-medium text-dark mb-1">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Not enabled - Add extra protection to your account.</p>
                  </div>
                  <button className="mt-4 md:mt-0 px-6 py-2 bg-accent text-white rounded hover:bg-opacity-90 transition-colors text-sm">
                    Enable 2 FA
                  </button>
                </div>
              </section>

              {/* Delete Account Section */}
              <section>
                <h2 className="text-xl font-semibold text-dark mb-4">Delete Account</h2>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <p className="text-sm text-gray-700 mb-4">
                    Submitting this request will notify our support team. Your account will not be deleted immediately — we'll follow up shortly to confirm.
                  </p>
                  
                  <div className="mb-6">
                    <select 
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 text-gray-500"
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
                    className="px-6 py-2 bg-accent text-white rounded hover:bg-opacity-90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Request for Delete Account
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
