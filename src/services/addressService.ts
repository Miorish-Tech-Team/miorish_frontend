import api from '@/lib/axios'

export interface Address {
  id: number
  userId: number
  recipientName: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  phoneNumber: string
  type?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface AddressesResponse {
  success: boolean
  addresses: Address[]
  message?: string
}

export interface AddressResponse {
  success: boolean
  address: Address
  message?: string
}

export interface CreateAddressData {
  recipientName: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  phoneNumber: string
  type?: string
  isDefault?: boolean
}

// export interface UpdateAddressData extends Partial<CreateAddressData> {}

// Get all user addresses
export const getUserAddresses = async (): Promise<AddressesResponse> => {
  const response = await api.get('/user/address')
  return response.data
}

// Add new address
export const addAddress = async (addressData: CreateAddressData): Promise<AddressResponse> => {
  const response = await api.post('/user/address/add', addressData)
  return response.data
}

// Update address
export const updateAddress = async (
  addressId: number | string,
  addressData: CreateAddressData
): Promise<AddressResponse> => {
  const response = await api.put(`/user/address/${addressId}`, addressData)
  return response.data
}

// Delete address
export const deleteAddress = async (addressId: number | string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/user/address/${addressId}`)
  return response.data
}

// Set default address
export const setDefaultAddress = async (addressId: number | string): Promise<AddressResponse> => {
  const response = await api.patch(`/user/address/${addressId}/default`)
  return response.data
}

// Indian Address Validation API

export interface StatesResponse {
  success: boolean
  country: string
  states: string[]
}

export interface DistrictsResponse {
  success: boolean
  state: string
  districts: string[]
}

export interface PincodeValidationResponse {
  success: boolean
  isValid: boolean
  state?: string
  district?: string
  city?: string
  postOfficeName?: string
  message?: string
  verifiedBy?: string
}

// Get all Indian states
export const getStates = async (): Promise<StatesResponse> => {
  const response = await api.get('/user/address/states')
  return response.data
}

// Get districts by state
export const getDistricts = async (state: string): Promise<DistrictsResponse> => {
  const response = await api.get(`/user/address/districts?state=${encodeURIComponent(state)}`)
  return response.data
}

// Validate pincode
export const validatePincode = async (pincode: string): Promise<PincodeValidationResponse> => {
  const response = await api.get(`/user/address/validate-pincode?pincode=${pincode}`)
  return response.data
}
