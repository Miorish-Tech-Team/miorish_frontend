'use client'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import { Truck, Headphones, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Links - Desktop */}
      <div className="hidden lg:block bg-white text-dark border-t border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-6 xl:gap-8 py-4 md:py-5 text-xs md:text-sm">
            <li>
              <a href="categories" className="hover:text-accent transition-colors">All Categories</a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">Puja & Rituals</a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">Gifts & Items</a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">Luxury Collection</a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">New Arrivals</a>
            </li>
          </ul>
        </div>
      </div>
      {/* Hero Section - Candles */}
      <section className="relative h-[300px] md:h-[400px] lg:h-[500px] bg-linear-to-r from-[#6B2C2C] to-[#C76D5F]">
        <div className="container mx-auto px-4 h-full">
          <div className="relative h-full">
            <Image 
              src="/images/HeroImage.jpg" 
              alt="Candles Collection"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* All Rounders Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-secondary">
        <div className="container mx-auto px-14">
          <div className="relative h-[200px] md:h-[250px] lg:h-[300px] rounded-lg overflow-hidden">
            <Image 
              src="/images/PanelImage1.jpg" 
              alt="All Rounders"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Experience Our Unique Fragrances */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-center text-dark mb-8 md:mb-12">
            Experience Our Unique Fragrances
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <ProductCard
                key={item}
                productId={item}
                image="/images/CardImage.jpg"
                title="Mithril Candles"
                description="Malt Packs Bay Wax Candle by Miorish"
                originalPrice={1499}
                discountedPrice={999}
                discount={33}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Flaunt Your Glam Quotient */}
      <section className="py-8 md:py-12 lg:py-16 bg-secondary">
        <div className="container mx-auto px-14">
          <div className="relative h-[200px] md:h-[250px] lg:h-[300px] rounded-lg overflow-hidden">
            <Image 
              src="/images/PanelImage2.jpg" 
              alt="Jewelry Collection"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-14">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-dark">New Arrivals</h2>
            <a href="#" className="text-accent hover:underline text-sm md:text-base">View More →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <ProductCard
                key={item}
                productId={item}
                image="/images/CardImage.jpg"
                title="Mithril Candles"
                description="Malt Packs Bay Wax Candle by Miorish"
                originalPrice={1499}
                discountedPrice={999}
                discount={33}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Promotions */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-center text-dark mb-8 md:mb-12">
            Brand Promotions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="relative h-[250px] md:h-[300px] rounded-lg overflow-hidden group cursor-pointer">
                <Image 
                  src="/images/cardImage3.jpg" 
                  alt="Promotion"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end p-4 md:p-6">
                  <div className="text-white">
                    <p className="text-2xl md:text-3xl font-bold mb-1">25% OFF</p>
                    <p className="text-xs md:text-sm">On all premium items</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended for You */}
      <section className="py-8 md:py-12 lg:py-16 bg-secondary">
        <div className="container mx-auto px-14">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-dark">Recommended for You</h2>
            <a href="#" className="text-accent hover:underline text-sm md:text-base">View More →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <ProductCard
                key={item}
                productId={item}
                image="/images/CardImage.jpg"
                title="Mithril Candles"
                description="Malt Packs Bay Wax Candle by Miorish"
                originalPrice={1499}
                discountedPrice={999}
                discount={33}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-14">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-dark mb-3">Blogs</h2>
            <p className="text-sm md:text-base text-gray-600 px-4">Discover exciting news and valuable collections of the MIORISH</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "Beyond the Wick", desc: "How to choose the perfect candle scents to boost your mood during the Winters!" },
              { title: "The Art of Candle Care", desc: "3 tips to maximize your favorite candle with proper care" },
              { title: "From Calm to Focus", desc: "Using Aromatherapy to create the perfect vibes with our candles" }
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
                <h3 className="text-lg md:text-xl font-semibold text-dark mb-2">{blog.title}</h3>
                <p className="text-xs md:text-sm text-gray-600">{blog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary rounded-full p-3 md:p-4 mb-3 md:mb-4">
                <Truck className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-dark mb-2">
                FREE AND FAST DELIVERY
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Free delivery for all orders over ₹500
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary rounded-full p-3 md:p-4 mb-3 md:mb-4">
                <Headphones className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-dark mb-2">
                24/7 CUSTOMER SERVICE
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Friendly 24/7 customer support
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary rounded-full p-3 md:p-4 mb-3 md:mb-4">
                <ShieldCheck className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-dark mb-2">
                MONEY BACK GUARANTEE
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                We return money within 30 days
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
