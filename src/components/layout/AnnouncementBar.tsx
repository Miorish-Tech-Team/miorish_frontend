import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

const messages = [
  "Get 10% OFF on your first purchase",
  "Discover our latest luxury collections",
  "Free shipping on orders over ₹500",
  "Experience premium hand-poured scents",
  "New arrivals: Shop the summer collection"
];

export default function AnnouncementBar() {
  return (
    <div className="w-full h-7 md:h-9 bg-accent overflow-hidden">
      <Swiper
        direction={'horizontal'} // Swipes side to side
        loop={true}
        speed={2000} // Smoothness of the transition (in ms)
        autoplay={{
          delay: 3000, // Stays on screen for 4 seconds
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="h-full w-full"
      >
        {messages.map((text, index) => (
          <SwiperSlide key={index}>
            <div className="h-full w-full flex items-center justify-center px-4">
              <span className="text-[10px] md:text-sm font-semibold text-white tracking-[0.2em]  text-center">
                {text}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}