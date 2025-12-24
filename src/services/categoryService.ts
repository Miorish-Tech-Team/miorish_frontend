import api from '@/lib/axios'

export interface Category {
  id: number
  categoryName: string
  categoryProductCount: number
  categoryDescription?: string
  categoryImage?: string
  createdAt: string
  updatedAt: string
}

export interface SubCategory {
  id: number
  subCategoryName: string
  subCategoryProductCount: number
  categoryId: number
  createdAt: string
  updatedAt: string
}

export interface CategoriesResponse {
  success: boolean
  categories: Category[]
  message?: string
}

export interface SubCategoriesResponse {
  success: boolean
  subCategories: SubCategory[]
  message?: string
}

// Get all categories
export const getAllCategories = async (): Promise<CategoriesResponse> => {
  const response = await api.get('/general/categories')
  return response.data
}

// Get category by ID
export const getCategoryById = async (categoryId: number | string) => {
  const response = await api.get(`/general/categories/${categoryId}`)
  return response.data
}

// Get all subcategories
export const getAllSubCategories = async (): Promise<SubCategoriesResponse> => {
  const response = await api.get('/general/subcategories')
  return response.data
}

// Get subcategories by category ID
export const getSubCategoriesByCategoryId = async (categoryId: number | string): Promise<SubCategoriesResponse> => {
  const response = await api.get(`/general/subcategories/category/${categoryId}`)
  return response.data
}
