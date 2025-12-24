import api from '@/lib/axios'

export interface Product {
  id: number
  productName: string
  productDescription: string
  productBrand: string
  productCode: string
  productPrice: number
  productDiscountPrice?: number
  productDiscountPercentage?: number
  coverImageUrl: string
  galleryImageUrls?: string[]
  productVideoUrl?: string
  averageCustomerRating: number
  totalCustomerReviews: number
  availableStockQuantity: number
  inventoryStatus: 'InStock' | 'onSale' | 'OutOfStock' | 'BackOrder'
  productCategoryId: number
  productSubCategoryId: number
  productTags?: string[]
  productSizes?: string[]
  productColors?: string[]
  productDimensions?: number | string
  productMaterial?: string
  productWeight?: number
  productWarrantyInfo?: string
  productReturnPolicy?: string
  waxType?: string
  singleOrCombo?: 'Single' | 'Combo'
  productViewCount: number
  totalSoldCount: number
  isNewArrivalProduct: boolean
  status: 'pending' | 'approved' | 'rejected'
  category?: {
    id: number
    categoryName: string
  }
  subcategory?: {
    id: number
    subCategoryName: string
  }
  seller?: {
    id: number
    sellerName: string
    email: string
    shopName: string
  }
  createdAt: string
  updatedAt: string
}

export interface Review{
    id: number,
    productId: number,
    userId: number,
    rating?: number,
    comment?: string,
    createdAt: string,
    updatedAt: string,
    user: {
        id: number,
        fullName:  string,
        profilePhoto?: string
    }
}

export interface ProductsResponse {
  success: boolean
  products: Product[]
  count?: number
  message?: string
}

export interface ProductResponse {
  success: boolean
  product: Product
  message?: string
}

export interface ReviewsResponse {
  success: boolean
  reviews: Review[]
  message?: string
}

export interface SearchSuggestionsResponse {
  success: boolean
  suggestions: string[]
}

export interface GetAllProductsParams {
  categories?: string // comma-separated
  brands?: string // comma-separated
  minPrice?: number
  maxPrice?: number
  inventoryStatus?: string // comma-separated
  colors?: string // comma-separated
  sortBy?: 'popular' | 'rating' | 'priceLowToHigh' | 'priceHighToLow' | 'latest'
}

// Get all products with filters
export const getAllProducts = async (params?: GetAllProductsParams): Promise<ProductsResponse> => {
  const queryParams = new URLSearchParams()
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }
  
  const queryString = queryParams.toString()
  const url = `/general/products${queryString ? `?${queryString}` : ''}`
  
  const response = await api.get(url)
  return response.data
}

// Get product by ID
export const getProductById = async (productId: number | string): Promise<ProductResponse> => {
  const response = await api.get(`/general/products/${productId}`)
  return response.data
}

// Search products
export const searchProducts = async (query: string): Promise<ProductsResponse> => {
  const response = await api.get(`/general/products/search/query?query=${encodeURIComponent(query)}`)
  return response.data
}

// Get search suggestions
export const getSearchSuggestions = async (query: string): Promise<SearchSuggestionsResponse> => {
  const response = await api.get(`/general/search/suggestions?q=${encodeURIComponent(query)}`)
  return response.data
}

// Get products by category
export const getProductsByCategory = async (categoryName: string): Promise<ProductsResponse> => {
  const response = await api.get(`/general/products/category/${encodeURIComponent(categoryName)}`)
  return response.data
}

// Get products by subcategory
export const getProductsBySubCategory = async (subCategoryName: string): Promise<ProductsResponse> => {
  const response = await api.get(`/general/products/subcategory/${encodeURIComponent(subCategoryName)}`)
  return response.data
}

// Get products by multiple categories
export const getProductsByCategories = async (categories: string[]): Promise<ProductsResponse> => {
  const categoriesParam = categories.join(',')
  const response = await api.get(`/general/products/by-categories?categories=${encodeURIComponent(categoriesParam)}`)
  return response.data
}

// Get products by brand
export const getProductsByBrand = async (brandName: string): Promise<ProductsResponse> => {
  const response = await api.get(`/general/products/brand/${encodeURIComponent(brandName)}`)
  return response.data
}

// Get recent products
export const getRecentProducts = async (): Promise<ProductsResponse> => {
  const response = await api.get('/general/products/recent/latest')
  return response.data
}

// Get similar products
export const getSimilarProducts = async (productId: number | string): Promise<ProductsResponse> => {
  const response = await api.get(`/general/products/similar/${productId}`)
  return response.data
}

// Get product reviews
export const getProductReviews = async (productId: number | string) : Promise<ReviewsResponse> => {
  const response = await api.get(`/general/products/review/${productId}`)
  return response.data
}
