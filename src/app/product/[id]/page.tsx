'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Heart, Share2, Minus, Plus, Loader2, Star, ShoppingCart } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { getProductById, getSimilarProducts, getProductReviews, type Product, Review } from '@/services/productService'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'react-hot-toast'
import CandleLoader from '@/components/CandleLoader'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const { addToCart: addToCartContext } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const [productRes, similarRes, reviewsRes] = await Promise.all([
          getProductById(productId),
          getSimilarProducts(productId).catch(() => ({ products: [], success: true })),
          getProductReviews(productId).catch(() => ({ reviews: [], success: true }))
        ])

        setProduct(productRes.product)
        setSimilarProducts(similarRes.products || [])
        setReviews(reviewsRes.reviews || [])
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProductData()
    }
  }, [productId])

  const handleAddToCart = async () => {
    if (!product) return
    
    try {
      setAddingToCart(true)
      await addToCartContext(Number(productId), quantity)
    } catch (error: unknown) {
      // Error already handled in context with toast
      console.error('Add to cart error:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = () => {
    if (!product) return
    
    // Store buy now data in session storage for checkout
    sessionStorage.setItem('buyNowData', JSON.stringify({
      productId: Number(productId),
      quantity,
      product: {
        id: product.id,
        productName: product.productName,
        coverImageUrl: product.coverImageUrl,
        productPrice: product.productPrice,
        productDiscountPrice: product.productDiscountPrice
      }
    }))
    
    router.push('/checkout?type=buynow')
  }

  const handleAddToWishlist = () => {
    toast('Wishlist feature coming soon!', { icon: 'ℹ️' })
  }

  if (loading) {
    return <CandleLoader />
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Product not found</p>
          <Link href="/categories" className="text-accent hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    )
  }

  const images = [product.coverImageUrl, ...(product.galleryImageUrls || [])]
  const discountPrice = product.productDiscountPrice || product.productPrice
  const hasDiscount = product.productDiscountPercentage && product.productDiscountPercentage > 0

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 md:px-8 lg:px-14 py-4 md:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-4 md:mb-6 overflow-x-auto">
          <Link href="/" className="text-accent hover:underline whitespace-nowrap">Home</Link>
          <ChevronRight size={16} className="text-gray-400 shrink-0" />
          <Link href="/categories" className="text-accent hover:underline whitespace-nowrap">
            {product.category?.categoryName || 'Products'}
          </Link>
          <ChevronRight size={16} className="text-gray-400 shrink-0" />
          <span className="text-dark whitespace-nowrap">{product.productName}</span>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Left: Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-3 md:mb-4">
              <Image 
                src={images[selectedImage]} 
                alt={product.productName}
                fill
                className="object-cover"
              />
              {/* Status Badge */}
              {product.inventoryStatus === 'onSale' && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Sale
                </div>
              )}
              {product.isNewArrivalProduct && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  New
                </div>
              )}
              {/* Action buttons */}
              <button 
                onClick={handleAddToWishlist}
                className="absolute top-2 right-2 md:top-4 md:right-4 bg-white rounded-full p-1.5 md:p-2 shadow-md hover:bg-gray-100 transition-colors"
              >
                <Heart size={18} className="text-gray-600 md:w-5 md:h-5" />
              </button>
              <button className="absolute top-10 right-2 md:top-14 md:right-4 bg-white rounded-full p-1.5 md:p-2 shadow-md hover:bg-gray-100 transition-colors">
                <Share2 size={18} className="text-gray-600 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.productName} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="rounded-lg p-4 md:p-6">
            {/* Category */}
            <p className="text-accent text-sm md:text-base mb-1">
              {product.category?.categoryName} {product.subcategory && `• ${product.subcategory.subCategoryName}`}
            </p>

            {/* Product Name */}
            <h1 className="text-xl md:text-2xl lg:text-3xl text-center lg:text-left font-serif text-dark mb-4 px-0 md:px-15">
              {product.productName}
            </h1>

            {/* Brand */}
            <p className="text-gray-600 mb-3 text-center lg:text-left px-0 md:px-15">{product.productBrand}</p>

            {/* Rating */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 px-0 md:px-15">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < Math.floor(product.averageCustomerRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.averageCustomerRating.toFixed(1)} ({product.totalCustomerReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="border-accent border-t pt-4 md:pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3 mb-4 md:mb-6 px-0 md:px-15">
              {hasDiscount && (
                <span className="text-gray-400 line-through text-base md:text-lg">Rs.{product.productPrice}</span>
              )}
              <span className="text-accent text-2xl md:text-3xl font-bold">Rs.{discountPrice}</span>
              {hasDiscount && (
                <span className="bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded text-xs md:text-sm font-semibold">
                  {product.productDiscountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4 text-center lg:text-left px-0 md:px-15">
              {product.inventoryStatus === 'InStock' && product.availableStockQuantity > 0 ? (
                <p className="text-green-600 font-semibold">In Stock ({product.availableStockQuantity} available)</p>
              ) : product.inventoryStatus === 'OutOfStock' ? (
                <p className="text-red-600 font-semibold">Out of Stock</p>
              ) : product.inventoryStatus === 'BackOrder' ? (
                <p className="text-yellow-600 font-semibold">Available on Backorder</p>
              ) : null}
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mb-4 md:mb-6 px-0 md:px-15">
              <div className="flex items-center justify-center border border-accent rounded">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 md:p-3 text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                  disabled={quantity <= 1}
                >
                  <Minus size={14} className="md:w-4 md:h-4"/>
                </button>
                <span className="px-4 md:px-6 text-accent text-base md:text-lg font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.availableStockQuantity, quantity + 1))}
                  className="p-2 md:p-3 text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                  disabled={quantity >= product.availableStockQuantity}
                >
                  <Plus size={14} className="md:w-4 md:h-4" />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.inventoryStatus === 'OutOfStock' || addingToCart}
                className="flex-1 bg-accent text-white py-2.5 md:py-3 px-4 md:px-6 rounded text-sm md:text-base font-medium hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Add to Cart
                  </>
                )}
              </button>

              <button 
                onClick={handleBuyNow}
                disabled={product.inventoryStatus === 'OutOfStock'}
                className="sm:flex-none bg-accent text-white py-2.5 md:py-3 px-4 md:px-6 rounded text-sm md:text-base font-medium hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Product Description */}
            <div className="border-accent border-t pt-4 md:pt-6 px-0 md:px-15">
              <h3 className="text-base md:text-lg font-semibold text-dark mb-2 md:mb-3">Product Description</h3>
              <div className="text-xs md:text-sm text-gray-700 space-y-1 md:space-y-2">
                <p>{product.productDescription}</p>
              </div>
            </div>

            {/* Additional Info */}
            {(product.productWarrantyInfo || product.productReturnPolicy) && (
              <div className="border-t pt-4 mt-4 space-y-2 text-sm px-0 md:px-15">
                {product.productWarrantyInfo && (
                  <p><strong>Warranty:</strong> {product.productWarrantyInfo}</p>
                )}
                {product.productReturnPolicy && (
                  <p><strong>Return Policy:</strong> {product.productReturnPolicy}</p>
                )}
              </div>
            )}
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
              onClick={() => setActiveTab('specifications')}
              className={`pb-2 md:pb-3 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
                activeTab === 'specifications' 
                  ? 'text-dark border-b-2 border-accent' 
                  : 'text-gray-400'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 md:pb-3 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
                activeTab === 'reviews' 
                  ? 'text-dark border-b-2 border-accent' 
                  : 'text-gray-400'
              }`}
            >
              Reviews({reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'description' && (
            <div className="text-sm md:text-base text-gray-700">
              <p className="mb-4">{product.productDescription}</p>
              {product.productMaterial && (
                <p className="mb-2"><strong>Material:</strong> {product.productMaterial}</p>
              )}
              {product.productWeight && (
                <p className="mb-2"><strong>Weight:</strong> {product.productWeight}g</p>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 md:py-4 text-dark font-medium w-1/3 text-sm md:text-base">Product Code</td>
                    <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">{product.productCode}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 md:py-4 text-dark font-medium text-sm md:text-base">Brand</td>
                    <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">{product.productBrand}</td>
                  </tr>
                  {product.productWeight && (
                    <tr className="border-b">
                      <td className="py-3 md:py-4 text-dark font-medium text-sm md:text-base">Weight</td>
                      <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">{product.productWeight}g</td>
                    </tr>
                  )}
                  {product.waxType && (
                    <tr className="border-b">
                      <td className="py-3 md:py-4 text-dark font-medium text-sm md:text-base">Wax Type</td>
                      <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">{product.waxType}</td>
                    </tr>
                  )}
                  {product.productMaterial && (
                    <tr className="border-b">
                      <td className="py-3 md:py-4 text-dark font-medium text-sm md:text-base">Material</td>
                      <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">{product.productMaterial}</td>
                    </tr>
                  )}
                  {product.singleOrCombo && (
                    <tr className="border-b">
                      <td className="py-3 md:py-4 text-dark font-medium text-sm md:text-base">Type</td>
                      <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">{product.singleOrCombo}</td>
                    </tr>
                  )}
                  {product.productColors && Array.isArray(product.productColors) && product.productColors.length > 0 && (
                    <tr className="border-b">
                      <td className="py-3 md:py-4 text-dark font-medium text-sm md:text-base">Colors</td>
                      <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">{product.productColors.join(', ')}</td>
                    </tr>
                  )}
                  {product.productSizes && Array.isArray(product.productSizes) && product.productSizes.length > 0 && (
                    <tr className="border-b">
                      <td className="py-3 md:py-4 text-dark font-medium text-sm md:text-base">Sizes</td>
                      <td className="py-3 md:py-4 text-gray-700 text-sm md:text-base">{product.productSizes.join(', ')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 md:space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review: Review) => (
                  <div key={review.id} className="border-b pb-4 md:pb-6 last:border-0">
                    {/* Rating */}
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < (review.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Reviewer Name */}
                    <p className="text-sm font-semibold text-dark mb-2">{review.user.fullName || 'Anonymous'}</p>

                    {/* Review Text */}
                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-serif text-dark">Similar Products</h2>
              <Link href="/categories" className="text-accent hover:underline text-xs md:text-sm">See More →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  productId={prod.id}
                  image={prod.coverImageUrl}
                  title={prod.category?.categoryName || ''}
                  description={prod.productName}
                  originalPrice={prod.productPrice}
                  discountedPrice={prod.productDiscountPrice || prod.productPrice}
                  discount={prod.productDiscountPercentage || 0}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
