import api from '@/lib/axios'

export interface Banner {
  id: number
  title: string
  image: string
  createdAt: string
  updatedAt: string
}

export interface BannersResponse {
  success: boolean
  message: string
  banners: Banner[]
}

// Get homepage banners (Hero section - limit 3)
export const getHomepageBanners = async (): Promise<BannersResponse> => {
  const response = await api.get('/advertisement/homepage-banners')
  return response.data
}

// Get weekly promotion banners (PromotionBanner1 - limit 4)
export const getWeeklyPromotionBanners = async (): Promise<BannersResponse> => {
  const response = await api.get('/advertisement/weekly-banners')
  console.log(response.data)
  return response.data
}

// Get popular banners (PromotionBanner2 - limit 1)
export const getPopularBanners = async (): Promise<BannersResponse> => {
  const response = await api.get('/advertisement/popular-banners')
  return response.data
}

// Get brand poster banners (BrandPromotion - limit 1)
export const getBrandPosterBanners = async (): Promise<BannersResponse> => {
  const response = await api.get('/advertisement/brands-banners')
  return response.data
}

// Get product poster ads banners (limit 4)
export const getProductPosterAdsBanners = async (): Promise<BannersResponse> => {
  const response = await api.get('/advertisement/products-banners')
  return response.data
}
