import api from '@/lib/axios'

export interface WishlistItem {
  id: number
  userId: number
  productId: number
  createdAt: string
  updatedAt: string
  Product: {
    id: number
    productName: string
    productDescription: string
    productPrice: number
    productDiscountPrice?: number
    productDiscountPercentage?: number
    coverImageUrl: string
    productBrand?: string
    availableStockQuantity: number
    productCategoryId: number
    productSubCategoryId: number
  }
}

export interface WishlistResponse {
  success: boolean
  wishlistCount: number
  wishlist: WishlistItem[]
}

export interface AddToWishlistResponse {
  success: boolean
  wishlistItem: WishlistItem
  message?: string
}

export interface RemoveFromWishlistResponse {
  success: boolean
  message: string
}

// Get user's wishlist
export const getUserWishlist = async (): Promise<WishlistResponse> => {
  const response = await api.get<WishlistResponse>('/user/wishlist')
  return response.data
}

// Add product to wishlist
export const addToWishlist = async (productId: number): Promise<AddToWishlistResponse> => {
  console.log('Adding to wishlist, productId:', productId, 'type:', typeof productId)
  
  if (!productId || isNaN(Number(productId))) {
    throw new Error('Invalid product ID')
  }
  
  const response = await api.post<AddToWishlistResponse>('/user/wishlist/add', { 
    productId: Number(productId) 
  })
  return response.data
}

// Remove items from wishlist
export const removeFromWishlist = async (wishlistIds: number[]): Promise<RemoveFromWishlistResponse> => {
  const response = await api.delete<RemoveFromWishlistResponse>('/user/wishlist/remove', {
    data: { wishlistIds }
  })
  return response.data
}

// Remove product from wishlist by product ID
export const removeFromWishlistByProductId = async (productId: number): Promise<RemoveFromWishlistResponse> => {
  const response = await api.delete<RemoveFromWishlistResponse>('/user/wishlist/remove-product', {
    data: { productId }
  })
  return response.data
}
