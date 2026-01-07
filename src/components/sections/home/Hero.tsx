'use client'

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
  const heroImages = banners.length > 0 
    ? banners 
    : [
        { id: 1, image: '/images/hero1.jpg', title: '' },
        { id: 2, image: '/images/hero2.jpg', title: '' },
        { id: 3, image: '/images/hero3.jpg', title: '' },
      ];

  return (
    <section className="relative w-full overflow-hidden bg-secondary">
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
    /* FIX: We use aspect-ratio as the primary driver. 
       This ensures that even if 'Desktop View' is on, 
       the banner maintains a proper shape relative to its width.
    */
    className="w-full aspect-[16/9] md:aspect-[21/9] lg:h-[80vh] lg:aspect-auto"
  >
    {heroImages.map((item, index) => (
      <SwiperSlide key={item.id}>
        <div className="relative w-full h-full">
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority={index === 0}
            /* FIX: 'object-cover' is what causes the 'cutting off' effect.
               By using a consistent aspect ratio on the container, 
               'object-cover' will now work correctly without zooming in too much.
            */
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-white text-center p-4">
            {/* Content can go here */}
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  <style jsx global>{`
    .swiper-pagination-bullet {
      background: white;
      opacity: 0.5;
      width: 8px;
      height: 8px;
    }
    .swiper-pagination-bullet-active {
      background: #B49157 !important;
      width: 20px;
      border-radius: 5px;
      transition: all 0.3s ease;
    }
    .swiper-pagination {
      bottom: 10px !important;
    }
    @media (min-width: 768px) {
      .swiper-pagination-bullet { width: 10px; height: 10px; }
      .swiper-pagination-bullet-active { width: 25px; }
      .swiper-pagination { bottom: 20px !important; }
    }
  `}</style>
</section>
  );
}