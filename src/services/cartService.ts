import axios from '@/lib/axios'

// Types
export interface CartItem {
  id: number
  cartId: number
  productId: number
  selectedSize?: string
  selectedColor?: string
  quantity: number
  price: number
  totalPrice: number
  createdAt: string
  updatedAt: string
  Product: {
    id: number
    productName: string
    productDescription: string
    productPrice: number
    productDiscountPrice?: number
    coverImageUrl: string
    availableStockQuantity: number
    productBrand: string
  }
}

export interface Cart {
  id: number
  userId: number
  status: 'active' | 'ordered' | 'cancelled'
  createdAt: string
  updatedAt: string
  CartItems: CartItem[]
}

export interface CartSummary {
  totalItems: number
  totalPrice: number
}

export interface CartWithSummary {
  cart: Cart
  summary: CartSummary
}

export interface AddToCartParams {
  productId: number
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

export interface UpdateCartItemParams {
  quantity: number
}

export interface CartApiResponse {
  success: boolean
  message: string
}

// API Functions

/**
 * Add product to cart
 */
export const addToCart = async (params: AddToCartParams) => {
  const response = await axios.post('/user/cart/add', params)
  return response.data
}



/**
 * Get user's cart with summary
 */
export const getUserCartWithSummary = async (): Promise<CartWithSummary | { cart: [], summary: CartSummary, message: string }> => {
  const response = await axios.get('/user/cart-with-summery')
  return response.data
}

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (itemId: number, params: UpdateCartItemParams): Promise<CartApiResponse> => {
  const response = await axios.put<CartApiResponse>(`/user/cart/update/${itemId}`, params)
  return response.data
}

/**
 * Remove single item from cart
 */
export const removeCartItem = async (itemId: number) => {
  const response = await axios.delete(`/user/cart/remove/${itemId}`)
  return response.data
}

/**
 * Remove all items from cart
 */
export const removeAllCartItems = async () => {
  const response = await axios.delete('/user/cart/remove-all')
  return response.data
}


