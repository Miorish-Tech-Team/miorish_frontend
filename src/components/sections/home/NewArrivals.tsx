'use client'
import React from "react";
import ProductCard from "@/components/card/ProductCard";
import { type Product } from "@/services/productService"
import { useWishlist } from "@/contexts/WishlistContext"

interface NewArrivalsProps {
  products: Product[]
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const handleWishlistToggle = async (productId: number) => {
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId)
      } else {
        await addToWishlist(productId)
      }
    } catch (error) {
      // Error toasts are handled in context
      console.error('Wishlist error:', error)
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
            <div key={product.id} className="shrink-0 w-[45%] snap-start">
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
              isInWishlist={isInWishlist(product.id)}
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
              isInWishlist={isInWishlist(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}