import api from '@/lib/axios'
import { AxiosInstance } from 'axios'

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
export const getHomepageBanners = async (apiInstance: AxiosInstance = api): Promise<BannersResponse> => {
  const response = await apiInstance.get('/advertisement/homepage-banners')
  return response.data
}

// Get weekly promotion banners (PromotionBanner1 - limit 4)
export const getWeeklyPromotionBanners = async (apiInstance: AxiosInstance = api): Promise<BannersResponse> => {
  const response = await apiInstance.get('/advertisement/weekly-banners')
  return response.data
}

// Get popular banners (PromotionBanner2 - limit 1)
export const getPopularBanners = async (apiInstance: AxiosInstance = api): Promise<BannersResponse> => {
  const response = await apiInstance.get('/advertisement/popular-banners')
  return response.data
}

// Get brand poster banners (BrandPromotion - limit 1)
export const getBrandPosterBanners = async (apiInstance: AxiosInstance = api): Promise<BannersResponse> => {
  const response = await apiInstance.get('/advertisement/brands-banners')
  return response.data
}
