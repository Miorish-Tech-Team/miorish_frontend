import axios from '@/lib/axios'

// Types
export interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: number
  totalPrice: number
  productName: string
  productImageUrl: string
}

export interface ShippingAddress {
  recipientName: string
  phoneNumber: string
  streetAddress: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Order {
  id: number
  uniqueOrderId: string
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  totalAmount: number
  paymentStatus: 'Pending' | 'Completed' | 'Failed'
  paymentMethod?: 'CashOnDelivery' | 'Razorpay'
  orderDate: string
  shippingDate?: string
  deliveryDate?: string
  createdAt: string
  updatedAt: string
  orderItems?: OrderItem[]
  shippingAddress?: ShippingAddress
}

export interface BuyNowParams {
  productId: number
  quantity: number
  addressId: number
  paymentMethod: 'CashOnDelivery' | 'Razorpay'
  shippingCost?: number
  idempotencyKey?: string
  selectedColor?: string
}

export interface PlaceOrderFromCartParams {
  addressId: number
  paymentMethod: 'CashOnDelivery' | 'Razorpay'
  shippingCost?: number
  idempotencyKey?: string
}

export interface BuyNowResponse {
  message: string
  orderId: string
  order: Order
  orderItem: OrderItem
}

export interface PlaceOrderResponse {
  message: string
  uniqueOrderId: string
  order: Order
}

export interface GetOrdersResponse {
  success: boolean
  count: number
  orders: Order[]
}

export interface GetOrderDetailsResponse {
  success: boolean
  order: Order
}

// API Functions

/**
 * Buy product now (direct purchase)
 */
export const buyNow = async (params: BuyNowParams): Promise<BuyNowResponse> => {
  const response = await axios.post('/user/order/buy-now', params)
  return response.data
}

/**
 * Place order from cart
 */
export const placeOrderFromCart = async (params: PlaceOrderFromCartParams): Promise<PlaceOrderResponse> => {
  const response = await axios.post('/user/order/place-order-from-cart', params)
  return response.data
}

/**
 * Get user's orders (optional status filter)
 */
export const getUserOrders = async (status?: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'): Promise<GetOrdersResponse> => {
  const params = status ? { status } : {}
  const response = await axios.get('/user/my-orders', { params })
  return response.data
}

/**
 * Get single order details
 */
export const getOrderDetails = async (orderId: number): Promise<GetOrderDetailsResponse> => {
  const response = await axios.get(`/user/my-orders/${orderId}`)
  return response.data
}

/**
 * Create Razorpay order for Buy Now
 */
export const createRazorpayOrderForBuyNow = async (params: {
  productId: number
  quantity: number
  addressId: number
  shippingCost?: number
  selectedColor?: string
}) => {
  const response = await axios.post('/user/buy-now/create-order', params)
  return response.data
}

/**
 * Verify Razorpay payment for Buy Now
 */
export const verifyRazorpayBuyNowPayment = async (params: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  productId: number
  quantity: number
  addressId: number
  shippingCost?: number
  idempotencyKey?: string
  selectedColor?: string
}) => {
  const response = await axios.post('/user/buy-now/verify', params)
  return response.data
}

/**
 * Create Razorpay order for Cart
 */
export const createRazorpayOrderForCart = async (params: {
  addressId: number
  shippingCost?: number
}) => {
  const response = await axios.post('/user/cart/create-order', params)
  return response.data
}

/**
 * Verify Razorpay payment for Cart
 */
export const verifyRazorpayCartPayment = async (params: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  addressId: number
  shippingCost?: number
  idempotencyKey?: string
}) => {
  const response = await axios.post('/user/cart/verify', params)
  return response.data
}
