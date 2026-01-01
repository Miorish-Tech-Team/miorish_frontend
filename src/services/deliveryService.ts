import api from '@/lib/axios';
import { AxiosInstance } from 'axios';

export interface DeliveryEstimate {
  distanceKm: number;
  deliveryDays: number;
  shippingCost: number;
  estimatedDeliveryDate: string;
  warehouseLocation: {
    pincode: string;
    name: string;
  };
  isFreeShipping: boolean;
}

export interface DeliveryEstimateResponse {
  success: boolean;
  source: 'cache' | 'fresh';
  estimate: DeliveryEstimate;
  message?: string;
}

/**
 * Get delivery estimate based on user address and order total
 * @param addressId - User's selected address ID
 * @param orderTotal - Total order amount (for free shipping calculation)
 * @param apiInstance - Optional axios instance (for SSR)
 * @returns Delivery estimate with shipping cost
 */
export const getDeliveryEstimate = async (
  addressId: number,
  orderTotal: number,
  apiInstance: AxiosInstance = api
): Promise<DeliveryEstimateResponse> => {
  const response = await apiInstance.post<DeliveryEstimateResponse>(
    '/user/delivery-estimate',
    {
      addressId,
      orderTotal,
    }
  );
  return response.data;
};

/**
 * Clear delivery cache for a specific pincode (admin only)
 */
export const clearDeliveryCache = async (
  userPincode: string,
  apiInstance: AxiosInstance = api
): Promise<{ success: boolean; message: string }> => {
  const response = await apiInstance.post('/admin/delivery/clear-cache', {
    userPincode,
  });
  return response.data;
};
