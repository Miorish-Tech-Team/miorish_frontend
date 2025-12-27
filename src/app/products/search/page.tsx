'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/card/ProductCard'
import { ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react'
import { searchProducts, type Product } from '@/services/productService'
import CandleLoader from '@/components/CandleLoader'

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('query') || ''
  const category = searchParams.get('category') || ''
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const result = await searchProducts(query)
        let filteredProducts = result.products

        // Filter by category if specified
        if (category && category !== 'All') {
          filteredProducts = filteredProducts.filter(
            product => product.category?.categoryName === category
          )
        }

        setProducts(filteredProducts)
      } catch (error) {
        console.error('Error fetching search results:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
    setCurrentPage(1)
  }, [query, category])

  // Pagination
  const totalPages = Math.ceil(products.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <CandleLoader />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-20 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <SearchIcon size={20} />
            <h1 className="text-2xl font-semibold text-dark">
              Search Results for &ldquo;{query}&rdquo;
            </h1>
          </div>
          {category && category !== 'All' && (
            <p className="text-gray-600">
              in category: <span className="font-medium text-primary">{category}</span>
            </p>
          )}
          <p className="text-gray-600 mt-2">
            Found {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {currentProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  productId={product.id}
                  image={product.coverImageUrl}
                  title={product.productName}
                  description={product.productDescription}
                  originalPrice={product.productPrice}
                  discountedPrice={product.productDiscountPrice || product.productPrice}
                  discount={product.productDiscountPercentage || 0}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2">...</span>
                  }
                  return null
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <SearchIcon size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No products found
            </h2>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms or browse all products
            </p>
            <button
              onClick={() => router.push('/categories')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <CandleLoader />
          </div>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
