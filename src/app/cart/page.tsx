'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react'

interface CartItem {
  id: number
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  quantity: number
  discount: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Mithril Candles',
      description: 'Malt Packs Bay Wax Candle by Miorish',
      price: 999,
      originalPrice: 1499,
      image: '/images/CardImage.jpg',
      quantity: 2,
      discount: 33
    },
    {
      id: 2,
      name: 'Lavender Essence',
      description: 'Premium Lavender Scented Candle',
      price: 899,
      originalPrice: 1299,
      image: '/images/CardImage.jpg',
      quantity: 1,
      discount: 30
    },
    {
      id: 3,
      name: 'Vanilla Dream',
      description: 'Classic Vanilla Aromatic Candle',
      price: 799,
      originalPrice: 1099,
      image: '/images/CardImage.jpg',
      quantity: 1,
      discount: 27
    }
  ])

  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const applyPromoCode = () => {
    if (promoCode.trim()) {
      setAppliedPromo(promoCode)
      // Logic to apply promo code discount
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  )
  const shipping = subtotal > 2000 ? 0 : 99
  const promoDiscount = appliedPromo ? 100 : 0
  const total = subtotal + shipping - promoDiscount

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-secondary">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs md:text-sm mb-6">
            <Link href="/" className="text-accent hover:underline">Home</Link>
            <span className="text-gray-400">{'>'}</span>
            <span className="text-dark">Shopping Cart</span>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
                <ShoppingBag size={48} className="text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven&apos;t added anything to your cart yet</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/" className="text-accent hover:underline">Home</Link>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-dark">Shopping Cart</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-dark">Shopping Cart</h1>
          <span className="text-sm md:text-base text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 bg-secondary rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-semibold text-dark mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg md:text-xl font-bold text-dark">
                            ₹{item.price}
                          </span>
                          <span className="text-xs md:text-sm text-gray-400 line-through">
                            ₹{item.originalPrice}
                          </span>
                          <span className="text-xs md:text-sm text-green-600 font-semibold">
                            {item.discount}% Off
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-accent rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 md:p-2.5 hover:bg-accent/10 transition-colors text-accent"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 md:px-6 text-sm md:text-base font-medium text-accent min-w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 md:p-2.5 hover:bg-accent/10 transition-colors text-accent"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Subtotal</p>
                        <p className="text-lg md:text-xl font-bold text-dark">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-accent hover:underline font-medium text-sm md:text-base"
            >
              <ArrowRight size={18} className="rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-dark mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                    />
                  </div>
                  <button
                    onClick={applyPromoCode}
                    className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <Tag size={12} />
                    Code &quot;{appliedPromo}&quot; applied!
                  </p>
                )}
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
                {appliedPromo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Promo Discount</span>
                    <span className="font-medium text-green-600">-₹{promoDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">You Save</span>
                  <span className="font-bold text-green-600">₹{totalSavings}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-dark">Total</span>
                <span className="text-2xl font-bold text-accent">₹{total}</span>
              </div>

              {/* Free Shipping Notice */}
              {shipping > 0 && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-6">
                  <div className="flex items-start gap-2">
                    <Truck size={16} className="text-accent mt-0.5 shrink-0" />
                    <p className="text-xs text-dark">
                      Add items worth ₹{2000 - subtotal} more to get{' '}
                      <span className="font-semibold text-accent">FREE shipping</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Link href="/checkout">
                <button className="w-full bg-accent text-white py-3 rounded-lg font-semibold text-base hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg mb-3">
                  Proceed to Checkout
                </button>
              </Link>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
              <Truck size={24} className="text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-dark text-sm">Free Shipping</h3>
              <p className="text-xs text-gray-600">On orders above ₹2000</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-dark text-sm">Secure Payment</h3>
              <p className="text-xs text-gray-600">100% secure transactions</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-dark text-sm">Easy Returns</h3>
              <p className="text-xs text-gray-600">7 days return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
