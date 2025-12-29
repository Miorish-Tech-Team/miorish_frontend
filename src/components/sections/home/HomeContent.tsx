// This is a server component (no 'use client') for SSR
// All data is fetched server-side and passed as props from page.tsx
import React from 'react';
import UniqueProducts from "./UniqueProducts";
import NewArrivals from "./NewArrivals";
import Recommendation from "./Recommendation";
import PromotionBanner2 from "./PromotionBanner2";
import BrandPromotion from "./BrandPromotion";
import { type Product } from "@/services/productService";
import { type Banner } from "@/services/bannerService";

interface HomeContentProps {
  newArrivalProducts: Product[];
  uniqueProducts: Product[];
  recommendedProducts: Product[];
  isAuthenticated: boolean;
  popularBanners: Banner[];
  brandBanners: Banner[];
}

export default function HomeContent({
  newArrivalProducts,
  uniqueProducts,
  recommendedProducts,
  isAuthenticated,
  popularBanners,
  brandBanners
}: HomeContentProps) {
  // Pure server component - no client-side state or effects
  return (
    <>
      <UniqueProducts products={uniqueProducts} />
      <PromotionBanner2 banners={popularBanners} />
      <NewArrivals products={newArrivalProducts} />
      <BrandPromotion banners={brandBanners} />
      {isAuthenticated && recommendedProducts.length > 0 && (
        <Recommendation products={recommendedProducts} />
      )}
    </>
  );
}
