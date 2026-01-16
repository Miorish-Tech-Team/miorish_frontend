'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CartItemSkeleton } from '@/components/skeleton'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2, Loader2, ShoppingBag, ChevronRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthModal } from '@/contexts/AuthModalContext'
import AccountSidebar from '@/components/layout/AccountSidebar'
import ClearCartModal from '@/components/modals/ClearCartModal'
import { getProductById } from '@/services/productService'
import type { Product } from '@/services/productService'

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { openLoginModal } = useAuthModal()
  const { cart, summary, loading, updateQuantity, removeItem, clearCart, localCart } = useCart()
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set())
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set())
  const [showClearModal, setShowClearModal] = useState(false)
  const [guestProductDetails, setGuestProductDetails] = useState<Map<number, Product>>(new Map())
  const [loadingProducts, setLoadingProducts] = useState(false)

  // Load cart for guest users from context
  useEffect(() => {
    if (!user) {
      // For non-logged-in users, cart is already in context via localCart
      // Just fetch product details if there are items
      const fetchProductDetails = async () => {
        setLoadingProducts(true)
        const productMap = new Map<number, Product>()
        
        for (const item of localCart) {
          try {
            const response = await getProductById(item.productId)
            if (response.success && response.product) {
              productMap.set(item.productId, response.product)
            }
          } catch (error) {
            console.error(`Failed to fetch product ${item.productId}:`, error)
          }
        }
        
        setGuestProductDetails(productMap)
        setLoadingProducts(false)
      }
      
      if (localCart.length > 0) {
        fetchProductDetails()
      }
    }
  }, [user, localCart])

  const handleQuantityChange = async (itemId: number, newQuantity: number, maxStock: number) => {
    if (newQuantity < 1 || newQuantity > maxStock) return
    
    setUpdatingItems(prev => new Set(prev).add(itemId))
    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
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
    } catch (error) {
      console.error('Error removing item:', error)
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

  if (loading && user) {
    return (
      <div className="min-h-screen bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-4 md:py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-accent hover:underline font-medium">Home</Link>
            <ChevronRight size={16} className="text-gray-400" />
            {user && <Link href="/account" className="text-accent hover:underline font-medium">My Account</Link>}
            {user && <ChevronRight size={16} className="text-gray-400" />}
            <span className="text-gray-700 font-medium">Cart</span>
          </div>

          <div className={`grid grid-cols-1 ${user ? 'lg:grid-cols-4' : ''} gap-4 md:gap-6`}>
            {/* Sidebar - Only show for authenticated users */}
            {user && (
              <div className="lg:col-span-1">
                <AccountSidebar activePage="cart" />
              </div>
            )}

            {/* Main Content */}
            <div className={user ? 'lg:col-span-3' : ''}>
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

  // Determine cart items based on user authentication
  const cartItems = user ? (cart?.CartItems || []) : []
  const isEmpty = user ? cartItems.length === 0 : localCart.length === 0

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-accent hover:underline font-medium">Home</Link>
          <ChevronRight size={16} className="text-gray-400" />
          {user && <Link href="/account" className="text-accent hover:underline font-medium">My Account</Link>}
          {user && <ChevronRight size={16} className="text-gray-400" />}
          <span className="text-gray-700 font-medium">Cart</span>
        </div>

        {isEmpty ? (
          <div className={`grid grid-cols-1 ${user ? 'lg:grid-cols-4' : ''} gap-4 md:gap-6`}>
            {/* Sidebar - Only show for authenticated users */}
            {user && (
              <div className="lg:col-span-1">
                <AccountSidebar activePage="cart" />
              </div>
            )}

            {/* Main Content */}
            <div className={user ? 'lg:col-span-3' : ''}>
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
          <div className={`grid grid-cols-1 ${user ? 'lg:grid-cols-4' : ''} gap-4 md:gap-6`}>
            {/* Sidebar - Only show for authenticated users */}
            {user && (
              <div className="lg:col-span-1">
                <AccountSidebar activePage="cart" />
              </div>
            )}

            {/* Main Content with Cart Items */}
            <div className={user ? 'lg:col-span-3' : ''}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Cart Items ({user ? summary.totalItems : localCart.reduce((sum, item) => sum + item.quantity, 0)} items)
                      </h2>
                      {user && (
                        <button
                          type="button"
                          onClick={() => setShowClearModal(true)}
                          className="text-sm text-dark/80 hover:text-dark font-medium cursor-pointer"
                        >
                          Clear Cart
                        </button>
                      )}
                    </div>

                    {/* Guest User - Show localStorage items with message */}
                    {/* {!user && localCartItems.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Sign in</strong> to view product details and complete your purchase.
                        </p>
                      </div>
                    )} */}

                    <div className="space-y-4">
                      {/* Authenticated user - show full cart */}
                      {user && cartItems.map((item) => {
                        const isUpdating = updatingItems.has(item.id)
                        const isRemoving = removingItems.has(item.id)
                        const product = item.Product

                        return (
                          <div
                            key={item.id}
                            className={`flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg transition-opacity ${
                              isRemoving ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="flex gap-4 flex-1 min-w-0">
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

                                {/* Quantity Controls & Delete */}
                                <div className="flex items-center justify-between sm:justify-start gap-4 mt-3">
                                  <div className="flex items-center border text-accent border-accent rounded">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleQuantityChange(item.id, item.quantity - 1, product.availableStockQuantity)
                                      }}
                                      disabled={item.quantity <= 1 || isUpdating}
                                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Minus size={16} />
                                    </button>
                                    <span className="px-4 text-sm font-medium min-w-10 text-center">
                                      {isUpdating ? <Loader2 size={16} className="animate-spin mx-auto" /> : item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleQuantityChange(item.id, item.quantity + 1, product.availableStockQuantity)
                                      }}
                                      disabled={item.quantity >= product.availableStockQuantity || isUpdating}
                                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Plus size={16} />
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handleRemoveItem(item.id)
                                    }}
                                    disabled={isRemoving}
                                    className="flex items-center justify-center h-9 w-9 rounded-full text-dark hover:bg-gray-100 hover:scale-105 transition-transform duration-200 disabled:opacity-50 cursor-pointer"
                                    aria-label="Remove item from cart"
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

                                {/* Mobile Item Total */}
                                <div className="mt-3 sm:hidden flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Item total</span>
                                  <span className="font-semibold text-gray-900">
                                    Rs.{item.totalPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Desktop Item Total */}
                            <div className="hidden sm:flex flex-col items-end justify-between text-right shrink-0">
                              <p className="font-semibold text-gray-900">
                                Rs.{item.totalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        )
                      })}

                      {/* Guest user - show full product details from API */}
                      {!user && localCart.map((item, index) => {
                        const product = guestProductDetails.get(item.productId)
                        
                        if (loadingProducts || !product) {
                          return (
                            <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 animate-pulse">
                              <div className="w-20 h-20 bg-gray-300 rounded"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                              </div>
                            </div>
                          )
                        }
                        
                        return (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex gap-4 flex-1 min-w-0">
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

                                {/* Quantity Controls & Delete for Guest */}
                                <div className="flex items-center justify-between sm:justify-start gap-4 mt-3">
                                  <div className="flex items-center border text-accent border-accent rounded">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        if (item.quantity > 1) {
                                          updateQuantity(item.productId, item.quantity - 1, item.productId, item.selectedSize, item.selectedColor)
                                        }
                                      }}
                                      disabled={item.quantity <= 1}
                                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Minus size={16} />
                                    </button>
                                    <span className="px-4 text-sm font-medium min-w-10 text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        if (item.quantity < product.availableStockQuantity) {
                                          updateQuantity(item.productId, item.quantity + 1, item.productId, item.selectedSize, item.selectedColor)
                                        }
                                      }}
                                      disabled={item.quantity >= product.availableStockQuantity}
                                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Plus size={16} />
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      removeItem(item.productId, item.productId, item.selectedSize, item.selectedColor)
                                    }}
                                    className="flex items-center justify-center h-9 w-9 rounded-full text-dark hover:bg-gray-100 hover:scale-105 transition-transform duration-200 cursor-pointer"
                                    aria-label="Remove item from cart"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>

                                {/* Stock Warning */}
                                {product.availableStockQuantity < 5 && (
                                  <p className="text-xs text-orange-600 mt-2">
                                    Only {product.availableStockQuantity} left in stock
                                  </p>
                                )}

                                {/* Size & Color Display */}
                                {(item.selectedSize || item.selectedColor) && (
                                  <div className="mt-2 flex gap-3 text-sm text-gray-600">
                                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                                  </div>
                                )}

                                {/* Mobile Item Total */}
                                <div className="mt-3 sm:hidden flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Item total</span>
                                  <span className="font-semibold text-gray-900">
                                    Rs.{((product.productDiscountPrice || product.productPrice) * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Desktop Item Total */}
                            <div className="hidden sm:flex flex-col items-end justify-between text-right shrink-0">
                              <p className="font-semibold text-gray-900">
                                Rs.{((product.productDiscountPrice || product.productPrice) * item.quantity).toFixed(2)}
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

                    {user ? (
                      <>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal ({summary.totalItems} items)</span>
                            <span>Rs.{summary.totalPrice.toFixed(2)}</span>
                          </div>
                          <div className="border-t pt-3 flex justify-between font-semibold text-lg text-gray-900">
                            <span>Total</span>
                            <span className="text-accent">Rs.{summary.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleCheckout}
                          className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                        >
                          Proceed to Checkout
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3 mb-4">
                          <p className="text-sm text-gray-600">
                            {localCart.reduce((sum, item) => sum + item.quantity, 0)} items in cart
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            sessionStorage.setItem('redirectAfterLogin', '/cart')
                            openLoginModal()
                          }}
                          className="block w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors text-center cursor-pointer"
                        >
                          Sign In to Continue
                        </button>
                      </>
                    )}

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

      {/* Clear Cart Confirmation Modal - Only for authenticated users */}
      {user && (
        <ClearCartModal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          onConfirm={clearCart}
          itemCount={summary.totalItems}
        />
      )}
    </div>
  )
}
