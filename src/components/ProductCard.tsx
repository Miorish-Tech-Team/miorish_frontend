'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Minus, Plus } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { addToWishlist } from '@/services/wishlistService'
import { toast } from 'react-hot-toast'

interface ProductCardProps {
  image: string
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  discount: number
  productId?: number | string
}

export default function ProductCard({ 
  image, 
  title, 
  description, 
  originalPrice, 
  discountedPrice, 
  discount,
  productId = 1
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)
      await addToCart(Number(productId), quantity)
      // Reset quantity after adding
      setQuantity(1)
    } catch (error) {
      // Error already handled in context
      console.error('Add to cart error:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await addToWishlist(Number(productId))
      toast.success('Added to wishlist!')
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message
      if (message?.includes('already in wishlist')) {
        toast('Already in wishlist', { icon: 'ℹ️' })
      } else {
        toast.error(message || 'Failed to add to wishlist')
      }
    }
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1))
  }
  return (
    <div className="p-2 border-2 border-accent rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image - Clickable */}
      <Link href={`/product/${productId}`}>
        <div className="relative aspect-square bg-secondary cursor-pointer">
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover rounded-lg"
          />
          <button 
            className="bg-foreground absolute top-2 right-2 md:top-3 md:right-3 rounded-full p-1.5 md:p-2 transition-colors"
            onClick={handleAddToWishlist}
          >
            <Heart size={16} className="text-accent md:w-[22px] md:h-[22px] cursor-pointer hover:text-dark transition-colors" />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 md:p-4">
        <Link href={`/product/${productId}`}>
          <h3 className="font-semibold text-sm md:text-lg text-dark mb-1 hover:text-accent cursor-pointer transition-colors">{title}</h3>
        </Link>
        <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">{description}</p>
        
        {/* Price */}
        <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3 flex-wrap">
          <span className="text-base md:text-lg font-bold text-dark">₹{discountedPrice}</span>
          <span className="text-xs md:text-sm text-gray-400 line-through">₹{originalPrice}</span>
          <span className="text-xs md:text-sm text-green-600 font-semibold">{discount}% Off</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-accent rounded">
            <button 
              onClick={decrementQuantity}
              className="p-1.5 md:p-2 hover:bg-accent/10 transition-colors text-accent cursor-pointer"
            >
              <Minus size={12} className="md:w-3.5 md:h-3.5" />
            </button>
            <span className="px-2 md:px-3 text-xs md:text-sm text-accent">{quantity}</span>
            <button 
              onClick={incrementQuantity}
              className="p-1.5 md:p-2 hover:bg-accent/10 transition-colors text-accent cursor-pointer"
            >
              <Plus size={12} className="md:w-3.5 md:h-3.5" />
            </button>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="flex-1 bg-accent text-white py-1.5 md:py-2 px-3 md:px-4 rounded text-xs md:text-sm font-medium hover:bg-opacity-90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingToCart ? 'Adding...' : 'ADD'}
          </button>
        </div>
      </div>
    </div>
  )
}
