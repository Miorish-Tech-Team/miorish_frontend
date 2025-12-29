import React from "react";
import Image from "next/image";
import { type Banner } from "@/services/bannerService";

interface BrandPromotionProps {
  banners: Banner[];
}

export default function BrandPromotion({ banners }: BrandPromotionProps) {
  // Use banners or fallback to default
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
    <section className="p-8 md:p-12 lg:p-12 bg-white">
      <div className="border-2 border-accent p-5 rounded-xl">
        <div className=" mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif  text-dark mb-8 md:mb-12">
            Brand Promotions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {displayBanners.slice(0, 4).map((banner) => (
              <div
                key={banner.id}
                className="relative aspect-square rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
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
