'use client'
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const heroImages = [
  { id: 1, src: '/images/hero1.jpg', alt: 'Latest Collection' },
  { id: 2, src: '/images/hero2.jpg', alt: 'Summer Sale' },
  { id: 3, src: '/images/hero3.jpg', alt: 'New Arrivals' },
];

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[90vh] overflow-hidden bg-secondary">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true} // Enables Infinite Loop
        effect="fade" // Smooth fade transition (optional)
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'bg-accent opacity-100',
        }}
        className="h-full w-full"
      >
        {heroImages.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="relative w-full h-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={image.id === 1}
                className="object-cover"
                unoptimized // Keep this if using local public images without a loader
              />
              {/* Optional Overlay for Text visibility */}
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center p-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                  {image.alt}
                </h1>
                <p className="text-lg md:text-xl max-w-lg drop-shadow-md">
                  Discover premium quality products crafted just for you.
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles for Pagination Dots */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }
        .swiper-pagination-bullet-active {
          background: #B49157 !important; /* Use your hex accent color here */
          width: 25px;
          border-radius: 5px;
          transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
}