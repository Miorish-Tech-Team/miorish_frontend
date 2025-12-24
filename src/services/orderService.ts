import axios from '@/lib/axios'

// Types
export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  totalPrice: number
  productName: string
  productImageUrl: string
  createdAt: string
  updatedAt: string
  product?: {
    id: number
    productName: string
    productDescription?: string
    productPrice: number
    coverImageUrl: string
  }
}

export interface ShippingAddress {
  id: number
  userId: number
  recipientName: string
  phoneNumber: string
  streetAddress: string
  city: string
  state: string
  postalCode: string
  country: string
  addressType?: string
  isDefault: boolean
}

export interface Order {
  id: number
  uniqueOrderId: string
  userId: number
  cartId?: number
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  totalAmount: number
  addressId: number
  paymentStatus: 'Pending' | 'Completed' | 'Failed'
  paymentMethod: 'CreditCard' | 'DebitCard' | 'PayPal' | 'CashOnDelivery'
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
  paymentMethod: 'CreditCard' | 'DebitCard' | 'PayPal' | 'CashOnDelivery'
}

export interface PlaceOrderFromCartParams {
  addressId: number
  paymentMethod: 'CreditCard' | 'DebitCard' | 'PayPal' | 'CashOnDelivery' | 'Stripe'
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
