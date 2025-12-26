'use client'

import { useState, useEffect, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'
import { ChevronRight, ChevronLeft, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import CandleLoader from '@/components/CandleLoader'
import { getAllProducts, type Product, type GetAllProductsParams } from '@/services/productService'
import { getAllCategories, getAllSubCategories, type Category, type SubCategory } from '@/services/categoryService'

export default function CategoriesPage() {
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 500])
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([100, 500])
  const [sortBy, setSortBy] = useState<GetAllProductsParams['sortBy']>('latest')
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const [productsRes, categoriesRes, subCategoriesRes] = await Promise.all([
          getAllProducts({ sortBy: 'latest' }),
          getAllCategories(),
          getAllSubCategories()
        ])
        
        setProducts(productsRes.products)
        setCategories(categoriesRes.categories)
        setSubCategories(subCategoriesRes.subCategories)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // Fetch products based on filters
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const params: GetAllProductsParams = {
          sortBy,
          minPrice: priceRange[0],
          maxPrice: priceRange[1]
        }

        // Add selected categories
        if (selectedCategories.length > 0) {
          const categoryNames = categories
            .filter(cat => selectedCategories.includes(cat.id))
            .map(cat => cat.categoryName)
          params.categories = categoryNames.join(',')
        }

        // Add selected brands
        if (selectedBrands.length > 0) {
          params.brands = selectedBrands.join(',')
        }

        const result = await getAllProducts(params)
        let filteredProducts = result.products

        // Client-side filter for subcategories
        if (selectedSubCategories.length > 0) {
          filteredProducts = filteredProducts.filter(product =>
            selectedSubCategories.includes(product.productSubCategoryId)
          )
        }

        setProducts(filteredProducts)
        setCurrentPage(1) // Reset to first page on filter change
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    if (!loading) {
      fetchFilteredProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, selectedSubCategories, selectedBrands, priceRange, sortBy, loading])

  // Get unique brands from all products
  const availableBrands = useMemo(() => {
    const brands = new Set<string>()
    products.forEach(product => {
      if (product.productBrand) {
        brands.add(product.productBrand)
      }
    })
    return Array.from(brands).sort()
  }, [products])

  // Group subcategories by category
  const subcategoriesByCategory = useMemo(() => {
    const grouped: Record<number, SubCategory[]> = {}
    subCategories.forEach(sub => {
      if (!grouped[sub.categoryId]) {
        grouped[sub.categoryId] = []
      }
      grouped[sub.categoryId].push(sub)
    })
    return grouped
  }, [subCategories])

  // Pagination
  const totalPages = Math.ceil(products.length / productsPerPage)
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage
    return products.slice(startIndex, startIndex + productsPerPage)
  }, [products, currentPage, productsPerPage])

  // Toggle handlers
  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleSubCategory = (subCategoryId: number) => {
    setSelectedSubCategories(prev =>
      prev.includes(subCategoryId)
        ? prev.filter(id => id !== subCategoryId)
        : [...prev, subCategoryId]
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const toggleCategoryExpand = (categoryId: number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const applyFilters = () => {
    setPriceRange(tempPriceRange)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedSubCategories([])
    setSelectedBrands([])
    setPriceRange([100, 500])
    setTempPriceRange([100, 500])
    setSortBy('latest')
  }

  if (loading) {
    return <CandleLoader />
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-accent hover:underline font-medium">Home</Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-700 font-medium">Products</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">\n          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Categories */}
              <div className="border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 px-4 py-3 bg-gray-50">Categories</h3>
                <div className="px-4 py-3 space-y-1 max-h-80 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <div className="flex items-center justify-between py-1.5">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className={`text-sm hover:text-accent transition-colors font-normal flex-1 text-left ${
                            selectedCategories.includes(category.id) ? 'text-accent font-medium' : 'text-gray-700'
                          }`}
                        >
                          {category.categoryName}
                        </button>
                        <button
                          onClick={() => toggleCategoryExpand(category.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          {expandedCategories.includes(category.id) ? (
                            <Minus size={16} className="text-gray-600" />
                          ) : (
                            <Plus size={16} className="text-gray-600" />
                          )}
                        </button>
                      </div>
                      {/* Subcategories */}
                      {expandedCategories.includes(category.id) && subcategoriesByCategory[category.id] && (
                        <div className="ml-4 mt-1 space-y-1 pb-2">
                          {subcategoriesByCategory[category.id].map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => toggleSubCategory(sub.id)}
                              className={`block text-xs py-1 hover:text-accent transition-colors ${
                                selectedSubCategories.includes(sub.id) ? 'text-accent font-medium' : 'text-gray-600'
                              }`}
                            >
                              {sub.subCategoryName}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              {availableBrands.length > 0 && (
                <div className="border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 px-4 py-3 bg-gray-50">Brands</h3>
                  <div className="px-4 py-3 space-y-2 max-h-64 overflow-y-auto">
                    {availableBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={`block text-sm hover:text-accent transition-colors ${
                          selectedBrands.includes(brand) ? 'text-accent font-medium' : 'text-gray-700'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 px-4 py-3 bg-gray-50">Price</h3>
                <div className="px-4 py-4 space-y-4">
                  {/* Range Slider */}
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="10"
                      value={tempPriceRange[0]}
                      onChange={(e) => setTempPriceRange([parseInt(e.target.value), tempPriceRange[1]])}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="10"
                      value={tempPriceRange[1]}
                      onChange={(e) => setTempPriceRange([tempPriceRange[0], parseInt(e.target.value)])}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent mt-2"
                    />
                  </div>
                  {/* Price Display */}
                  <div className="text-center text-sm text-gray-700 font-medium">
                    ${tempPriceRange[0]} - ${tempPriceRange[1]}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 flex gap-3">
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium text-sm"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <p className="text-sm text-gray-600 font-medium">
                Showing {paginatedProducts.length > 0 ? (currentPage - 1) * productsPerPage + 1 : 0}-
                {Math.min(currentPage * productsPerPage, products.length)} of <span className="text-gray-900 font-semibold">{products.length}</span> products
              </p>
              
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as GetAllProductsParams['sortBy'])}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-gray-700 font-medium cursor-pointer"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
              </select>
            </div>

            {/* Products Grid */}
            {/* {searchLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600 text-lg font-medium mb-2">No products found</p>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : ( */}
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      productId={product.id}
                      image={product.coverImageUrl}
                      title={product.productName || ''}
                      description={product.productDescription}
                      originalPrice={product.productPrice}
                      discountedPrice={product.productDiscountPrice || product.productPrice}
                      discount={product.productDiscountPercentage || 0}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className="p-2 bg-white hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm border border-gray-200"
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={20} className={currentPage === 1 ? 'text-gray-300' : 'text-gray-700'} />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`min-w-8 h-8 px-3 rounded-lg font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-accent text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className="p-2 bg-white hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm border border-gray-200"
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={20} className={currentPage === totalPages ? 'text-gray-300' : 'text-gray-700'} />
                    </button>
                  </div>
                )}
              </>
            {/* )} */}
          </main>
        </div>
      </div>
    </div>
  )
}
