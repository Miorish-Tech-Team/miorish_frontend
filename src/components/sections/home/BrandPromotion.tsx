import React from "react";
import Image from "next/image";

export default function BrandPromotion() {
  return (
          <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-center text-dark mb-8 md:mb-12">
                Brand Promotions
              </h2>
              {/* Mobile: Horizontal Scroll */}
              <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="relative h-[250px] flex-shrink-0 w-[70%] rounded-lg overflow-hidden group cursor-pointer snap-start"
                  >
                    <Image
                      src="/images/cardImage3.jpg"
                      alt="Promotion"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end p-4 md:p-6">
                      <div className="text-white">
                        <p className="text-2xl md:text-3xl font-bold mb-1">
                          25% OFF
                        </p>
                        <p className="text-xs md:text-sm">On all premium items</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: Grid */}
              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="relative h-[250px] md:h-[300px] rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <Image
                      src="/images/cardImage3.jpg"
                      alt="Promotion"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end p-4 md:p-6">
                      <div className="text-white">
                        <p className="text-2xl md:text-3xl font-bold mb-1">
                          25% OFF
                        </p>
                        <p className="text-xs md:text-sm">On all premium items</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
    );
}