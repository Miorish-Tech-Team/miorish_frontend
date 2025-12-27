import axios from "axios";
import { Product } from "./productService";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface RecommendationResponse {
  success: boolean;
  recommended: Product[];
}

// Helper function to get cookie header for server-side requests
async function getCookieHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const tokenMiddleware = cookieStore.get("token_middleware");
  const accessToken = cookieStore.get("accessToken");
  
  const cookieParts: string[] = [];
  
  // Add all available auth cookies
  if (token) {
    cookieParts.push(`token=${token.value}`);
  }
  if (tokenMiddleware) {
    cookieParts.push(`token_middleware=${tokenMiddleware.value}`);
  }
  if (accessToken) {
    cookieParts.push(`accessToken=${accessToken.value}`);
  }
  
  const cookieHeader = cookieParts.join("; ");
  

  
  return cookieHeader;
}

// Get combined recommendations (search + activity based)
export const getCombinedRecommendations = async (): Promise<RecommendationResponse> => {
  try {
    const cookieHeader = await getCookieHeader();
    
    
    const response = await axios.get<RecommendationResponse>(
      `${API_URL}/recommendation`,
      { 
        withCredentials: true,
        headers: {
          Cookie: cookieHeader
        }
      }
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
export const getSearchBasedRecommendations = async (): Promise<RecommendationResponse> => {
  try {
    const cookieHeader = await getCookieHeader();
    
    const response = await axios.get<RecommendationResponse>(
      `${API_URL}/recommendation/recommendBasedOnSearch`,
      { 
        withCredentials: true,
        headers: {
          Cookie: cookieHeader
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching search-based recommendations:", error);
    return { success: false, recommended: [] };
  }
};

// Get activity-based recommendations
export const getActivityBasedRecommendations = async (): Promise<RecommendationResponse> => {
  try {
    const cookieHeader = await getCookieHeader();
    
    const response = await axios.get<RecommendationResponse>(
      `${API_URL}/recommendation/recommendBasedOnActivity`,
      { 
        withCredentials: true,
        headers: {
          Cookie: cookieHeader
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching activity-based recommendations:", error);
    return { success: false, recommended: [] };
  }
};
