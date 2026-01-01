import axios, { AxiosInstance } from "axios";
import { Product } from "./productService";
import { createServerApi } from "@/lib/serverAxios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface RecommendationResponse {
  success: boolean;
  recommended: Product[];
}

// Get combined recommendations (search + activity based)
// Pass cookieHeader from Server Component for SSR
export const getCombinedRecommendations = async (cookieHeader?: string): Promise<RecommendationResponse> => {
  try {
    // Use server-side axios with proper headers for Cloudflare
    const serverApi = createServerApi(cookieHeader);
    const response = await serverApi.get<RecommendationResponse>(
      '/recommendation'
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[RecommendationService] API Error:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url
      });
    } else {
      console.error("[RecommendationService] Error fetching combined recommendations:", error);
    }
    return { success: false, recommended: [] };
  }
};

// Get search-based recommendations
export const getSearchBasedRecommendations = async (cookieHeader?: string): Promise<RecommendationResponse> => {
  try {
    const serverApi = createServerApi(cookieHeader);
    const response = await serverApi.get<RecommendationResponse>(
      '/recommendation/recommendBasedOnSearch'
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching search-based recommendations:", error);
    return { success: false, recommended: [] };
  }
};

// Get activity-based recommendations
export const getActivityBasedRecommendations = async (cookieHeader?: string): Promise<RecommendationResponse> => {
  try {
    const serverApi = createServerApi(cookieHeader);
    const response = await serverApi.get<RecommendationResponse>(
      '/recommendation/recommendBasedOnActivity'
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching activity-based recommendations:", error);
    return { success: false, recommended: [] };
  }
};
