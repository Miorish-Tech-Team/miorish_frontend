'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Loader2, ShoppingCart } from 'lucide-react'
import AccountSidebar from '@/components/layout/AccountSidebar'
import { WishlistItemSkeleton } from '@/components/skeleton'
import { getUserWishlist, removeFromWishlist, type WishlistItem } from '@/services/wishlistService'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'react-hot-toast'

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set())
  const { addToCart } = useCart()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await getUserWishlist()
      setWishlistItems(response.wishlist)
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (wishlistId: number) => {
    try {
      setRemovingIds(prev => new Set(prev).add(wishlistId))
      await removeFromWishlist([wishlistId])
      setWishlistItems(prev => prev.filter(item => item.id !== wishlistId))
      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove item')
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(wishlistId)
        return newSet
      })
    }
  }

  const handleAddToCart = async (productId: number, wishlistId: number) => {
    try {
      await addToCart(productId, 1)
      // Optionally remove from wishlist after adding to cart
      await handleRemove(wishlistId)
    } catch (error) {
      // Error handled in cart context
      console.error('Error adding to cart:', error)
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
          <span className="text-dark">Wishlist</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <AccountSidebar activePage="wishlist" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl md:text-3xl font-serif text-dark">Wishlist</h1>
                <p className="text-sm text-gray-600 mt-2">{wishlistItems.length} item(s) in your wishlist</p>
              </div>

              {/* Loading State */}
              {loading ? (
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
              ) : wishlistItems.length === 0 ? (
                <div className="text-center py-20">
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
                        <th className="px-6 py-4 text-center text-sm font-semibold text-dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wishlistItems.map((item) => {
                        const product = item.Product
                        const price = product.productDiscountPrice || product.productPrice
                        const isRemoving = removingIds.has(item.id)
                        
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
                                    <h3 className="font-semibold text-dark text-sm mb-1">
                                      {product.productName}
                                    </h3>
                                    <p className="text-xs text-gray-500 line-clamp-2">{product.productDescription}</p>
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-dark font-medium">₹{price.toFixed(2)}</span>
                                {product.productDiscountPrice && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{product.productPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleAddToCart(product.id, item.id)}
                                  disabled={isRemoving || product.availableStockQuantity === 0}
                                  className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <ShoppingCart size={16} />
                                  Add to Cart
                                </button>
                                <button
                                  onClick={() => handleRemove(item.id)}
                                  disabled={isRemoving}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
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
