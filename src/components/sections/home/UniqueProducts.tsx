import React from "react";
import Image from "next/image";
import ProductCard from "@/components/card/ProductCard";
import { type Product } from "@/services/productService"

interface UniqueProductsProps {
  products: Product[]
}

export default function UniqueProducts({ products }: UniqueProductsProps) {
  if (!products || products.length === 0) {
    // Fallback to dummy data if no products
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-center text-dark mb-8 md:mb-12">
            Experience Our Unique Fragrances
          </h2>
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex-shrink-0 w-[45%] snap-start">
                <ProductCard
                  productId={item}
                  image="/images/CardImage.jpg"
                  title="Mithril Candles"
                  description="Malt Packs Bay Wax Candle by Miorish"
                  originalPrice={1499}
                  discountedPrice={999}
                  discount={33}
                />
              </div>
            ))}
          </div>
          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <ProductCard
                key={item}
                productId={item}
                image="/images/CardImage.jpg"
                title="Mithril Candles"
                description="Malt Packs Bay Wax Candle by Miorish"
                originalPrice={1499}
                discountedPrice={999}
                discount={33}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-center text-dark mb-8 md:mb-12">
          Experience Our Unique Fragrances
        </h2>
        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {products.slice(0, 5).map((product) => (
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
              />
            </div>
          ))}
        </div>
        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.slice(0, 5).map((product) => (
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
