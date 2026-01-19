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
  userId?: number
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
  twoFactorMethod?: 'email' | 'authenticator'
  userId?: number
}

// Auth API Service
export const authAPI = {
  // Signup
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/signup', data)
      return response.data
    } catch (error) {
      console.error('Signup API error:', error)
      throw error
    }
  },

  // Signin
  signin: async (data: SigninData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/signin', data)
      // Token is now handled by httpOnly cookies on the backend
      return response.data
    } catch (error) {
      console.error('Signin API error:', error)
      throw error
    }
  },

  // Verify 2FA Login
  verify2FA: async (data: VerifyEmailData): Promise<AuthResponse> => {
    try {
      const response = await api.patch('/auth/verify-two-factor', data)
      // Token is now handled by httpOnly cookies on the backend
      return response.data
    } catch (error) {
      console.error('Verify 2FA error:', error)
      throw error
    }
  },

  // Find My Account (Send Reset Link)
  findMyAccount: async (data: FindMyAccountData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/find-my-account', data)
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
      const response = await api.post(`/auth/find-my-account/${resetToken}`, {
        newPassword,
      })
      return response.data
    } catch (error) {
      console.error('Reset password from URL error:', error)
      throw error
    }
  },

  // Logout
  logout: async (): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/logout')
      // Cookie is cleared by the backend
      return response.data
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },

  // Get current user from API
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get('/user')
      return response.data.user
    } catch (error) {
      // Don't log 401 errors as they're expected when not logged in
      if ((error as any)?.response?.status !== 401) {
        console.error('Get current user error:', error)
      }
      return null
    }
  },

  // Check if user is authenticated by checking cookie
  checkAuth: async (): Promise<boolean> => {
    try {
      await api.get('/user')
      return true
    } catch (error) {
      return false
    }
  },

  // Google Auth - Initiates Google OAuth flow
  initiateGoogleAuth: () => {
    if (typeof window === 'undefined') return
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
    // Redirect to backend Google auth endpoint which will redirect to Google OAuth
    window.location.href = `${API_URL}/auth/google`
  },
}
