'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react'
import { getUserCartWithSummary, addToCart as addToCartAPI, updateCartItemQuantity, removeCartItem, removeAllCartItems, type Cart, type CartSummary, type CartApiResponse } from '@/services/cartService'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { 
  readCartFromLocalStorage,
  addItemToLocalCart,
  updateLocalCartItemQuantity,
  removeItemFromLocalCart,
  clearLocalCart,
  getLocalCartItemCount,
  LocalCartItem
} from '@/utils/localStorage'

interface CartContextType {
  cart: Cart | null
  summary: CartSummary
  loading: boolean
  refreshCart: () => Promise<void>
  addToCart: (productId: number, quantity: number, selectedSize?: string, selectedColor?: string) => Promise<void>
  updateQuantity: (itemId: number, quantity: number, productId?: number, selectedSize?: string, selectedColor?: string) => Promise<void>
  removeItem: (itemId: number, productId?: number, selectedSize?: string, selectedColor?: string) => Promise<void>
  clearCart: () => Promise<void>
  cartItemCount: number
  setSyncedCartData: (data: Cart | null, summary: CartSummary) => void
  localCart: LocalCartItem[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [summary, setSummary] = useState<CartSummary>({ totalItems: 0, totalPrice: 0 })
  const [loading, setLoading] = useState(false)
  const [localCart, setLocalCart] = useState<LocalCartItem[]>([])
  const [isClient, setIsClient] = useState(false)

  // Hydrate localStorage on client side
  useEffect(() => {
    setIsClient(true)
    const storedCart = readCartFromLocalStorage()
    setLocalCart(storedCart)
  }, [])

  const refreshCart = async () => {
    // If user is not logged in, use localStorage
    if (!user) {
      if (isClient) {
        const storedCart = readCartFromLocalStorage()
        setLocalCart(storedCart)
        const totalItems = storedCart.reduce((sum, item) => sum + item.quantity, 0)
        setSummary({ totalItems, totalPrice: 0 }) // Price will be 0 for local cart
      }
      setCart(null)
      setLoading(false)
      return
    }

    // User is logged in - fetch from database
    try {
      setLoading(true)
      const data = await getUserCartWithSummary()
      
      if ('message' in data && data.message === 'Cart is empty') {
        setCart(null)
        setSummary({ totalItems: 0, totalPrice: 0 })
      } else {
        setCart(data.cart as Cart)
        setSummary(data.summary)
      }
    } catch (error: unknown) {
      console.error('Error fetching cart:', error)
      // If unauthorized, clear cart silently
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } }
        if (axiosError.response?.status === 401) {
          setCart(null)
          setSummary({ totalItems: 0, totalPrice: 0 })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: number, quantity: number, selectedSize?: string, selectedColor?: string) => {
    // If user is not logged in, save to localStorage
    if (!user) {
      if (isClient) {
        const updatedCart = addItemToLocalCart({ productId, quantity, selectedSize, selectedColor })
        setLocalCart(updatedCart)
        const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0)
        setSummary({ totalItems, totalPrice: 0 })
        toast.success('Product added to cart!')
      }
      return
    }

    // User is logged in - save to database ONLY (not localStorage)
    try {
      await addToCartAPI({ productId, quantity, selectedSize, selectedColor })
      await refreshCart()
      toast.success('Product added to cart!')
    } catch (error: unknown) {
      console.error('Error adding to cart:', error)
      const message = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined
      toast.error(message || 'Failed to add to cart')
      throw error
    }
  }

  const updateQuantity = async (itemId: number, quantity: number, productId?: number, selectedSize?: string, selectedColor?: string) => {
    // If user is not logged in, update localStorage
    if (!user && isClient && productId !== undefined) {
      const updatedCart = updateLocalCartItemQuantity(productId, quantity, selectedSize, selectedColor)
      setLocalCart(updatedCart)
      const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0)
      setSummary({ totalItems, totalPrice: 0 })
      toast.success('Quantity updated!')
      return
    }

    // User is logged in - update database
    // Optimistic update - update local state immediately
    if (cart?.CartItems) {
      const updatedCartItems = cart.CartItems.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              quantity, 
              totalPrice: (item.Product.productDiscountPrice || item.Product.productPrice) * quantity,
            }
          : item
      )
      
      // Calculate new summary
      const newTotalItems = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0)
      const newTotalPrice = updatedCartItems.reduce((sum, item) => sum + item.totalPrice, 0)
      
      // Update local state immediately
      setCart({ ...cart, CartItems: updatedCartItems })
      setSummary({ totalItems: newTotalItems, totalPrice: newTotalPrice })
    }

    try {
      // Update on server in background
      const response = await updateCartItemQuantity(itemId, { quantity })
      if (response.success) {
        toast.success(response.message || 'Quantity updated!')
      }
    } catch (error: unknown) {
      console.error('Error updating quantity:', error)
      const message = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined
      toast.error(message || 'Failed to update quantity')
      // Revert to server state on error
      await refreshCart()
      throw error
    }
  }

  const removeItem = async (itemId: number, productId?: number, selectedSize?: string, selectedColor?: string) => {
    // If user is not logged in, remove from localStorage
    if (!user && isClient && productId !== undefined) {
      const updatedCart = removeItemFromLocalCart(productId, selectedSize, selectedColor)
      setLocalCart(updatedCart)
      const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0)
      setSummary({ totalItems, totalPrice: 0 })
      toast.success('Item removed from cart')
      return
    }

    // User is logged in - remove from database
    // Optimistic update - remove from local state immediately
    if (cart?.CartItems) {
      const updatedCartItems = cart.CartItems.filter(item => item.id !== itemId)
      
      // Calculate new summary
      const newTotalItems = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0)
      const newTotalPrice = updatedCartItems.reduce((sum, item) => sum + item.totalPrice, 0)
      
      // Update local state immediately
      if (updatedCartItems.length === 0) {
        setCart(null)
        setSummary({ totalItems: 0, totalPrice: 0 })
      } else {
        setCart({ ...cart, CartItems: updatedCartItems })
        setSummary({ totalItems: newTotalItems, totalPrice: newTotalPrice })
      }
    }

    try {
      // Remove on server in background
      await removeCartItem(itemId)
      // Silently refresh to sync with server
      const data = await getUserCartWithSummary()
      if ('message' in data && data.message === 'Cart is empty') {
        setCart(null)
        setSummary({ totalItems: 0, totalPrice: 0 })
      } else {
        setCart(data.cart as Cart)
        setSummary(data.summary)
      }
      toast.success('Item removed from cart')
    } catch (error: unknown) {
      console.error('Error removing item:', error)
      const message = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined
      toast.error(message || 'Failed to remove item')
      // Revert to server state on error
      await refreshCart()
      throw error
    }
  }

  const clearCart = async () => {
    // If user is not logged in, clear localStorage
    if (!user && isClient) {
      clearLocalCart()
      setLocalCart([])
      setSummary({ totalItems: 0, totalPrice: 0 })
      toast.success('Cart cleared')
      return
    }

    // User is logged in - clear database ONLY (not localStorage)
    try {
      await removeAllCartItems()
      await refreshCart()
      toast.success('Cart cleared')
    } catch (error: unknown) {
      console.error('Error clearing cart:', error)
      const message = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined
      toast.error(message || 'Failed to clear cart')
      throw error
    }
  }

  useEffect(() => {
    // Only refresh cart when user changes (login/logout)
    if (isClient) {
      refreshCart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isClient])

  // Method to directly set synced cart data (used after login sync)
  const setSyncedCartData = (data: Cart | null, summaryData: CartSummary) => {
    console.log('[CartContext] Setting synced cart data:', data, summaryData)
    setCart(data)
    setSummary(summaryData)
    // Clear localStorage after successful sync - database is now the source of truth
    if (isClient) {
      clearLocalCart()
      setLocalCart([])
      console.log('[CartContext] Local cart cleared after sync')
    }
  }

  // Compute cartItemCount reactively from state (not localStorage directly)
  const cartItemCount = useMemo(() => 
    user 
      ? summary.totalItems 
      : localCart.reduce((total, item) => total + item.quantity, 0),
    [user, summary.totalItems, localCart]
  )

  const contextValue = useMemo(() => ({
    cart,
    summary,
    loading,
    refreshCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    cartItemCount,
    setSyncedCartData,
    localCart,
  }), [cart, summary, loading, cartItemCount, localCart])

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
