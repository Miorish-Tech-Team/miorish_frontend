import axios from '@/lib/axios'

// Types
export interface ApplyCouponParams {
  productId: number
  quantity: number
  couponCode: string
}

export interface ApplyCouponResponse {
  message: string
  discountAmount: number
}

// API Functions

/**
 * Apply coupon to product
 */
export const applyCouponToProduct = async (params: ApplyCouponParams): Promise<ApplyCouponResponse> => {
  const response = await axios.post('/user/coupon/apply', params)
  return response.data
}
