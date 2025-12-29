'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getUserCartWithSummary, addToCart as addToCartAPI, updateCartItemQuantity, removeCartItem, removeAllCartItems, type Cart, type CartSummary } from '@/services/cartService'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

interface CartContextType {
  cart: Cart | null
  summary: CartSummary
  loading: boolean
  refreshCart: () => Promise<void>
  addToCart: (productId: number, quantity: number, selectedSize?: string, selectedColor?: string) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  cartItemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [summary, setSummary] = useState<CartSummary>({ totalItems: 0, totalPrice: 0 })
  const [loading, setLoading] = useState(false)

  const refreshCart = async () => {
    // Don't fetch cart if user is not logged in
    if (!user) {
      setCart(null)
      setSummary({ totalItems: 0, totalPrice: 0 })
      setLoading(false)
      return
    }

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

  const updateQuantity = async (itemId: number, quantity: number) => {
    // Optimistic update - update local state immediately
    if (cart?.CartItems) {
      const updatedCartItems = cart.CartItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity, totalPrice: (item.Product.productDiscountPrice || item.Product.productPrice) * quantity }
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
      await updateCartItemQuantity(itemId, { quantity })
      // Silently refresh to sync with server (no loading state)
      const data = await getUserCartWithSummary()
      if (!('message' in data)) {
        setCart(data.cart as Cart)
        setSummary(data.summary)
      }
      toast.success('Quantity updated!')
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

  const removeItem = async (itemId: number) => {
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
    refreshCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const cartItemCount = summary.totalItems

  return (
    <CartContext.Provider
      value={{
        cart,
        summary,
        loading,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartItemCount,
      }}
    >
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
