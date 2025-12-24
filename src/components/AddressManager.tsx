'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, MapPin, Loader2, Pencil, Trash2, Check } from 'lucide-react'
import AccountSidebar from '@/components/AccountSidebar'
import { 
  getUserAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress,
  type Address,
  type CreateAddressData 
} from '@/services/addressService'

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<CreateAddressData>({
    recipientName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phoneNumber: '',
    type: 'home',
    isDefault: false
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await getUserAddresses()
      setAddresses(response.addresses)
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingId) {
        await updateAddress(editingId, formData)
      } else {
        await addAddress(formData)
      }
      
      await fetchAddresses()
      resetForm()
    } catch (error) {
      console.error('Error saving address:', error)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingId(address.id)
    setFormData({
      recipientName: address.recipientName,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phoneNumber: address.phoneNumber,
      type: address.type,
      isDefault: address.isDefault
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id)
        await fetchAddresses()
      } catch (error) {
        console.error('Error deleting address:', error)
      }
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress(id)
      await fetchAddresses()
    } catch (error) {
      console.error('Error setting default address:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      recipientName: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phoneNumber: '',
      type: 'home',
      isDefault: false
    })
    setEditingId(null)
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
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
          <AccountSidebar activePage="address" />

          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-serif text-dark">Shipping Addresses</h1>
                <button 
                  onClick={() => {
                    resetForm()
                    setShowAddForm(!showAddForm)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-opacity-90 transition-colors text-sm"
                >
                  <Plus size={18} />
                  {showAddForm ? 'Cancel' : 'Add Address'}
                </button>
              </div>

              {/* Add/Edit Form */}
              {showAddForm && (
                <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                  <h2 className="text-xl font-semibold mb-4">
                    {editingId ? 'Edit Address' : 'Add New Address'}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Recipient Name *</label>
                        <input
                          type="text"
                          name="recipientName"
                          value={formData.recipientName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Street Address *</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Postal Code *</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Country *</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Address Type</label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          <option value="home">Home</option>
                          <option value="office">Office</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-accent"
                          />
                          <span className="text-sm">Set as default address</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-accent text-white rounded hover:bg-opacity-90 transition-colors"
                      >
                        {editingId ? 'Update Address' : 'Save Address'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Saved Addresses */}
              {addresses.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No addresses saved yet</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-6 py-2 bg-accent text-white rounded hover:bg-opacity-90 transition-colors"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`border rounded-lg p-4 ${
                        address.isDefault ? 'border-accent bg-accent/5' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-dark">{address.recipientName}</h3>
                            {address.isDefault && (
                              <span className="px-2 py-0.5 bg-accent text-white text-xs rounded">Default</span>
                            )}
                            {address.type && (
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded capitalize">
                                {address.type}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.phoneNumber}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(address)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(address.id)}
                            className="p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">
                        {address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}
                      </p>

                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-sm text-accent hover:underline flex items-center gap-1"
                        >
                          <Check size={14} />
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
