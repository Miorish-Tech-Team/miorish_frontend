'use client'

import { useState, useEffect, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'
import { ChevronRight, ChevronLeft, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { getAllProducts, searchProducts, type Product, type GetAllProductsParams } from '@/services/productService'
import { getAllCategories, getAllSubCategories, type Category, type SubCategory } from '@/services/categoryService'

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function CategoriesPage() {
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<GetAllProductsParams['sortBy']>('latest')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

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
        setSearchLoading(true)
        
        // If there's a search query, use search endpoint
        if (debouncedSearchQuery.trim()) {
          const result = await searchProducts(debouncedSearchQuery)
          setProducts(result.products)
        } else {
          // Otherwise use filtered getAllProducts
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
        }
        
        setCurrentPage(1) // Reset to first page on filter change
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setSearchLoading(false)
      }
    }

    if (!loading) {
      fetchFilteredProducts()
    }
  }, [debouncedSearchQuery, selectedCategories, selectedSubCategories, selectedBrands, priceRange, sortBy, loading])

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

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedSubCategories([])
    setSelectedBrands([])
    setPriceRange([0, 10000])
    setSearchQuery('')
    setSortBy('latest')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 placeholder:text-gray-400"
            />
            {searchLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-accent" size={20} />
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-4">
            {/* Categories */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id}>
                    <label className="flex items-center gap-2 cursor-pointer py-1 hover:bg-gray-50 px-2 -mx-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="w-4 h-4 accent-accent rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 flex-1 font-medium">
                        {category.categoryName} <span className="text-gray-500 font-normal">({category.categoryProductCount})</span>
                      </span>
                    </label>
                    {/* Subcategories */}
                    {selectedCategories.includes(category.id) && subcategoriesByCategory[category.id] && (
                      <div className="ml-6 mt-1 space-y-1">
                        {subcategoriesByCategory[category.id].map((sub) => (
                          <label key={sub.id} className="flex items-center gap-2 cursor-pointer py-1 hover:bg-gray-50 px-2 -mx-2 rounded transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedSubCategories.includes(sub.id)}
                              onChange={() => toggleSubCategory(sub.id)}
                              className="w-4 h-4 accent-accent rounded cursor-pointer"
                            />
                            <span className="text-xs text-gray-600">
                              {sub.subCategoryName} <span className="text-gray-400">({sub.subCategoryProductCount})</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Brands */}
            {availableBrands.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Brands</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 py-1 px-2 -mx-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 accent-accent rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 font-medium">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 placeholder:text-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200"
            >
              Clear All Filters
            </button>
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
            {searchLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
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
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      productId={product.id}
                      image={product.coverImageUrl}
                      title={product.category?.categoryName || ''}
                      description={product.productName}
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
                          className={`min-w-[32px] h-8 px-3 rounded-lg font-medium transition-all ${
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
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
