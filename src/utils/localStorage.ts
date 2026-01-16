/**
 * Utility functions for secure localStorage management
 * Implements encoding for cart and wishlist data
 * 
 * USAGE PATTERN:
 * - localStorage is ONLY used for unauthenticated (guest) users
 * - When user logs in: localStorage is synced to database then cleared
 * - Authenticated users: all data stored in database only
 * - When user logs out: they start with empty localStorage
 */

// Simple hash function using Web Crypto API (SHA-256)
export async function hashPayload(data: any): Promise<string> {
  if (typeof window === 'undefined') return ''
  
  try {
    const jsonString = JSON.stringify(data)
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(jsonString)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  } catch (error) {
    console.error('Error hashing payload:', error)
    return ''
  }
}

// Encode data with Base64 for storage (not encryption, just obfuscation)
export function encodeData(data: any): string {
  if (typeof window === 'undefined') return ''
  
  try {
    const jsonString = JSON.stringify(data)
    return btoa(encodeURIComponent(jsonString))
  } catch (error) {
    console.error('Error encoding data:', error)
    return ''
  }
}

// Decode Base64 data
export function decodeData<T>(encodedData: string): T | null {
  if (typeof window === 'undefined') return null
  
  try {
    const jsonString = decodeURIComponent(atob(encodedData))
    return JSON.parse(jsonString) as T
  } catch (error) {
    console.error('Error decoding data:', error)
    return null
  }
}

// Save to localStorage with encoding
export function saveToLocalStorage(key: string, data: any): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const encoded = encodeData(data)
    if (encoded) {
      localStorage.setItem(key, encoded)
      return true
    }
    return false
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error)
    return false
  }
}

// Read from localStorage with decoding
export function readFromLocalStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  
  try {
    const encoded = localStorage.getItem(key)
    if (!encoded) return null
    
    return decodeData<T>(encoded)
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return null
  }
}

// Clear specific key from localStorage
export function clearLocalStorage(key: string): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error clearing localStorage (${key}):`, error)
  }
}

// Clear all app-specific keys
export function clearAllAppStorage(): void {
  if (typeof window === 'undefined') return
  
  try {
    clearLocalStorage('miorish_cart')
    clearLocalStorage('miorish_wishlist')
  } catch (error) {
    console.error('Error clearing all app storage:', error)
  }
}

// Check if localStorage is available
export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const testKey = '__test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

// Cart-specific types and helpers
export interface LocalCartItem {
  productId: number
  quantity: number
  selectedSize?: string
  selectedColor?: string
  timestamp: number
}

export interface LocalWishlistItem {
  productId: number
  timestamp: number
}

// Save cart to localStorage
export function saveCartToLocalStorage(items: LocalCartItem[]): boolean {
  return saveToLocalStorage('miorish_cart', items)
}

// Read cart from localStorage
export function readCartFromLocalStorage(): LocalCartItem[] {
  return readFromLocalStorage<LocalCartItem[]>('miorish_cart') || []
}

// Add item to cart in localStorage
export function addItemToLocalCart(item: Omit<LocalCartItem, 'timestamp'>): LocalCartItem[] {
  const cart = readCartFromLocalStorage()
  
  // Check if item already exists (same product, size, color)
  const existingIndex = cart.findIndex(
    i => i.productId === item.productId && 
         i.selectedSize === item.selectedSize && 
         i.selectedColor === item.selectedColor
  )
  
  if (existingIndex !== -1) {
    // Update quantity
    cart[existingIndex].quantity += item.quantity
    cart[existingIndex].timestamp = Date.now()
  } else {
    // Add new item
    cart.push({
      ...item,
      timestamp: Date.now()
    })
  }
  
  saveCartToLocalStorage(cart)
  return cart
}

// Update cart item quantity in localStorage
export function updateLocalCartItemQuantity(
  productId: number, 
  quantity: number, 
  selectedSize?: string, 
  selectedColor?: string
): LocalCartItem[] {
  const cart = readCartFromLocalStorage()
  const index = cart.findIndex(
    i => i.productId === productId && 
         i.selectedSize === selectedSize && 
         i.selectedColor === selectedColor
  )
  
  if (index !== -1) {
    cart[index].quantity = quantity
    cart[index].timestamp = Date.now()
    saveCartToLocalStorage(cart)
  }
  
  return cart
}

// Remove item from cart in localStorage
export function removeItemFromLocalCart(
  productId: number, 
  selectedSize?: string, 
  selectedColor?: string
): LocalCartItem[] {
  const cart = readCartFromLocalStorage()
  const filtered = cart.filter(
    i => !(i.productId === productId && 
           i.selectedSize === selectedSize && 
           i.selectedColor === selectedColor)
  )
  
  saveCartToLocalStorage(filtered)
  return filtered
}

// Clear cart from localStorage
export function clearLocalCart(): void {
  clearLocalStorage('miorish_cart')
}

// Save wishlist to localStorage
export function saveWishlistToLocalStorage(items: LocalWishlistItem[]): boolean {
  return saveToLocalStorage('miorish_wishlist', items)
}

// Read wishlist from localStorage
export function readWishlistFromLocalStorage(): LocalWishlistItem[] {
  return readFromLocalStorage<LocalWishlistItem[]>('miorish_wishlist') || []
}

// Add item to wishlist in localStorage
export function addItemToLocalWishlist(productId: number): LocalWishlistItem[] {
  const wishlist = readWishlistFromLocalStorage()
  
  // Check if item already exists
  const exists = wishlist.some(i => i.productId === productId)
  
  if (!exists) {
    wishlist.push({
      productId,
      timestamp: Date.now()
    })
    saveWishlistToLocalStorage(wishlist)
  }
  
  return wishlist
}

// Remove item from wishlist in localStorage
export function removeItemFromLocalWishlist(productId: number): LocalWishlistItem[] {
  const wishlist = readWishlistFromLocalStorage()
  const filtered = wishlist.filter(i => i.productId !== productId)
  
  saveWishlistToLocalStorage(filtered)
  return filtered
}

// Check if product is in wishlist
export function isInLocalWishlist(productId: number): boolean {
  const wishlist = readWishlistFromLocalStorage()
  return wishlist.some(i => i.productId === productId)
}

// Clear wishlist from localStorage
export function clearLocalWishlist(): void {
  clearLocalStorage('miorish_wishlist')
}

// Get cart item count
export function getLocalCartItemCount(): number {
  const cart = readCartFromLocalStorage()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

// Get wishlist item count
export function getLocalWishlistItemCount(): number {
  const wishlist = readWishlistFromLocalStorage()
  return wishlist.length
}
