import api from '@/lib/axios'

export interface AddReviewData {
  productId: number
  rating: number
  reviewText: string
  reviewPhoto?: File
}

export interface UpdateReviewData {
  rating?: number
  reviewText?: string
  reviewPhoto?: File
}

export interface ReviewResponse {
  success: boolean
  message?: string
  review?: {
    id: number
    productId: number
    userId: number
    rating: number
    reviewText: string
    reviewPhoto?: string
    reviewDate: string
  }
}

export interface UserReviewsResponse {
  success: boolean
  reviews: Array<{
    id: number
    productId: number
    rating: number
    reviewText: string
    reviewPhoto?: string
    reviewDate: string
    product: {
      id: number
      productName: string
      coverImageUrl: string
      productPrice: number
    }
  }>
}

// Review API Service
export const reviewAPI = {
  // Add a review
  addReview: async (data: AddReviewData): Promise<ReviewResponse> => {
    const formData = new FormData()
    formData.append('productId', data.productId.toString())
    formData.append('rating', data.rating.toString())
    formData.append('reviewText', data.reviewText)
    
    if (data.reviewPhoto) {
      formData.append('reviewPhoto', data.reviewPhoto)
    }

    const response = await api.post('/user/review/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Update a review
  updateReview: async (reviewId: number, data: UpdateReviewData): Promise<ReviewResponse> => {
    const formData = new FormData()
    
    if (data.rating !== undefined) {
      formData.append('rating', data.rating.toString())
    }
    if (data.reviewText !== undefined) {
      formData.append('reviewText', data.reviewText)
    }
    if (data.reviewPhoto) {
      formData.append('reviewPhoto', data.reviewPhoto)
    }

    const response = await api.put(`/user/review/${reviewId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete a review
  deleteReview: async (reviewId: number): Promise<ReviewResponse> => {
    const response = await api.delete(`/user/review/${reviewId}`)
    return response.data
  },

  // Get user's reviews
  getUserReviews: async (): Promise<UserReviewsResponse> => {
    const response = await api.get('/user/my-reviews')
    return response.data
  },
}
