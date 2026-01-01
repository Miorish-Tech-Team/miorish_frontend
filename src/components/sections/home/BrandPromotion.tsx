import React from "react";
import Image from "next/image";
import { type Banner } from "@/services/bannerService";

interface BrandPromotionProps {
  banners: Banner[];
}

export default function BrandPromotion({ banners }: BrandPromotionProps) {
  const displayBanners =
    banners.length > 0
      ? banners
      : [
          { id: 1, image: "/images/cardImage3.jpg", title: "Brand 1" },
          { id: 2, image: "/images/cardImage3.jpg", title: "Brand 2" },
          { id: 3, image: "/images/cardImage3.jpg", title: "Brand 3" },
          { id: 4, image: "/images/cardImage3.jpg", title: "Brand 4" },
          { id: 5, image: "/images/cardImage3.jpg", title: "Brand 5" },
        ];

  return (
    <section className="p-4 md:p-12 bg-white">
      <div className="border-2 border-accent p-4 md:p-5 rounded-xl">
        <div className="mx-auto">
          <h2 className="text-xl md:text-3xl lg:text-5xl font-serif text-dark mb-6 md:mb-12">
            Brand Promotions
          </h2>

          {/* Mobile: flex-row with horizontal scroll
            Desktop: grid layout
          */}
          <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 md:pb-0 md:grid md:grid-cols-4 md:gap-6 scrollbar-hide">
            {displayBanners.slice(0, 5).map((banner) => (
              <div
                key={banner.id}
                className="relative flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 md:w-auto md:h-auto md:aspect-square rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
              >
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
