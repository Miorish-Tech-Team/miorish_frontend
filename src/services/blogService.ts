import api from '@/lib/axios'
import { AxiosInstance } from 'axios';

export interface Blog {
  id: number
  userId: number
  title: string
  description: string
  image: string | null
  views: number
  createdAt: string
  updatedAt: string
  author?: {
    id: number
    email: string
    fullName: string
  }
}

export interface BlogsResponse {
  success: boolean
  data: Blog[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface BlogResponse {
  success: boolean
  data: Blog
  message?: string
}

// Get all blogs with pagination
export const getAllBlogs = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  serverApi?: AxiosInstance
): Promise<BlogsResponse> => {
  const apiInstance = serverApi || api;
  const response = await apiInstance.get('/general/all', {
    params: { page, limit, search },
  })
  return response.data
}

// Get blog by ID
export const getBlogById = async (id: number, serverApi?: AxiosInstance): Promise<BlogResponse> => {
  const apiInstance = serverApi || api;
  const response = await apiInstance.get(`/general/${id}`)
  return response.data
}

// Get latest blogs (for homepage)
export const getLatestBlogs = async (limit: number = 3, serverApi?: AxiosInstance): Promise<BlogsResponse> => {
  try {
    const apiInstance = serverApi || api;
    const response = await apiInstance.get('/general/all', {
      params: { page: 1, limit },
    })
    return response.data
  } catch (error) {
    console.error('Error in getLatestBlogs:', error);
    // Return safe default response on error
    return {
      success: false,
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: limit,
        totalPages: 0
      }
    };
  }
}
