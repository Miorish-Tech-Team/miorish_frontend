import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  withCredentials: true, // Important for cookies
  timeout: 15000, // 15 second timeout for production/Cloudflare
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - token is now sent via cookies automatically
api.interceptors.request.use(
  (config) => {
    // No need to manually attach token - cookies are sent automatically with withCredentials: true
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('[Axios Interceptor] 401 Error:', {
        url: error.config?.url || '',
        pathname: typeof window !== 'undefined' ? window.location.pathname : 'server',
        message: 'Authentication required - handled by components/middleware'
      })
    }
    return Promise.reject(error)
  }
)

export default api
