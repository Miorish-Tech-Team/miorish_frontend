import api from "@/lib/axios";
import { AxiosInstance } from "axios";

export interface Category {
  id: number;
  categoryName: string;
  categoryProductCount: number;
  categoryDescription?: string;
  categoryImage?: string;
  createdAt: string;
  updatedAt: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: number;
  subCategoryName: string;
  subCategoryProductCount: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
  message?: string;
}

export interface SubCategoriesResponse {
  success: boolean;
  subCategories: SubCategory[];
  message?: string;
}

// Get all categories
export const getAllCategories = async (apiInstance: AxiosInstance = api): Promise<CategoriesResponse> => {
  const response = await apiInstance.get("/general/categories");
  return response.data;
};

// Get category by ID
export const getCategoryById = async (categoryId: number | string, apiInstance: AxiosInstance = api) => {
  const response = await apiInstance.get(`/general/categories/${categoryId}`);
  return response.data;
};

// Get all subcategories
export const getAllSubCategories = async (apiInstance: AxiosInstance = api): Promise<SubCategoriesResponse> => {
  const response = await apiInstance.get("/general/subcategories");
  return response.data;
};

// Get subcategories by category ID
export const getSubCategoriesByCategoryId = async (
  categoryId: number | string,
  apiInstance: AxiosInstance = api
): Promise<SubCategoriesResponse> => {
  const response = await apiInstance.get(
    `/general/subcategories/category/${categoryId}`
  );
  return response.data;
};
