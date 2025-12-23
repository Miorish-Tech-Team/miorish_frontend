'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Plus, Check, ChevronRight, Package, MapPinned } from 'lucide-react'

interface CartItem {
  id: number
  name: string
  image: string
  price: number
  quantity: number
}

interface Address {
  id: number
  address: string
  city: string
  district: string
  state: string
  phone: string
  pin: string
  isDefault?: boolean
}

export default function CheckoutPage() {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    district: '',
    pin: '',
    state: '',
    phone: ''
  })

  // Mock cart items - In production, fetch from state/API
  const cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Mithril Candles',
      image: '/images/CardImage.jpg',
      price: 999,
      quantity: 2
    },
    {
      id: 2,
      name: 'Lavender Essence',
      image: '/images/CardImage.jpg',
      price: 899,
      quantity: 1
    }
  ]

  // Mock saved addresses
  const savedAddresses: Address[] = [
    {
      id: 1,
      address: 'IIEST, Shibpur',
      city: 'Shibpur',
      district: 'Howrah',
      state: 'West Bengal',
      phone: '+91 9999999999',
      pin: '711103',
      isDefault: true
    },
    {
      id: 2,
      address: '123 Park Street',
      city: 'Kolkata',
      district: 'Kolkata',
      state: 'West Bengal',
      phone: '+91 8888888888',
      pin: '700016'
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 2000 ? 0 : 99
  const total = subtotal + shipping

  const handleAddAddress = () => {
    // Add new address logic here
    console.log('Adding new address:', formData)
    setShowAddForm(false)
    setFormData({
      address: '',
      city: '',
      district: '',
      pin: '',
      state: '',
      phone: ''
    })
  }

  const handleContinueToPayment = () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address')
      return
    }
    // Navigate to payment page or show payment options
    console.log('Continue to payment with address:', selectedAddressId)
    alert('Proceeding with selected address. Payment integration coming soon!')
  }

  const handleUseCurrentLocation = () => {
    // Implement geolocation
    console.log('Using current location')
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/" className="text-accent hover:underline">Home</Link>
          <span className="text-gray-400">{'>'}</span>
          <Link href="/cart" className="text-accent hover:underline">Cart</Link>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-dark">Checkout</span>
        </div>

        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-dark mb-6">Checkout</h1>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                <Check size={16} />
              </div>
              <span className="text-sm font-medium text-dark hidden sm:inline">Cart</span>
            </div>
            <div className="flex-1 h-0.5 bg-accent mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm font-medium text-accent hidden sm:inline">Address</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm font-medium text-gray-500 hidden sm:inline">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Address Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                  <MapPin className="text-accent" size={24} />
                  Select Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                >
                  <Plus size={18} />
                  Add New
                </button>
              </div>

              {/* Saved Addresses */}
              <div className="space-y-4">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-accent/50'
                    }`}
                    onClick={() => setSelectedAddressId(addr.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Radio Button */}
                      <div className="mt-1">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedAddressId === addr.id
                              ? 'border-accent bg-accent'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedAddressId === addr.id && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                      </div>

                      {/* Address Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-dark">{addr.address}</h3>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {addr.city}, {addr.district}, {addr.state} - {addr.pin}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <span className="font-medium">Phone:</span> {addr.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Address Form */}
              {showAddForm && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-dark mb-4">Add New Address</h3>

                  <button
                    onClick={handleUseCurrentLocation}
                    className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm mb-4 hover:bg-accent/20 transition-colors"
                  >
                    <MapPinned size={18} />
                    Use My Current Location
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-dark mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="House No., Building Name, Street"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Enter city"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        District <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        placeholder="Enter district"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="Enter state"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pin}
                        onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                        placeholder="Enter PIN code"
                        maxLength={6}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 XXXXXXXXXX"
                        maxLength={13}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => {
                        setShowAddForm(false)
                        setFormData({
                          address: '',
                          city: '',
                          district: '',
                          pin: '',
                          state: '',
                          phone: ''
                        })
                      }}
                      className="px-6 py-2.5 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAddress}
                      className="px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                <Package size={22} className="text-accent" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 shrink-0 bg-secondary rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-dark truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-dark mt-1">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-dark">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-dark">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-dark">Total</span>
                <span className="text-2xl font-bold text-accent">₹{total}</span>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinueToPayment}
                disabled={!selectedAddressId}
                className={`w-full py-3 rounded-lg font-semibold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                  selectedAddressId
                    ? 'bg-accent text-white hover:bg-opacity-90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Payment
                <ChevronRight size={20} />
              </button>

              {!selectedAddressId && (
                <p className="text-xs text-red-500 text-center mt-2">
                  Please select a delivery address
                </p>
              )}

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>

        {/* Back to Cart */}
        <div className="mt-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-accent hover:underline font-medium text-sm"
          >
            <ChevronRight size={18} className="rotate-180" />
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  )
}
