import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7845/api',
  withCredentials: true, // Important for cookies
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for protected routes, not for public API calls
    if (error.response?.status === 401) {
      const url = error.config?.url || ''
      
      // Don't redirect for public endpoints (general routes, auth, products, recommendations)
      const isPublicEndpoint = url.includes('/general/') || 
                              url.includes('/auth/') ||
                              url.includes('/product/')||
                              url.includes('/recommendation')
      
      // Don't redirect if already on auth pages or public pages to prevent infinite loops
      const isOnAuthOrPublicPage = typeof window !== 'undefined' && 
                          (window.location.pathname.startsWith('/auth/') ||
                           window.location.pathname === '/auth/login' ||
                           window.location.pathname === '/auth/register' ||
                           window.location.pathname === '/categories' ||
                           window.location.pathname.startsWith('/categories') ||
                           window.location.pathname === '/' ||
                           window.location.pathname.startsWith('/products'))
      
      console.log('[Axios Interceptor] 401 Error:', {
        url,
        isPublicEndpoint,
        isOnAuthOrPublicPage,
        pathname: typeof window !== 'undefined' ? window.location.pathname : 'server',
        willRedirect: !isPublicEndpoint && !isOnAuthOrPublicPage
      })
      
      if (!isPublicEndpoint && !isOnAuthOrPublicPage && typeof window !== 'undefined') {
        // Only redirect if we're trying to access protected user endpoints
        console.log('[Axios Interceptor] Redirecting to login')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
