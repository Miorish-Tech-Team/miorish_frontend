'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Loader2, ShoppingCart, Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useAuthModal } from '@/contexts/AuthModalContext'
import AccountSidebar from '@/components/layout/AccountSidebar'
import { WishlistItemSkeleton } from '@/components/skeleton'
import { useCart } from '@/contexts/CartContext'
import { getProductById } from '@/services/productService'
import type { Product } from '@/services/productService'

export default function WishlistPage() {
  const { user } = useAuth()
  const { openLoginModal } = useAuthModal()
  const { wishlist, loading, refreshWishlist, removeFromWishlist: removeFromWishlistContext, wishlistCount, localWishlist } = useWishlist()
  const { addToCart, localCart } = useCart()
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set())
  const [guestProductDetails, setGuestProductDetails] = useState<Map<number, Product>>(new Map())
  const [loadingProducts, setLoadingProducts] = useState(false)

  useEffect(() => {
    // For non-logged-in users, fetch product details
    if (!user && localWishlist.length > 0) {
      const fetchProductDetails = async () => {
        setLoadingProducts(true)
        const productMap = new Map<number, Product>()
        
        for (const item of localWishlist) {
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
      
      fetchProductDetails()
    }
  }, [user, localWishlist])

  const handleRemove = async (productId: number) => {
    try {
      setRemovingIds(prev => new Set(prev).add(productId))
      await removeFromWishlistContext(productId)
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1)
      // Remove from wishlist after adding to cart (context handles both logged-in and guest)
      await handleRemove(productId)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  // wishlistItems is used for logged-in users (with full Product data from API)
  const wishlistItems = wishlist

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-8 md:px-25 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/" className="text-accent hover:underline">Home</Link>
          <span className="text-gray-400">{'>'}</span>
          {user && <Link href="/account" className="text-accent hover:underline">My Account</Link>}
          {user && <span className="text-gray-400">{'>'}</span>}
          <span className="text-dark">Wishlist</span>
        </div>

        <div className={`grid grid-cols-1 ${user ? 'lg:grid-cols-4' : ''} gap-6`}>
          {/* Sidebar - Only show for authenticated users */}
          {user && <AccountSidebar activePage="wishlist" />}

          {/* Main Content */}
          <main className={user ? 'lg:col-span-3' : ''}>
            <div className="bg-white rounded-lg">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl md:text-3xl font-serif text-dark">Wishlist</h1>
                <p className="text-sm text-gray-600 mt-2">
                  {user ? `${wishlistItems.length} item(s) in your wishlist` : `${localWishlist.length} item(s) in your wishlist`}
                </p>
              </div>

              {/* Loading State */}
              {loading && user ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Price</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(4)].map((_, i) => (
                        <WishlistItemSkeleton key={i} />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (user && wishlistItems.length === 0) || (!user && localWishlist.length === 0) ? (
                <div className="text-center py-20">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 text-lg font-medium mb-2">Your wishlist is empty</p>
                  <p className="text-gray-500 text-sm mb-6">Add items you love to your wishlist</p>
                  <Link href="/categories" className="inline-block px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium">
                    Browse Products
                  </Link>
                </div>
              ) : (
                /* Wishlist Table */
                <div className="overflow-x-auto">
                 

                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Price</th>
                        {user && <th className="px-6 py-4 text-center text-sm font-semibold text-dark">Actions</th>}
                        {!user && <th className="px-6 py-4 text-center text-sm font-semibold text-dark">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Authenticated user - show full wishlist */}
                      {user && wishlistItems.map((item) => {
                        const product = item.Product
                        const price = product.productDiscountPrice || product.productPrice
                        const isRemoving = removingIds.has(product.id)
                        
                        return (
                          <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <Link href={`/product/${product.id}`}>
                                <div className="flex items-center gap-4 cursor-pointer hover:text-accent transition-colors">
                                  <div className="relative w-16 h-16 bg-secondary rounded-lg overflow-hidden shrink-0">
                                    <Image 
                                      src={product.coverImageUrl} 
                                      alt={product.productName}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-dark text-sm md:text-base  mb-1">
                                      {product.productName}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-500 line-clamp-2">{product.productDescription}</p>
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex text-sm md:text-base flex-col gap-1">
                                <span className="text-dark font-medium">₹{price.toFixed(2)}</span>
                                {product.productDiscountPrice && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{product.productPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex text-sm md:text-base items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleAddToCart(product.id)
                                  }}
                                  disabled={isRemoving || product.availableStockQuantity === 0}
                                  className="flex items-center gap-1.5 min-w-[115px] max-h-8 px-4 py-2 bg-accent text-white rounded text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
    
                                  {product.availableStockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleRemove(product.id)
                                  }}
                                  disabled={isRemoving}
                                  className="p-2 text-dark hover:bg-dark/10 cursor-pointer rounded transition-colors disabled:opacity-50"
                                >
                                  {isRemoving ? (
                                    <Loader2 size={18} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={18} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}

                      {/* Guest user - show full product details */}
                      {!user && localWishlist.map((item, index) => {
                        const product = guestProductDetails.get(item.productId)
                        
                        if (loadingProducts || !product) {
                          return (
                            <tr key={index} className="border-b border-gray-200 animate-pulse">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                                  <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="h-10 bg-gray-300 rounded w-32 mx-auto"></div>
                              </td>
                            </tr>
                          )
                        }
                        
                        const price = product.productDiscountPrice || product.productPrice
                        
                        return (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <Link href={`/product/${product.id}`}>
                                <div className="flex items-center gap-4 cursor-pointer hover:text-accent transition-colors">
                                  <div className="relative w-16 h-16 bg-secondary rounded-lg overflow-hidden shrink-0">
                                    <Image 
                                      src={product.coverImageUrl} 
                                      alt={product.productName}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-sm md:text-base text-dark  mb-1">
                                      {product.productName}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-500 line-clamp-2">{product.productDescription}</p>
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex text-sm md:text-base flex-col gap-1">
                                <span className="text-dark font-medium">₹{price.toFixed(2)}</span>
                                {product.productDiscountPrice && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{product.productPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex  text-sm md:text-base items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleAddToCart(product.id)
                                  }}
                                  disabled={product.availableStockQuantity === 0}
                                  className="flex items-center gap-1.5 min-w-[115px] px-4 py-2 bg-accent text-white rounded text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                 
                                  {product.availableStockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleRemove(product.id)
                                  }}
                                  className="p-2 text-dark hover:bg-dark/10 cursor-pointer rounded transition-colors"
                                  aria-label="Remove from wishlist"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
