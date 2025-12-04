'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, MapPinned } from 'lucide-react'
import AccountSidebar from '@/components/AccountSidebar'

export default function AddressPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    district: '',
    pin: '',
    state: '',
    phone: ''
  })

  const savedAddresses = [
    {
      id: 1,
      address: 'IIEST, Shibpur',
      city: 'Shibpur',
      district: 'Howrah',
      state: 'West Bengal',
      phone: '+91 9999999999',
      pin: '711103',
      isDefault: true
    }
  ]

  const handleUseCurrentLocation = () => {
    // Implement geolocation
    console.log('Using current location')
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
          <span className="text-dark">Manage Address</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <AccountSidebar activePage="address" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-serif text-dark">Shipping Address</h1>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-opacity-90 transition-colors text-sm"
                >
                  <Plus size={18} />
                  Add Address
                </button>
              </div>

              {/* Saved Addresses */}
              <div className="space-y-4 mb-8">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Address</p>
                          <p className="text-sm font-medium text-dark">{addr.address}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">City</p>
                          <p className="text-sm font-medium text-dark">{addr.city}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">District</p>
                          <p className="text-sm font-medium text-dark">{addr.district}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">State</p>
                          <p className="text-sm font-medium text-dark">{addr.state}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Phone</p>
                          <p className="text-sm font-medium text-dark">{addr.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Pin</p>
                          <p className="text-sm font-medium text-dark">{addr.pin}</p>
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-2">
                        <button className="px-4 py-1.5 bg-accent text-white rounded text-xs hover:bg-opacity-90 transition-colors">
                          Edit
                        </button>
                        {addr.isDefault && (
                          <span className="px-4 py-1.5 bg-gray-100 text-accent rounded text-xs text-center">
                            Default Address
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Address Form */}
              {showAddForm && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-serif text-dark mb-4">Add New Address</h2>
                  
                  <button 
                    onClick={handleUseCurrentLocation}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded text-sm mb-6 hover:bg-opacity-90 transition-colors"
                  >
                    <MapPinned size={18} />
                    Use My current Location
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">District</label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">PIN</label>
                      <input
                        type="text"
                        value={formData.pin}
                        onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Phone</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button 
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button className="px-6 py-2 bg-accent text-white rounded hover:bg-opacity-90 transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
