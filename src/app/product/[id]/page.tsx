'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronRight, Heart, Share2, Minus, Plus } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  const thumbnails = [
    '/images/CardImage.jpg',
    '/images/CardImage.jpg',
    '/images/CardImage.jpg',
    '/images/CardImage.jpg',
  ]

  const similarProducts = Array(4).fill(null).map((_, i) => ({
    id: i + 1,
    image: '/images/CardImage.jpg',
    title: 'Mithril Candles',
    description: 'Malt Peda Soy Wax Candle By Miorish',
    originalPrice: 150,
    discountedPrice: 100,
    discount: 33
  }))

  const reviews = [
    {
      id: 1,
      rating: 5,
      name: 'User',
      images: ['/images/CardImage.jpg', '/images/CardImage.jpg'],
      badge: 'Excellent!',
      text: 'MIORISH is more than a candle brand — it\'s a story of luxury, artistry, and emotion. Born with the vision to create pieces that inspire warmth and elegance, each Miorish candle is hand-poured with finest natural wax, premium fragrances, and carefully chosen vessels that reflect timeless beauty.'
    },
    {
      id: 2,
      rating: 5,
      name: 'User',
      images: ['/images/CardImage.jpg', '/images/CardImage.jpg'],
      badge: 'Excellent!',
      text: 'MIORISH is more than a candle brand — it\'s a story of luxury, artistry, and emotion. Born with the vision to create pieces that inspire warmth and elegance, each Miorish candle is hand-poured with finest natural wax, premium fragrances, and carefully chosen vessels that reflect timeless beauty.'
    }
  ]

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 md:px-8 lg:px-14 py-4 md:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-4 md:mb-6 overflow-x-auto">
          <a href="/" className="text-accent hover:underline whitespace-nowrap">Home</a>
          <ChevronRight size={16} className="text-gray-400 shrink-0" />
          <a href="/categories" className="text-accent hover:underline whitespace-nowrap">Candles</a>
          <ChevronRight size={16} className="text-gray-400 shrink-0" />
          <span className="text-dark whitespace-nowrap">Premium</span>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Left: Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-3 md:mb-4">
              <Image 
                src={thumbnails[selectedImage]} 
                alt="Product"
                fill
                className="object-cover"
              />
              {/* Action buttons */}
              <button className="absolute top-2 right-2 md:top-4 md:right-4 bg-white rounded-full p-1.5 md:p-2 shadow-md hover:bg-gray-100 transition-colors">
                <Heart size={18} className="text-gray-600 md:w-5 md:h-5" />
              </button>
              <button className="absolute top-10 right-2 md:top-14 md:right-4 bg-white rounded-full p-1.5 md:p-2 shadow-md hover:bg-gray-100 transition-colors">
                <Share2 size={18} className="text-gray-600 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-accent' : 'border-transparent'
                  }`}
                >
                  <Image 
                    src={thumb} 
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="rounded-lg p-4 md:p-6">
            <h1 className="text-xl md:text-2xl lg:text-3xl text-center font-serif text-dark mb-4 px-0 md:px-15">
              Chakra Balancing Set by Miorish Candles – Realign Your Chakras & Elevate Your Energy
            </h1>

            {/* Price */}
            <div className="border-accent border-t pt-4 md:pt-6 flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6 px-0 md:px-15">
              <span className="text-gray-400 line-through text-base md:text-lg">Rs.150</span>
              <span className="text-accent text-2xl md:text-3xl font-bold">Rs.100</span>
              <span className="bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded text-xs md:text-sm font-semibold">33% OFF</span>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mb-4 md:mb-6 px-0 md:px-15">
              <div className="flex items-center justify-center border border-accent rounded">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 md:p-3 text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                >
                  <Minus size={14} className="md:w-4 md:h-4"/>
                </button>
                <span className="px-4 md:px-6 text-accent text-base md:text-lg font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 md:p-3 text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                >
                  <Plus size={14} className="md:w-4 md:h-4" />
                </button>
              </div>

              <button className="flex-1 bg-accent text-white py-2.5 md:py-3 px-4 md:px-6 rounded text-sm md:text-base font-medium hover:bg-opacity-90 transition-colors">
                Add to Cart
              </button>

              <button className="sm:flex-none bg-accent text-white py-2.5 md:py-3 px-4 md:px-6 rounded text-sm md:text-base font-medium hover:bg-opacity-90 transition-colors">
                Buy Now
              </button>
            </div>

            {/* Product Description */}
            <div className="border-accent border-t pt-4 md:pt-6 px-0 md:px-15">
              <h3 className="text-base md:text-lg font-semibold text-dark mb-2 md:mb-3">Product Description</h3>
              <div className="text-xs md:text-sm text-gray-700 space-y-1 md:space-y-2">
                <p>MIORISH is more than a candle brand — it's a story of luxury, artistry, and</p>
                <p>emotion. Born with the vision to create pieces that inspire warmth and</p>
                <p>elegance, each Miorish candle is hand-poured with finest natural wax,</p>
                <p>premium fragrances,</p>
                <p>and carefully chosen vessels that reflect timeless beauty.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="rounded-lg p-4 md:p-6 mb-8 md:mb-12">
          {/* Tab Headers */}
          <div className="flex gap-4 md:gap-8 border-b mb-4 md:mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2 md:pb-3 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
                activeTab === 'description' 
                  ? 'text-dark border-b-2 border-accent' 
                  : 'text-gray-400'
              }`}
            >
              Additional Information
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 md:pb-3 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
                activeTab === 'reviews' 
                  ? 'text-dark border-b-2 border-accent' 
                  : 'text-gray-400'
              }`}
            >
              Reviews(2)
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'description' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 md:py-4 text-dark font-medium w-1/3 text-sm md:text-base">Weight</td>
                    <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">500g</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 md:py-4 text-dark font-medium text-sm md:text-base">Pack of</td>
                    <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">10 Pieces</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 md:py-4 text-dark font-medium text-sm md:text-base">Wax Type</td>
                    <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">Soy</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 md:py-4 text-dark font-medium text-sm md:text-base">Color</td>
                    <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">MULTI - COLOUR</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 md:py-4 text-dark font-medium text-sm md:text-base">Lighting Hours</td>
                    <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">60hrs</td>
                  </tr>
                  <tr>
                    <td className="py-3 md:py-4 text-dark font-medium text-sm md:text-base">Fragrance Family</td>
                    <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">Florals</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 md:space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 md:pb-6 last:border-0">
                  <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4 mb-3">
                    {/* Reviewer Images */}
                    <div className="flex gap-2">
                      {review.images.map((img, idx) => (
                        <div key={idx} className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden">
                          <Image 
                            src={img} 
                            alt="Review"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Badge */}
                    <div className="bg-accent text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium">
                      {review.badge}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-accent text-base md:text-lg">★</span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Similar Products */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif text-dark">Similar Products</h2>
            <a href="#" className="text-accent hover:underline text-xs md:text-sm">See More →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {similarProducts.map((product) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                image={product.image}
                title={product.title}
                description={product.description}
                originalPrice={product.originalPrice}
                discountedPrice={product.discountedPrice}
                discount={product.discount}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
