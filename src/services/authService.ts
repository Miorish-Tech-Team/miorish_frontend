import api from '@/lib/axios'

// Types
export interface SignupData {
  fullName: string
  email: string
  password: string
}

export interface SigninData {
  email: string
  password: string
}

export interface VerifyEmailData {
  verificationCode: string
}

export interface ResetPasswordOtpData {
  email: string
}

export interface VerifyOtpData {
  verificationCode: string
}

export interface ResetPasswordData {
  email: string
  newPassword: string
}

export interface FindMyAccountData {
  email: string
}

export interface User {
  id: number
  fullName: string
  email: string
  role: string
  isVerified: boolean
  profilePhoto?: string
  phone?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  user?: User
  isTwoFactorAuthEnable?: boolean
}

// Auth API Service
export const authAPI = {
  // Signup
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      console.log('Calling signup API with:', { ...data, password: '***' })
      const response = await api.post('/auth/signup', data)
      console.log('Signup response:', response.data)
      return response.data
    } catch (error) {
      console.error('Signup API error:', error)
      throw error
    }
  },

  // Signin
  signin: async (data: SigninData): Promise<AuthResponse> => {
    try {
      console.log('Calling signin API with:', { ...data, password: '***' })
      const response = await api.post('/auth/signin', data)
      console.log('Signin response data:', response.data)
      if (response.data.token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      return response.data
    } catch (error) {
      console.error('Signin API error:', error)
      throw error
    }
  },

  // Verify 2FA Login
  verify2FA: async (data: VerifyEmailData): Promise<AuthResponse> => {
    try {
      console.log('Calling verify2FA API')
      const response = await api.patch('/auth/verify-two-factor', data)
      console.log('Verify 2FA response:', response.data)
      if (response.data.token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      return response.data
    } catch (error) {
      console.error('Verify 2FA error:', error)
      throw error
    }
  },

  // Verify Email
  verifyEmail: async (data: VerifyEmailData): Promise<AuthResponse> => {
    try {
      console.log('Calling verifyEmail API')
      const response = await api.post('/auth/verify-email', data)
      console.log('Verify email response:', response.data)
      return response.data
    } catch (error) {
      console.error('Verify email error:', error)
      throw error
    }
  },

  // Resend OTP
  resendOtp: async (email: string): Promise<AuthResponse> => {
    try {
      console.log('Calling resendOtp API for:', email)
      const response = await api.post('/auth/resend-otp', { email })
      console.log('Resend OTP response:', response.data)
      return response.data
    } catch (error) {
      console.error('Resend OTP error:', error)
      throw error
    }
  },

  // Request Reset Password OTP
  resetPasswordOtp: async (data: ResetPasswordOtpData): Promise<AuthResponse> => {
    try {
      console.log('Calling resetPasswordOtp API')
      const response = await api.post('/auth/reset-password-otp', data)
      console.log('Reset password OTP response:', response.data)
      return response.data
    } catch (error) {
      console.error('Reset password OTP error:', error)
      throw error
    }
  },

  // Verify Reset Password OTP
  verifyResetOtp: async (data: VerifyOtpData): Promise<AuthResponse> => {
    try {
      console.log('Calling verifyResetOtp API')
      const response = await api.post('/auth/verify-otp', data)
      console.log('Verify reset OTP response:', response.data)
      return response.data
    } catch (error) {
      console.error('Verify reset OTP error:', error)
      throw error
    }
  },

  // Find My Account (Send Reset Link)
  findMyAccount: async (data: FindMyAccountData): Promise<AuthResponse> => {
    try {
      console.log('Calling findMyAccount API')
      const response = await api.post('/auth/find-my-account', data)
      console.log('Find my account response:', response.data)
      return response.data
    } catch (error) {
      console.error('Find my account error:', error)
      throw error
    }
  },

  // Reset Password from URL Token
  resetPasswordFromUrl: async (
    resetToken: string,
    newPassword: string
  ): Promise<AuthResponse> => {
    try {
      console.log('Calling resetPasswordFromUrl API')
      const response = await api.post(`/auth/find-my-account/${resetToken}`, {
        newPassword,
      })
      console.log('Reset password from URL response:', response.data)
      return response.data
    } catch (error) {
      console.error('Reset password from URL error:', error)
      throw error
    }
  },

  // Reset Password from OTP
  resetPasswordFromOtp: async (data: ResetPasswordData): Promise<AuthResponse> => {
    try {
      console.log('Calling resetPasswordFromOtp API')
      const response = await api.post('/auth/reset-password', data)
      console.log('Reset password from OTP response:', response.data)
      return response.data
    } catch (error) {
      console.error('Reset password from OTP error:', error)
      throw error
    }
  },

  // Logout
  logout: async (): Promise<AuthResponse> => {
    try {
      console.log('Calling logout API')
      const response = await api.post('/auth/logout')
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      console.log('Logout response:', response.data)
      return response.data
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API fails, clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      throw error
    }
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('token')
  },

  // Google Auth - Initiates Google OAuth flow
  initiateGoogleAuth: () => {
    if (typeof window === 'undefined') return
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7845/api'
    // Redirect to backend Google auth endpoint which will redirect to Google OAuth
    window.location.href = `${API_URL}/auth/google`
  },
}
