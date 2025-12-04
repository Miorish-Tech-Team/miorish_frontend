'use client'

import Link from 'next/link'
import AccountSidebar from '@/components/AccountSidebar'

export default function MyAccountPage() {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-8 md:px-25 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/" className="text-accent hover:underline">Home</Link>
          <span className="text-gray-400">{'>'}</span>
          <Link href="/account" className="text-accent hover:underline">My Account</Link>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-dark">My Profile</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <AccountSidebar activePage="profile" />

          {/* Main Content - My Profile Section */}
          <main className="lg:col-span-3">
            {/* Empty - as shown in design */}
          </main>
        </div>
      </div>
    </div>
  )
}
