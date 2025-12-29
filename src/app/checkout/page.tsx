'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Loader2, MapPin, CreditCard, Check, Plus } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { getUserAddresses, type Address } from '@/services/addressService'
import { 
  buyNow, 
  placeOrderFromCart, 
  createRazorpayOrderForBuyNow, 
  createRazorpayOrderForCart,
  verifyRazorpayBuyNowPayment,
  verifyRazorpayCartPayment
} from '@/services/orderService'
import { toast } from 'react-hot-toast'
import AddressFormModal from '@/components/modals/AddressFormModal'
import CandleLoader from '@/components/CandleLoader'

type PaymentMethod = 'CashOnDelivery' | 'Razorpay'

// Add interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkoutType = searchParams.get('type') // 'cart' or 'buynow'
  const { cart, summary, refreshCart } = useCart()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CashOnDelivery')
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [showAddressManager, setShowAddressManager] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure' | null>(null)
  const [completedOrderId, setCompletedOrderId] = useState<number | null>(null)

  // Buy Now data from session storage
  const [buyNowData, setBuyNowData] = useState<{
    productId: number
    quantity: number
    selectedSize?: string
    selectedColor?: string
    product: {
      id: number
      productName: string
      coverImageUrl: string
      productPrice: number
      productDiscountPrice?: number
    }
  } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // If buy now, get data from session storage
        if (checkoutType === 'buynow') {
          const data = sessionStorage.getItem('buyNowData')
          if (data) {
            setBuyNowData(JSON.parse(data))
          } else {
            toast.error('No product data found')
            router.push('/categories')
            return
          }
        }

        // Fetch addresses
        const addressesRes = await getUserAddresses()
        setAddresses(addressesRes.addresses)

        // Auto-select default address
        const defaultAddr = addressesRes.addresses.find(addr => addr.isDefault)
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id)
        } else if (addressesRes.addresses.length > 0) {
          setSelectedAddressId(addressesRes.addresses[0].id)
        }
      } catch (error: unknown) {
        console.error('Error loading checkout data:', error)
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } }
          if (axiosError.response?.status === 401) {
            toast.error('Please login to continue')
            router.push('/auth/login')
          } else {
            toast.error('Failed to load checkout data')
          }
        } else {
          toast.error('Failed to load checkout data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [checkoutType, router])

  // Refresh addresses when modal closes
  const handleAddressAdded = async () => {
    try {
      const addressesRes = await getUserAddresses()
      setAddresses(addressesRes.addresses)
      
      // Auto-select newly added address if it's default
      const defaultAddr = addressesRes.addresses.find(addr => addr.isDefault)
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id)
      } else if (addressesRes.addresses.length > 0 && !selectedAddressId) {
        // If no address was selected, select the first one
        setSelectedAddressId(addressesRes.addresses[0].id)
      }
    } catch (error) {
      console.error('Error refreshing addresses:', error)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address')
      return
    }

    try {
      setPlacing(true)

      // If COD, place order directly
      if (paymentMethod === 'CashOnDelivery') {
        if (checkoutType === 'buynow' && buyNowData) {
          const response = await buyNow({
            productId: buyNowData.productId,
            quantity: buyNowData.quantity,
            addressId: selectedAddressId,
            paymentMethod: 'CashOnDelivery'
          })

          toast.success(`Order placed successfully! Order ID: ${response.orderId}`)
          sessionStorage.removeItem('buyNowData')
          router.push(`/orders/${response.order.id}`)
        } else {
          const response = await placeOrderFromCart({
            addressId: selectedAddressId,
            paymentMethod: 'CashOnDelivery'
          })

          toast.success(`Order placed successfully! Order ID: ${response.uniqueOrderId}`)
          await refreshCart()
          router.push(`/orders/${response.order.id}`)
        }
      } else {
        // Razorpay payment
        await handleRazorpayPayment()
      }
    } catch (error: unknown) {
      console.error('Error placing order:', error)
      const message = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined
      toast.error(message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  const handleRazorpayPayment = async () => {
    try {
      let razorpayOrderData

      // Create Razorpay order
      if (checkoutType === 'buynow' && buyNowData) {
        razorpayOrderData = await createRazorpayOrderForBuyNow({
          productId: buyNowData.productId,
          quantity: buyNowData.quantity,
          addressId: selectedAddressId!
        })
      } else {
        razorpayOrderData = await createRazorpayOrderForCart({
          addressId: selectedAddressId!
        })
      }

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      // Configure Razorpay options
      const options = {
        key: razorpayOrderData.keyId,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        name: 'Miorish',
        description: checkoutType === 'buynow' ? 'Product Purchase' : 'Cart Checkout',
        order_id: razorpayOrderData.orderId,
        theme: {
          color: '#D4B996' // Your website's accent color
        },
        handler: async (response: any) => {
          // Payment successful
          try {
            let verifyResponse
            
            if (checkoutType === 'buynow' && buyNowData) {
              verifyResponse = await verifyRazorpayBuyNowPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productId: buyNowData.productId,
                quantity: buyNowData.quantity,
                addressId: selectedAddressId!
              })
              sessionStorage.removeItem('buyNowData')
            } else {
              verifyResponse = await verifyRazorpayCartPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                addressId: selectedAddressId!
              })
              await refreshCart()
            }

            setCompletedOrderId(verifyResponse.order.id)
            setPaymentStatus('success')
            setShowPaymentModal(true)
            setPlacing(false)
          } catch (error) {
            console.error('Payment verification error:', error)
            setPaymentStatus('failure')
            setShowPaymentModal(true)
            setPlacing(false)
          }
        },
        modal: {
          ondismiss: () => {
            setPlacing(false)
            toast.error('Payment cancelled')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Razorpay error:', error)
      toast.error('Failed to initiate payment')
      setPlacing(false)
    }
  }

  if (loading) {
    return <CandleLoader />
  }

  // Calculate totals
  let itemsToShow: Array<{
    id: number
    name: string
    image: string
    price: number
    quantity: number
  }> = []
  let subtotal = 0

  if (checkoutType === 'buynow' && buyNowData) {
    const product = buyNowData.product
    const price = product.productDiscountPrice || product.productPrice
    subtotal = price * buyNowData.quantity
    itemsToShow = [{
      id: product.id,
      name: product.productName,
      image: product.coverImageUrl,
      price,
      quantity: buyNowData.quantity
    }]
  } else {
    itemsToShow = (cart?.CartItems || []).map(item => ({
      id: item.Product.id,
      name: item.Product.productName,
      image: item.Product.coverImageUrl,
      price: item.Product.productDiscountPrice || item.Product.productPrice,
      quantity: item.quantity
    }))
    subtotal = summary.totalPrice
  }

  const shipping = 0 // Free shipping
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 md:px-8 lg:px-14 py-4 md:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-accent hover:underline font-medium">Home</Link>
          <ChevronRight size={16} className="text-gray-400" />
          {checkoutType === 'cart' && (
            <>
              <Link href="/account/cart" className="text-accent hover:underline font-medium">Cart</Link>
              <ChevronRight size={16} className="text-gray-400" />
            </>
          )}
          <span className="text-gray-700 font-medium">Checkout</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif text-gray-900 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin size={20} className="text-accent" />
                  Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddressManager(true)}
                  className="text-sm text-accent hover:underline font-medium flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add New
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No addresses found</p>
                  <button
                    onClick={() => setShowAddressManager(true)}
                    className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-accent bg-accent/5'
                          : 'border-gray-200 hover:border-accent/50'
                      }`}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAddressId === addr.id
                                ? 'border-accent bg-accent'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedAddressId === addr.id && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{addr.recipientName}</h3>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Phone: {addr.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-accent" />
                Payment Method
              </h2>

              <div className="space-y-3">
                {(['CashOnDelivery', 'Razorpay'] as PaymentMethod[]).map((method) => (
                  <div
                    key={method}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === method
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-accent/50'
                    }`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === method
                            ? 'border-accent bg-accent'
                            : 'border-gray-300'
                        }`}
                      >
                        {paymentMethod === method && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">
                        {method === 'CashOnDelivery' ? 'Cash on Delivery (COD)' : 'Pay Online with Razorpay'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 pb-4 border-b">
                {itemsToShow.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-primary">Rs.{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-accent">Rs.{total.toFixed(2)}</span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || placing}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  selectedAddressId && !placing
                    ? 'bg-accent text-white hover:bg-opacity-90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {placing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>

              {!selectedAddressId && (
                <p className="text-xs text-red-600 text-center mt-2">
                  Please select a delivery address
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Form Modal */}
        <AddressFormModal
          isOpen={showAddressManager}
          onClose={() => setShowAddressManager(false)}
          onAddressAdded={handleAddressAdded}
        />

        {/* Payment Status Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {paymentStatus === 'success' ? (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                  <p className="text-gray-600 mb-6">
                    Your payment was successful and your order has been placed.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setShowPaymentModal(false)
                        router.push(`/orders/${completedOrderId}`)
                      }}
                      className="w-full bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                      View Order
                    </button>
                    <button
                      onClick={() => {
                        setShowPaymentModal(false)
                        router.push('/categories')
                      }}
                      className="w-full border-2 border-accent text-accent px-6 py-3 rounded-lg font-medium hover:bg-accent/5 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed!</h2>
                  <p className="text-gray-600 mb-6">
                    Unfortunately, your payment could not be processed. Please try again.
                  </p>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false)
                      setPaymentStatus(null)
                    }}
                    className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CandleLoader />}>
      <CheckoutForm />
    </Suspense>
  )
}
