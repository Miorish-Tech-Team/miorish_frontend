'use client'
// This component must be 'use client' because Swiper requires browser APIs
// However, all data (banners) is fetched server-side and passed as props
// This is the correct Next.js 14 pattern for interactive components with SSR data

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { type Banner } from '@/services/bannerService';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface HeroProps {
  banners: Banner[];
}

export default function Hero({ banners }: HeroProps) {
  // Fallback to default images if no banners
  const heroImages = banners.length > 0 
    ? banners 
    : [
        { id: 1, image: '/images/hero1.jpg', title: 'Latest Collection' },
        { id: 2, image: '/images/hero2.jpg', title: 'Summer Sale' },
        { id: 3, image: '/images/hero3.jpg', title: 'New Arrivals' },
      ];

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-secondary">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        effect="fade"
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
        {heroImages.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div className="relative w-full h-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority={index === 0}
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center p-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                  {item.title}
                </h1>
                <p className="text-lg md:text-xl max-w-lg drop-shadow-md">
                  Discover premium quality products crafted just for you.
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }
        .swiper-pagination-bullet-active {
          background: #B49157 !important;
          width: 25px;
          border-radius: 5px;
          transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
}