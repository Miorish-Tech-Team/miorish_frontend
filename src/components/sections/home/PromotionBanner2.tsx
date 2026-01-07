import React from "react";
import Image from "next/image";
import { type Banner } from "@/services/bannerService";

interface PromotionBanner2Props {
  banners: Banner[];
}

export default function PromotionBanner2({ banners }: PromotionBanner2Props) {
  if (banners.length === 0) {
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="relative h-[200px] md:h-[250px] lg:h-[350px] rounded-lg overflow-hidden">
            <Image
              src="/images/PanelImage2.jpg"
              alt="Jewelry Collection"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
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
    // <section className="py-8 md:py-12 lg:py-16 bg-secondary">
    //   <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
    //     <div className="w-full rounded-lg overflow-hidden">
    //       <Image
    //         src={banners[0].image}
    //         alt={banners[0].title}
    //         width={1200}
    //         height={400}
    //         layout="responsive"
    //         className="w-full h-auto block"
    //         unoptimized
    //       />
    //     </div>
    //   </div>
    // </section>
  );
}
