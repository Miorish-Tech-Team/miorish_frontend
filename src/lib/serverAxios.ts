import axios, { AxiosInstance } from 'axios';

/**
 * Server-side axios instance for SSR (Server-Side Rendering)
 * This should be used in Next.js Server Components and API routes
 * @param cookieHeader - Optional cookie header string to forward from the request
 * @returns Axios instance configured for server-side requests
 */
export const createServerApi = (cookieHeader?: string): AxiosInstance => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  // Extract domain from baseURL for Origin header
  const apiUrl = new URL(baseURL);
  const origin = `${apiUrl.protocol}//${apiUrl.host}`;
  
  return axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      // Use a more standard browser User-Agent to avoid Cloudflare bot detection
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies from request
    },
    timeout: 30000, // 30 second timeout
    validateStatus: (status) => status < 500, // Don't throw on 4xx errors
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
