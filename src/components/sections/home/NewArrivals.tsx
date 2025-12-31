'use client'
import React, { useState } from "react";
import ProductCard from "@/components/card/ProductCard";
import { type Product } from "@/services/productService"
import { addToWishlist, removeFromWishlistByProductId } from "@/services/wishlistService"
import { useAuth } from "@/contexts/AuthContext"
import toast from "react-hot-toast"

interface NewArrivalsProps {
  products: Product[]
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set())
  const { user } = useAuth()

  const handleWishlistToggle = async (productId: number) => {
    if (!user) {
      toast.error('Please login to add items to wishlist')
      return
    }

    console.log('Toggling wishlist for product:', productId, 'type:', typeof productId)

    try {
      if (wishlistItems.has(productId)) {
        await removeFromWishlistByProductId(productId)
        setWishlistItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
        toast.success('Removed from wishlist')
      } else {
        await addToWishlist(productId)
        setWishlistItems(prev => new Set(prev).add(productId))
        toast.success('Added to wishlist')
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to update wishlist'
      toast.error(message)
    }
  }

  if (!products || products.length === 0) {
    return null; // Don't render if no products
  }

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-dark">
            New Arrivals
          </h2>
          <a
            href="/categories"
            className="text-accent hover:underline text-sm md:text-base"
          >
            View More →
          </a>
        </div>
        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[45%] snap-start">
              <ProductCard
                productId={product.id}
                image={product.coverImageUrl || "/images/CardImage.jpg"}
                title={product.productName}
                description={product.productDescription}
                originalPrice={product.productPrice}
                discountedPrice={product.productDiscountPrice}
                discount={product.productDiscountPercentage}
                availableStock={product.availableStockQuantity}
                onWishlistToggle={() => handleWishlistToggle(product.id)}
                isInWishlist={wishlistItems.has(product.id)}
              />
            </div>
          ))}
        </div>
        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              image={product.coverImageUrl || "/images/CardImage.jpg"}
              title={product.productName}
              description={product.productDescription}
              originalPrice={product.productPrice}
              discountedPrice={product.productDiscountPrice}
              discount={product.productDiscountPercentage}
              availableStock={product.availableStockQuantity}
              onWishlistToggle={() => handleWishlistToggle(product.id)}
              isInWishlist={wishlistItems.has(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
