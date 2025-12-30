import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/account',
  '/checkout',
  '/orders',
]

// Define auth routes that authenticated users shouldn't access
const authRoutes = [
  '/auth/login',
  '/auth/register',
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token_middleware')?.value
  const { pathname } = request.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // If trying to access protected route without token, redirect to home with blocked parameter
  if (isProtectedRoute && !token) {
    const url = new URL('/', request.url)
    url.searchParams.set('blocked', 'true')
    url.searchParams.set('message', 'Please login to access this page')
    return NextResponse.redirect(url)
  }

  // If trying to access auth routes with token, redirect to home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*|_next).*)',
  ],
}
