import React from "react";
import Image from "next/image";

export default function Blog() {
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-dark mb-3">
              Blogs
            </h2>
            <p className="text-sm md:text-base text-gray-600 px-4">
              Discover exciting news and valuable collections of the MIORISH
            </p>
          </div>
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {[
              {
                title: "Beyond the Wick",
                desc: "How to choose the perfect candle scents to boost your mood during the Winters!",
              },
              {
                title: "The Art of Candle Care",
                desc: "3 tips to maximize your favorite candle with proper care",
              },
              {
                title: "From Calm to Focus",
                desc: "Using Aromatherapy to create the perfect vibes with our candles",
              },
            ].map((blog, index) => (
              <div key={index} className="group cursor-pointer flex-shrink-0 w-[85%] snap-start">
                <div className="relative h-[250px] rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/images/Cardimage2.png"
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute bottom-4 left-4 px-4 md:px-6 py-2 bg-accent text-white text-xs md:text-sm rounded hover:bg-opacity-90 transition-colors">
                    Read More
                  </button>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-dark mb-2">
                  {blog.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">{blog.desc}</p>
              </div>
            ))}
          </div>
          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Beyond the Wick",
                desc: "How to choose the perfect candle scents to boost your mood during the Winters!",
              },
              {
                title: "The Art of Candle Care",
                desc: "3 tips to maximize your favorite candle with proper care",
              },
              {
                title: "From Calm to Focus",
                desc: "Using Aromatherapy to create the perfect vibes with our candles",
              },
            ].map((blog, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative h-[250px] md:h-[300px] rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/images/Cardimage2.png"
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute bottom-4 left-4 px-4 md:px-6 py-2 bg-accent text-white text-xs md:text-sm rounded hover:bg-opacity-90 transition-colors">
                    Read More
                  </button>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-dark mb-2">
                  {blog.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">{blog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}