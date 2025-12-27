'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from "@/components/card/ProductCard";
import { getProductsByCategory, type Product } from "@/services/productService";
import UniqueProducts from "./UniqueProducts";
import NewArrivals from "./NewArrivals";
import Recommendation from "./Recommendation";
import PromotionBanner2 from "./PromotionBanner2";
import BrandPromotion from "./BrandPromotion";

interface HomeContentProps {
  initialNewArrivals: Product[];
  initialUniqueProducts: Product[];
  initialRecommendedProducts: Product[];
}

export default function HomeContent({
  initialNewArrivals,
  initialUniqueProducts,
  initialRecommendedProducts
}: HomeContentProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  // Check if there's a category filter from URL
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      fetchProductsByCategory(categoryParam);
    } else {
      // Reset when no category in URL
      setSelectedCategory(null);
      setFilteredProducts([]);
    }
  }, [searchParams]);

  const fetchProductsByCategory = async (categoryName: string) => {
    setIsLoading(true);
    setSelectedCategory(categoryName);
    try {
      const response = await getProductsByCategory(categoryName);
      if (response.success && response.products) {
        setFilteredProducts(response.products);
      } else {
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products by category:', error);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // If a category is selected, show filtered products only
  if (selectedCategory) {
    return (
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-dark">
              {selectedCategory}
            </h2>
            <a
              href="/"
              className="px-4 py-2 bg-accent text-white text-sm md:text-base rounded hover:bg-accent/90 transition-colors"
            >
              Show All Products
            </a>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  productId={product.id}
                  image={product.coverImageUrl || "/images/CardImage.jpg"}
                  title={product.productName}
                  description={product.productDescription}
                  originalPrice={product.productPrice}
                  discountedPrice={product.productDiscountPrice}
                  discount={product.productDiscountPercentage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show default sections when no category is selected
  return (
    <>
      <UniqueProducts products={initialUniqueProducts} />
      <PromotionBanner2 />
      <NewArrivals products={initialNewArrivals} />
      <BrandPromotion />
      <Recommendation products={initialRecommendedProducts} />
    </>
  );
}
