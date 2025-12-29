import React from "react";
import Image from "next/image";
import { type Banner } from "@/services/bannerService";

interface PromotionBanner1Props {
  banners: Banner[];
}

export default function PromotionBanner1({ banners }: PromotionBanner1Props) {
  if (banners.length === 0) {
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-secondary">
        {/* <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="relative h-[200px] md:h-[250px] lg:h-[350px] rounded-lg overflow-hidden">
            <Image
              src="/images/PanelImage1.jpg"
              alt="All Rounders"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div> */}
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="relative h-[200px] md:h-[250px] lg:h-[350px] rounded-lg overflow-hidden">
          <Image
            src={banners[0].image}
            alt={banners[0].title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
