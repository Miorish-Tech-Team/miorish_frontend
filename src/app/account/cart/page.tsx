'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CartItemSkeleton } from '@/components/skeleton'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2, Loader2, ShoppingBag, ChevronRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import AccountSidebar from '@/components/layout/AccountSidebar'
import ClearCartModal from '@/components/modals/ClearCartModal'

export default function CartPage() {
  const router = useRouter()
  const { cart, summary, loading, updateQuantity, removeItem, clearCart } = useCart()
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set())
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set())
  const [showClearModal, setShowClearModal] = useState(false)

  const handleQuantityChange = async (itemId: number, newQuantity: number, maxStock: number) => {
    if (newQuantity < 1 || newQuantity > maxStock) return
    
    setUpdatingItems(prev => new Set(prev).add(itemId))
    try {
      await updateQuantity(itemId, newQuantity)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    setRemovingItems(prev => new Set(prev).add(itemId))
    try {
      await removeItem(itemId)
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleCheckout = () => {
    router.push('/checkout?type=cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-4 md:py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-accent hover:underline font-medium">Home</Link>
            <ChevronRight size={16} className="text-gray-400" />
            <Link href="/account" className="text-accent hover:underline font-medium">My Account</Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-700 font-medium">Cart</span>
          </div>



          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AccountSidebar activePage="cart" />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <CartItemSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const cartItems = cart?.CartItems || []
  const isEmpty = cartItems.length === 0

  return (
    <div className="min-h-screen bg-secondary">
   <div className="container mx-auto px-8 md:px-25 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-accent hover:underline font-medium">Home</Link>
          <ChevronRight size={16} className="text-gray-400" />
          <Link href="/account" className="text-accent hover:underline font-medium">My Account</Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-700 font-medium">Cart</span>
        </div>


        {isEmpty ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AccountSidebar activePage="cart" />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg p-8 md:p-12 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some products to get started!</p>
                <Link
                  href="/categories"
                  className="inline-block bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AccountSidebar activePage="cart" />
            </div>

            {/* Main Content with Cart Items */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items ({summary.totalItems} {summary.totalItems === 1 ? 'item' : 'items'})
                  </h2>
                  <button
                    onClick={() => setShowClearModal(true)}
                    className="text-sm text-dark/80 hover:text-dark font-medium cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const isUpdating = updatingItems.has(item.id)
                    const isRemoving = removingItems.has(item.id)
                    const product = item.Product

                    return (
                      <div
                        key={item.id}
                        className={`flex gap-4 p-4 border border-gray-200 rounded-lg transition-opacity ${
                          isRemoving ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Product Image */}
                        <Link href={`/product/${product.id}`} className="shrink-0">
                          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded overflow-hidden">
                            <Image
                              src={product.coverImageUrl}
                              alt={product.productName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-medium text-gray-900 hover:text-accent transition-colors line-clamp-2">
                              {product.productName}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">{product.productBrand}</p>
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-semibold text-accent">
                              Rs.{product.productDiscountPrice || product.productPrice}
                            </span>
                            {product.productDiscountPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                Rs.{product.productPrice}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center border text-accent border-accent rounded">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1, product.availableStockQuantity)}
                                disabled={item.quantity <= 1 || isUpdating}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 text-sm font-medium min-w-10 text-center">
                                {isUpdating ? <Loader2 size={16} className="animate-spin mx-auto" /> : item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1, product.availableStockQuantity)}
                                disabled={item.quantity >= product.availableStockQuantity || isUpdating}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isRemoving}
                              className="text-dark hover:scale-115 transition-transform duration-300 p-2 disabled:opacity-50 cursor-pointer"
                            >
                              {isRemoving ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            </button>
                          </div>

                          {/* Stock Warning */}
                          {product.availableStockQuantity < 5 && (
                            <p className="text-xs text-orange-600 mt-2">
                              Only {product.availableStockQuantity} left in stock
                            </p>
                          )}
                        </div>

                        {/* Item Total */}
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-gray-900">
                            Rs.{item.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({summary.totalItems} items)</span>
                    <span>Rs.{summary.totalPrice.toFixed(2)}</span>
                  </div>
                  {/* <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div> */}
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg text-gray-900">
                    <span>Total</span>
                    <span className="text-accent">Rs.{summary.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/categories"
                  className="block text-center text-accent hover:underline mt-4 text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
            </div>
          </div>
        )}
      </div>

      {/* Clear Cart Confirmation Modal */}
      <ClearCartModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={clearCart}
        itemCount={summary.totalItems}
      />
    </div>
  )
}
