'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Glass Candles')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Glass Candles'])
  const [priceRange, setPriceRange] = useState([100, 500])
  const [currentPage, setCurrentPage] = useState(1)

  const categories = {
    'Glass Candles': ['Jar Candles'],
    'Burano Candles': [],
  }

  const brands = ['Brand 1', 'Brand 2']

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(c => c !== category))
    } else {
      setExpandedCategories([...expandedCategories, category])
    }
  }

  const products = Array(6).fill(null).map((_, i) => ({
    id: i + 1,
    image: '/images/CardImage.jpg',
    title: 'Mithril Candles',
    description: 'Malt Peda Soy Wax Candle By Miorish',
    originalPrice: 150,
    discountedPrice: 100,
    discount: 33
  }))

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <a href="/" className="text-accent hover:underline">Home</a>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-dark">Products</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            {/* Categories */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-dark mb-4">Categories</h3>
              <div className="space-y-2">
                {Object.entries(categories).map(([category, subcategories]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="w-4 h-4 accent-accent"
                        />
                        <span className="text-sm text-dark">{category}</span>
                      </label>
                      {subcategories.length > 0 && (
                        <button
                          onClick={() => toggleCategory(category)}
                          className="p-1"
                        >
                          <span className="text-lg font-bold">
                            {expandedCategories.includes(category) ? '−' : '+'}
                          </span>
                        </button>
                      )}
                    </div>
                    {expandedCategories.includes(category) && subcategories.length > 0 && (
                      <div className="ml-6 mt-2 space-y-2">
                        {subcategories.map((sub) => (
                          <label key={sub} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="subcategory"
                              className="w-4 h-4 accent-accent"
                            />
                            <span className="text-sm text-gray-600">{sub}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {['Burano Candles', 'Burano Candles', 'Burano Candles'].slice(1).map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="radio"
                        name="category"
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="text-sm text-dark">{item}</span>
                    </label>
                    <button className="p-1">
                      <span className="text-lg font-bold">+</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-dark mb-4">Brands</h3>
              <div className="space-y-3">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-accent rounded"
                    />
                    <span className="text-sm text-dark">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-dark mb-4">Price</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="100"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-accent"
                />
                <div className="flex items-center justify-between text-sm text-dark">
                  <span>{priceRange[0]}</span>
                  <span>-</span>
                  <span>{priceRange[1]}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-accent text-white rounded text-sm hover:bg-opacity-90 transition-colors">
                    Apply
                  </button>
                  <button className="flex-1 px-4 py-2 border border-accent text-accent rounded text-sm hover:bg-accent hover:text-white transition-colors">
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">Showing 1-6 out of 50</p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  title={product.title}
                  description={product.description}
                  originalPrice={product.originalPrice}
                  discountedPrice={product.discountedPrice}
                  discount={product.discount}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="p-2 hover:bg-white rounded transition-colors"
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} className={currentPage === 1 ? 'text-gray-300' : 'text-dark'} />
              </button>
              
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded ${
                    currentPage === page
                      ? 'bg-accent text-white'
                      : 'bg-white text-dark hover:bg-accent hover:text-white'
                  } transition-colors`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(4, currentPage + 1))}
                className="p-2 hover:bg-white rounded transition-colors"
                disabled={currentPage === 4}
              >
                <ChevronRight size={20} className={currentPage === 4 ? 'text-gray-300' : 'text-dark'} />
              </button>
            </div>

            {/* Recommended Section */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-serif text-dark">Recommended for You</h2>
                <a href="#" className="text-accent hover:underline text-sm">See More →</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {products.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
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
          </main>
        </div>
      </div>
    </div>
  )
}
