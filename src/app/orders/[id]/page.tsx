'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Package, MapPin, CreditCard, Calendar, Star, Trash2 } from 'lucide-react'
import { getOrderDetails, type Order } from '@/services/orderService'
import { toast } from 'react-hot-toast'
import CandleLoader from '@/components/CandleLoader'
import ReviewFormModal from '@/components/modals/ReviewFormModal'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'
import { reviewAPI } from '@/services/reviewService'

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedProductForReview, setSelectedProductForReview] = useState<{
    productId: number
    productName: string
  } | null>(null)
  const [reviewedProducts, setReviewedProducts] = useState<Set<number>>(new Set())
  const [userReviews, setUserReviews] = useState<Map<number, { id: number; rating: number; reviewText: string; reviewPhoto?: string }>>(new Map())
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await getOrderDetails(Number(orderId))
        setOrder(response.order)
        
        // Fetch user's reviews to check which products have already been reviewed
        try {
          const userReviewsRes = await reviewAPI.getUserReviews()
          if (userReviewsRes.reviews && userReviewsRes.reviews.length > 0) {
            const reviewMap = new Map<number, { id: number; rating: number; reviewText: string; reviewPhoto?: string }>()
            const reviewedSet = new Set<number>()
            
            userReviewsRes.reviews.forEach(review => {
              reviewMap.set(review.productId, {
                id: review.id,
                rating: review.rating,
                reviewText: review.reviewText,
                reviewPhoto: review.reviewPhoto
              })
              reviewedSet.add(review.productId)
            })
            
            setUserReviews(reviewMap)
            setReviewedProducts(reviewedSet)
          }
        } catch (error) {
          console.error('Error fetching user reviews:', error)
        }
      } catch (error: unknown) {
        console.error('Error fetching order:', error)
        toast.error('Failed to load order details')
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } }
          if (axiosError.response?.status === 401) {
            router.push('/auth/login')
          } else if (axiosError.response?.status === 404) {
            router.push('/account/orders')
          }
        }
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, router])

  const handleWriteReview = (productId: number, productName: string) => {
    setSelectedProductForReview({ productId, productName })
    setIsReviewModalOpen(true)
  }

  const handleReviewSubmitted = async () => {
    // Refresh user's reviews to update the UI
    try {
      const userReviewsRes = await reviewAPI.getUserReviews()
      if (userReviewsRes.reviews && userReviewsRes.reviews.length > 0) {
        const reviewMap = new Map<number, { id: number; rating: number; reviewText: string; reviewPhoto?: string }>()
        const reviewedSet = new Set<number>()
        
        userReviewsRes.reviews.forEach(review => {
          reviewMap.set(review.productId, {
            id: review.id,
            rating: review.rating,
            reviewText: review.reviewText,
            reviewPhoto: review.reviewPhoto
          })
          reviewedSet.add(review.productId)
        })
        
        setUserReviews(reviewMap)
        setReviewedProducts(reviewedSet)
      }
    } catch (error) {
      console.error('Error refreshing reviews:', error)
    }
  }

  const handleDeleteReview = async (productId: number) => {
    setProductToDelete(productId)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteReview = async () => {
    if (!productToDelete) return

    const reviewData = userReviews.get(productToDelete)
    if (!reviewData) return

    setIsDeleting(true)

    try {
      await reviewAPI.deleteReview(reviewData.id)
      toast.success('Review deleted successfully')
      
      // Remove from state
      const newReviewMap = new Map(userReviews)
      newReviewMap.delete(productToDelete)
      setUserReviews(newReviewMap)
      
      const newReviewedSet = new Set(reviewedProducts)
      newReviewedSet.delete(productToDelete)
      setReviewedProducts(newReviewedSet)
      
      // Close modal
      setIsDeleteModalOpen(false)
      setProductToDelete(null)
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete review')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false)
      setProductToDelete(null)
    }
  }

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false)
    setSelectedProductForReview(null)
  }

  if (loading) {
    return <CandleLoader />
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Order not found</p>
          <Link href="/account/orders" className="text-accent hover:underline">
            View all orders
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Processing': return 'bg-blue-100 text-blue-800'
      case 'Shipped': return 'bg-purple-100 text-purple-800'
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 md:px-8 lg:px-14 py-4 md:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-accent hover:underline font-medium">Home</Link>
          <ChevronRight size={16} className="text-gray-400" />
          <Link href="/account/orders" className="text-accent hover:underline font-medium">Orders</Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-700 font-medium">Order Details</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif text-gray-900 mb-6">Order Details</h1>

        {/* Order Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Order #{order.uniqueOrderId}</h2>
              <p className="text-sm text-gray-600">
                Placed on {new Date(order.orderDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={20} className="text-accent" />
                Order Items
              </h3>
              <div className="space-y-4">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex gap-4">
                      <Link href={`/product/${item.productId}`} className="shrink-0">
                        <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={item.productImageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.productId}`}>
                          <h4 className="font-medium text-gray-900 hover:text-accent transition-colors">
                            {item.productName}
                          </h4>
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600 mt-1">Price: Rs.{item.price}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-gray-900">Rs.{item.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {/* Review Button - Only show if order is delivered */}
                    {order.orderStatus === 'Delivered' && (
                      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => handleWriteReview(item.productId, item.productName)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-accent text-white hover:bg-opacity-90"
                        >
                          <Star size={16} />
                          {reviewedProducts.has(item.productId) ? 'Edit Review' : 'Write Review'}
                        </button>
                        {reviewedProducts.has(item.productId) && (
                          <button
                            onClick={() => handleDeleteReview(item.productId)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-red-500 text-white hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-accent" />
                Shipping Address
              </h3>
              {order.shippingAddress && (
                <div className="text-gray-700">
                  <p className="font-medium">{order.shippingAddress.recipientName}</p>
                  <p className="mt-2">{order.shippingAddress.streetAddress}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">Phone: {order.shippingAddress.phoneNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

              {/* Payment Info */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={18} className="text-accent" />
                  <span className="font-medium text-gray-900">Payment Method</span>
                </div>
                <p className="text-sm text-gray-600">{order.paymentMethod?.replace(/([A-Z])/g, ' $1').trim() || 'N/A'}</p>
                {/* <p className="text-sm text-gray-600 mt-1">
                  Status: <span className={`font-medium ${order.paymentStatus === 'Completed' ? 'text-green-600' : order.paymentStatus === 'Pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {order.paymentStatus}
                  </span>
                </p> */}
              </div>

              {/* Dates */}
              <div className="mb-4 pb-4 border-b space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar size={18} className="text-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                {order.shippingDate && (
                  <div className="flex items-start gap-2">
                    <Calendar size={18} className="text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Shipping Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.shippingDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {order.deliveryDate && (
                  <div className="flex items-start gap-2">
                    <Calendar size={18} className="text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivery Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-accent">Rs.{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/account/orders">
                <button className="w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                  View All Orders
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDeleteReview}
        isDeleting={isDeleting}
      />

      {/* Review Form Modal */}
      {selectedProductForReview && (
        <ReviewFormModal
          isOpen={isReviewModalOpen}
          onClose={handleCloseReviewModal}
          productId={selectedProductForReview.productId}
          productName={selectedProductForReview.productName}
          onReviewSubmitted={handleReviewSubmitted}
          existingReview={userReviews.get(selectedProductForReview.productId) || null}
        />
      )}
    </div>
  )
}
