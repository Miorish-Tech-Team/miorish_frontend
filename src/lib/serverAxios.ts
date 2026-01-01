import axios, { AxiosInstance } from 'axios';

/**
 * Server-side axios instance for SSR (Server-Side Rendering)
 * This should be used in Next.js Server Components and API routes
 * @param cookieHeader - Optional cookie header string to forward from the request
 * @returns Axios instance configured for server-side requests
 */
export const createServerApi = (cookieHeader?: string): AxiosInstance => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies from request
    },
    // No withCredentials for server-side as we manually handle cookies
  });
};

/**
 * Helper function to extract cookie header from Next.js cookies() object
 * Use this in Server Components to get the cookie header for API calls
 * @param cookieStore - Next.js cookies() store
 * @returns Cookie header string
 */
export const getCookieHeader = (cookieStore: any): string => {
  const allCookies = cookieStore.getAll();
  return allCookies
    .map((cookie: any) => `${cookie.name}=${cookie.value}`)
    .join('; ');
};
