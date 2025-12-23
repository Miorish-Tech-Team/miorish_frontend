import api from '@/lib/axios'
import { User } from './authService'

// Types
export interface UpdateProfileData {
  fullName?: string
  phone?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  profilePhoto?: File
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface TwoFactorAuthData {
  enable: boolean
}

export interface ProfileResponse {
  success: boolean
  message: string
  user?: User
}

export interface TwoFactorStatusResponse {
  success: boolean
  isTwoFactorAuthEnable: boolean
}

// Profile API Service
export const profileAPI = {
  // Get User Profile
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const response = await api.get('/user')
      console.log('Profile response:', response.data)
      return response.data
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  },

  // Update User Profile
  updateProfile: async (userId: number, data: UpdateProfileData): Promise<ProfileResponse> => {
    try {
      const formData = new FormData()
      
      if (data.fullName) formData.append('fullName', data.fullName)
      if (data.phone) formData.append('phone', data.phone)
      if (data.city) formData.append('city', data.city)
      if (data.state) formData.append('state', data.state)
      if (data.country) formData.append('country', data.country)
      if (data.zipCode) formData.append('zipCode', data.zipCode)
      if (data.profilePhoto) formData.append('profilePhoto', data.profilePhoto)

      const response = await api.put(`/user/edit/profile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      console.log('Update profile response:', response.data)
      
      // Update user in localStorage
      if (response.data.user && typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  },

  // Change Password
  changePassword: async (data: ChangePasswordData): Promise<ProfileResponse> => {
    try {
      const response = await api.put('/user/edit/change-password', data)
      console.log('Change password response:', response.data)
      return response.data
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    }
  },

  // Toggle Two-Factor Authentication
  toggleTwoFactorAuth: async (data: TwoFactorAuthData): Promise<ProfileResponse> => {
    try {
      const response = await api.patch('/user/two-factor-auth', data)
      console.log('Toggle 2FA response:', response.data)
      return response.data
    } catch (error) {
      console.error('Toggle 2FA error:', error)
      throw error
    }
  },

  // Get Two-Factor Authentication Status
  getTwoFactorStatus: async (): Promise<TwoFactorStatusResponse> => {
    try {
      const response = await api.get('/user/two-factor-status')
      console.log('2FA status response:', response.data)
      return response.data
    } catch (error) {
      console.error('Get 2FA status error:', error)
      throw error
    }
  },
}
