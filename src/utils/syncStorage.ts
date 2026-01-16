/**
 * Sync utilities for merging localStorage cart/wishlist with database after login
 * 
 * Workflow:
 * 1. Unauthenticated users add items to cart/wishlist → stored in localStorage
 * 2. User logs in → sync localStorage items to database
 * 3. After successful sync → clear localStorage (database becomes the ONLY source of truth)
 * 4. Authenticated users: all cart/wishlist changes go directly to database (NOT localStorage)
 * 5. On logout: user starts fresh with empty localStorage
 */

import { 
  readCartFromLocalStorage, 
  readWishlistFromLocalStorage,
  clearLocalCart,
  clearLocalWishlist,
  LocalCartItem,
  LocalWishlistItem
} from './localStorage'
import { addToCart, getUserCartWithSummary, updateCartItemQuantity, type CartWithSummary, type CartSummary, type Cart, type CartItem } from '@/services/cartService'
import { addToWishlist, getUserWishlist, type WishlistResponse } from '@/services/wishlistService'
import { toast } from 'react-hot-toast'

/**
 * Sync local cart items to database after login
 * Merges local cart with existing database cart
 * For existing items: Keeps database quantity (does not overwrite)
 * For new items: Adds them to cart
 * Clears localStorage after successful sync
 * Returns the updated cart data from server
 */
export async function syncCartToDatabase(): Promise<{
  success: boolean
  syncedCount: number
  failedCount: number
  errors: string[]
  cartData?: CartWithSummary | { cart: [], summary: CartSummary, message: string }
}> {
  const localCart = readCartFromLocalStorage()
  
  if (localCart.length === 0) {
    return { success: true, syncedCount: 0, failedCount: 0, errors: [] }
  }

  const errors: string[] = []
  let syncedCount = 0
  let failedCount = 0

  console.log(`[Sync] Starting cart sync: ${localCart.length} items`)

  // Fetch existing cart from database
  let existingCartData: CartWithSummary | { cart: any[], summary: CartSummary, message?: string } | undefined
  try {
    existingCartData = await getUserCartWithSummary()
  } catch (error) {
    console.error('[Sync] Failed to fetch existing cart:', error)
  }

  // Build a map of existing cart items for quick lookup
  const existingItemsMap = new Map<string, CartItem>()
  if (existingCartData && 'cart' in existingCartData && Array.isArray((existingCartData.cart as Cart).CartItems)) {
    const cartItems = (existingCartData.cart as Cart).CartItems
    cartItems.forEach(item => {
      const key = `${item.productId}-${item.selectedSize || ''}-${item.selectedColor || ''}`
      existingItemsMap.set(key, item)
    })
  }

  // Sync items one by one to handle partial failures
  for (const item of localCart) {
    try {
      const itemKey = `${item.productId}-${item.selectedSize || ''}-${item.selectedColor || ''}`
      const existingItem = existingItemsMap.get(itemKey)

      if (existingItem) {
        // Item exists in DB - keep DB quantity
        console.log(`[Sync] Cart item ${item.productId} already exists in DB`)
        syncedCount++
      } else {
        // Item doesn't exist in DB - add it
        await addToCart({
          productId: item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor
        })
        syncedCount++
        console.log(`[Sync] Cart item ${item.productId} added to DB`)
      }
    } catch (error: any) {
      failedCount++
      const errorMsg = error?.response?.data?.message || error?.message || 'Unknown error'
      errors.push(`Product ${item.productId}: ${errorMsg}`)
      console.error(`[Sync] Failed to sync cart item ${item.productId}:`, errorMsg)
    }
  }

  console.log(`[Sync] Cart sync completed: ${syncedCount} synced, ${failedCount} failed`)

  // Clear localStorage only if all items synced successfully
  if (failedCount === 0) {
    clearLocalCart()
    console.log('[Sync] Local cart cleared after successful sync')
  }

  // Fetch updated cart data from server
  let cartData: CartWithSummary | { cart: [], summary: CartSummary, message: string } | undefined
  try {
    cartData = await getUserCartWithSummary()
  } catch (error) {
    console.error('[Sync] Failed to fetch updated cart data:', error)
  }

  return {
    success: failedCount === 0,
    syncedCount,
    failedCount,
    errors,
    cartData
  }
}

/**
 * Sync local wishlist items to database after login
 * Merges local wishlist with existing database wishlist
 * Clears localStorage after successful sync
 * Returns the updated wishlist data from server
 */
export async function syncWishlistToDatabase(): Promise<{
  success: boolean
  syncedCount: number
  failedCount: number
  errors: string[]
  wishlistData?: WishlistResponse
}> {
  const localWishlist = readWishlistFromLocalStorage()
  
  if (localWishlist.length === 0) {
    return { success: true, syncedCount: 0, failedCount: 0, errors: [] }
  }

  const errors: string[] = []
  let syncedCount = 0
  let failedCount = 0

  console.log(`[Sync] Starting wishlist sync: ${localWishlist.length} items`)

  // Sync items one by one to handle partial failures
  for (const item of localWishlist) {
    try {
      await addToWishlist(item.productId)
      syncedCount++
      console.log(`[Sync] Wishlist item ${item.productId} added to DB`)
    } catch (error: any) {
      // If item already exists in wishlist, consider it a success
      const errorMsg = error?.response?.data?.message || error?.message || ''
      if (errorMsg.toLowerCase().includes('already') || errorMsg.toLowerCase().includes('exists')) {
        syncedCount++
        console.log(`[Sync] Wishlist item ${item.productId} already exists in DB`)
      } else {
        failedCount++
        errors.push(`Product ${item.productId}: ${errorMsg}`)
        console.error(`[Sync] Failed to sync wishlist item ${item.productId}:`, errorMsg)
      }
    }
  }

  console.log(`[Sync] Wishlist sync completed: ${syncedCount} synced, ${failedCount} failed`)

  // Clear localStorage only if all items synced successfully
  if (failedCount === 0) {
    clearLocalWishlist()
    console.log('[Sync] Local wishlist cleared after successful sync')
  }

  // Fetch updated wishlist data from server
  let wishlistData: WishlistResponse | undefined
  try {
    wishlistData = await getUserWishlist()
  } catch (error) {
    console.error('[Sync] Failed to fetch updated wishlist data:', error)
  }

  return {
    success: failedCount === 0,
    syncedCount,
    failedCount,
    errors,
    wishlistData
  }
}

/**
 * Sync both cart and wishlist to database after login
 * Shows user-friendly toast messages
 * Clears localStorage after successful sync
 * Returns synced cart and wishlist data
 */
export async function syncAllToDatabase(showToasts: boolean = true): Promise<{
  cartResult: {
    success: boolean
    syncedCount: number
    failedCount: number
    errors: string[]
    cartData?: CartWithSummary | { cart: [], summary: CartSummary, message: string }
  }
  wishlistResult: {
    success: boolean
    syncedCount: number
    failedCount: number
    errors: string[]
    wishlistData?: WishlistResponse
  }
}> {
  console.log('[Sync] Starting full sync (cart + wishlist)')
  
  // Sync cart
  const cartResult = await syncCartToDatabase()
  
  // Sync wishlist
  const wishlistResult = await syncWishlistToDatabase()
  
  // Show toast messages if enabled
  if (showToasts) {
    const totalSynced = cartResult.syncedCount + wishlistResult.syncedCount
    const totalFailed = cartResult.failedCount + wishlistResult.failedCount
    
    if (totalSynced > 0 && totalFailed === 0) {
      toast.success(`${totalSynced} item(s) synced to your account`)
    } else if (totalSynced > 0 && totalFailed > 0) {
      toast.success(`${totalSynced} item(s) synced`)
      toast.error(`${totalFailed} item(s) failed to sync`)
    } else if (totalFailed > 0) {
      toast.error('Failed to sync items to your account')
    }
  }
  
  console.log(`[Sync] Full sync completed: ${cartResult.syncedCount + wishlistResult.syncedCount} synced, ${cartResult.failedCount + wishlistResult.failedCount} failed`)
  
  return {
    cartResult,
    wishlistResult
  }
}
