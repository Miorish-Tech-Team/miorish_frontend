import Image from "next/image";
import ProductCard from "@/components/card/ProductCard";
import { Truck, Headphones, ShieldCheck } from "lucide-react";
import Hero from "@/components/sections/home/Hero";
import { getAllCategories, type Category } from "@/services/categoryService";
import { getAllProducts, type Product } from "@/services/productService";
import { getCombinedRecommendations } from "@/services/recommendationService";
import { getHomepageBanners, getWeeklyPromotionBanners, getPopularBanners, getBrandPosterBanners, type Banner } from "@/services/bannerService";
import PromotionBanner1 from "@/components/sections/home/PromotionBanner1";
import UniqueProducts from "@/components/sections/home/UniqueProducts";
import PromotionBanner2 from "@/components/sections/home/PromotionBanner2";
import NewArrivals from "@/components/sections/home/NewArrivals";
import BrandPromotion from "@/components/sections/home/BrandPromotion";
import Recommendation from "@/components/sections/home/Recommendation";
import Blog from "@/components/sections/home/Blog";
import { cookies } from "next/headers";

// Force Next.js to fetch fresh data on every request
export const dynamic = "force-dynamic";

export default async function Home() {
  let categories: Category[] = [];
  let newArrivalProducts: Product[] = [];
  let uniqueProducts: Product[] = [];
  let recommendedProducts: Product[] = [];
  let isAuthenticated = false;
  let homepageBanners: Banner[] = [];
  let weeklyBanners: Banner[] = [];
  let popularBanners: Banner[] = [];
  let brandBanners: Banner[] = [];

  try {
    // Check if user is authenticated by checking for auth token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const tokenMiddleware = cookieStore.get("token_middleware")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;
    
    // Check any of the possible auth tokens
    isAuthenticated = !!(token || tokenMiddleware || accessToken);
  

    // Fetch all data in parallel
    const [categoriesRes, productsRes, homepageBannersRes, weeklyBannersRes, popularBannersRes, brandBannersRes, recommendationRes] = await Promise.all([
      getAllCategories(),
      getAllProducts({ sortBy: "latest" }),
      getHomepageBanners(),
      getWeeklyPromotionBanners(),
      getPopularBanners(),
      getBrandPosterBanners(),
      isAuthenticated ? getCombinedRecommendations() : Promise.resolve(null),
    ]);

    if (categoriesRes?.categories && Array.isArray(categoriesRes.categories)) {
      categories = categoriesRes.categories;
    }

    if (productsRes?.success && productsRes.products) {
      const allProducts = productsRes.products;

      // Filter new arrivals
      const arrivals = allProducts
        .filter((p: Product) => p.isNewArrivalProduct)
        .slice(0, 5);
      newArrivalProducts =
        arrivals.length > 0 ? arrivals : allProducts.slice(0, 5);

      // Get unique products (next 5)
      uniqueProducts = allProducts.slice(5, 10);
    }

    // Set banners
    if (homepageBannersRes?.success && Array.isArray(homepageBannersRes.banners)) {
      homepageBanners = homepageBannersRes.banners;
    }
    
    if (weeklyBannersRes?.success && Array.isArray(weeklyBannersRes.banners)) {
      weeklyBanners = weeklyBannersRes.banners;
    }
    
    if (popularBannersRes?.success && Array.isArray(popularBannersRes.banners)) {
      popularBanners = popularBannersRes.banners;
    }
    
    if (brandBannersRes?.success && Array.isArray(brandBannersRes.banners)) {
      brandBanners = brandBannersRes.banners;
    }

    // Only use recommendation API if user is authenticated
    if (isAuthenticated && recommendationRes?.success && recommendationRes.recommended) {
      recommendedProducts = recommendationRes.recommended.slice(0, 5);
    } else {
      console.log("[Server] No recommendations to display", {
        isAuthenticated,
        hasResponse: !!recommendationRes,
        responseSuccess: recommendationRes?.success,
        hasRecommended: !!recommendationRes?.recommended,
        recommendedLength: recommendationRes?.recommended?.length || 0
      });
    }
  } catch (error) {
    console.error("[Server] Error fetching data:", error);
  }
  return (
    <div className="min-h-screen ">
      {/* Navigation Links - Desktop */}
      <div className="hidden lg:block bg-white text-dark border-t border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-6 xl:gap-8 py-4 md:py-4 text-xs md:text-sm flex-wrap">
            <li>
              <a
                href="/categories"
                className="hover:text-accent transition-colors font-bold"
              >
                All Categories
              </a>
            </li>
            {/* If categories are empty, this won't render anything */}
            {categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`/categories?category=${encodeURIComponent(
                      category.categoryName
                    )}`}
                    className="hover:text-accent font-bold transition-colors"
                  >
                    {category.categoryName}
                  </a>
                </li>
              ))
            ) : (
              <li className="text-gray-400"></li>
            )}
          </ul>
        </div>
      </div>
      {/* Hero Section - Candles */}
      <Hero banners={homepageBanners} />
      <PromotionBanner1 banners={weeklyBanners} />
      <UniqueProducts products={uniqueProducts} />
      <PromotionBanner2 banners={popularBanners} />
      <NewArrivals products={newArrivalProducts} />
      <BrandPromotion banners={brandBanners} />
      {isAuthenticated && recommendedProducts.length > 0 && (
        <Recommendation products={recommendedProducts} />
      )}
      <Blog />

      {/* Features Section */}
      <section className="py-8 md:px-20 md:py-12 bg-secondary">
        <div className="container mx-auto px-2 md:px-4">
          {/* Changed grid-cols-1 to grid-cols-3 to force single line on mobile */}
          <div className="grid grid-cols-3 gap-2 md:gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary rounded-full p-2 md:p-4 mb-2 md:mb-4">
                <Truck className="text-white w-5 h-5 md:w-8 md:h-8" />
              </div>
              <h3 className="text-[10px] sm:text-xs md:text-lg font-bold text-dark mb-1 leading-tight">
                FREE AND FAST DELIVERY
              </h3>
              <p className=" text-[9px] md:text-sm text-gray-600">
                Free delivery for all orders over Over ₹500
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary rounded-full p-2 md:p-4 mb-2 md:mb-4">
                <Headphones className="text-white w-5 h-5 md:w-8 md:h-8" />
              </div>
              <h3 className="text-[10px] sm:text-xs md:text-lg font-bold text-dark mb-1 leading-tight">
                24/7 CUSTOMER SERVICE
              </h3>
              <p className=" text-[9px] md:text-sm text-gray-600">
                Friendly 24/7 customer support
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary rounded-full p-2 md:p-4 mb-2 md:mb-4">
                <ShieldCheck className="text-white w-5 h-5 md:w-8 md:h-8" />
              </div>
              <h3 className="text-[10px] sm:text-xs md:text-lg font-bold text-dark mb-1 leading-tight">
                MONEY BACK GUARANTEE
              </h3>
              <p className=" text-[9px] md:text-sm text-gray-600">
                We return money within 30 days
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
