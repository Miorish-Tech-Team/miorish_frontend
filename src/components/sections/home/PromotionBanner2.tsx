import React from "react";
import Image from "next/image";

export default function PromotionBanner2() {
  return (
      <section className="py-8 md:py-12 lg:py-16 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="relative h-[200px] md:h-[250px] lg:h-[350px] rounded-lg overflow-hidden">
            <Image
              src="/images/PanelImage2.jpg"
              alt="Jewelry Collection"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
  );
}
