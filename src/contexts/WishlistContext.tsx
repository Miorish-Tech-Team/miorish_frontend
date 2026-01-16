'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react'
import { 
  getUserWishlist, 
  addToWishlist as addToWishlistAPI, 
  removeFromWishlistByProductId,
  type WishlistItem, 
  type WishlistResponse 
} from '@/services/wishlistService'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import {
  readWishlistFromLocalStorage,
  addItemToLocalWishlist,
  removeItemFromLocalWishlist,
  clearLocalWishlist,
  getLocalWishlistItemCount,
  isInLocalWishlist,
  LocalWishlistItem
} from '@/utils/localStorage'

interface WishlistContextType {
  wishlist: WishlistItem[]
  wishlistCount: number
  loading: boolean
  refreshWishlist: () => Promise<void>
  addToWishlist: (productId: number) => Promise<void>
  removeFromWishlist: (productId: number) => Promise<void>
  isInWishlist: (productId: number) => boolean
  setSyncedWishlistData: (items: WishlistItem[], count: number) => void
  localWishlist: LocalWishlistItem[]
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [localWishlist, setLocalWishlist] = useState<LocalWishlistItem[]>([])
  const [isClient, setIsClient] = useState(false)

  // Hydrate localStorage on client side
  useEffect(() => {
    setIsClient(true)
    const storedWishlist = readWishlistFromLocalStorage()
    setLocalWishlist(storedWishlist)
    setWishlistCount(storedWishlist.length)
  }, [])

  const refreshWishlist = async () => {
    // If user is not logged in, use localStorage
    if (!user) {
      if (isClient) {
        const storedWishlist = readWishlistFromLocalStorage()
        setLocalWishlist(storedWishlist)
        setWishlistCount(storedWishlist.length)
      }
      setWishlist([])
      setLoading(false)
      return
    }

    // User is logged in - fetch from database
    try {
      setLoading(true)
      const data: WishlistResponse = await getUserWishlist()
      setWishlist(data.wishlist || [])
      setWishlistCount(data.wishlistCount || 0)
    } catch (error: unknown) {
      console.error('Error fetching wishlist:', error)
      // If unauthorized, clear wishlist silently
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } }
        if (axiosError.response?.status === 401) {
          setWishlist([])
          setWishlistCount(0)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (productId: number) => {
    // If user is not logged in, save to localStorage
    if (!user) {
      if (isClient) {
        const updatedWishlist = addItemToLocalWishlist(productId)
        setLocalWishlist(updatedWishlist)
        setWishlistCount(updatedWishlist.length)
        toast.success('Added to wishlist!')
      }
      return
    }

    // User is logged in - save to database ONLY (not localStorage)
    // Optimistic update
    try {
      await addToWishlistAPI(productId)
      // Refresh to get the full item with Product data from server
      const data: WishlistResponse = await getUserWishlist()
      setWishlist(data.wishlist || [])
      setWishlistCount(data.wishlistCount || 0)
      toast.success('Added to wishlist!')
    } catch (error: unknown) {
      console.error('Error adding to wishlist:', error)
      const message = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined
      
      // Don't show error if item already exists
      if (message && message.toLowerCase().includes('already')) {
        toast.success('Already in wishlist')
      } else {
        toast.error(message || 'Failed to add to wishlist')
      }
      throw error
    }
  }

  const removeFromWishlist = async (productId: number) => {
    // If user is not logged in, remove from localStorage
    if (!user) {
      if (isClient) {
        const updatedWishlist = removeItemFromLocalWishlist(productId)
        setLocalWishlist(updatedWishlist)
        setWishlistCount(updatedWishlist.length)
        toast.success('Removed from wishlist')
      }
      return
    }

    // User is logged in - remove from database ONLY (not localStorage)
    // Optimistic update
    const previousWishlist = [...wishlist]
    const updatedWishlist = wishlist.filter(item => item.productId !== productId)
    setWishlist(updatedWishlist)
    setWishlistCount(updatedWishlist.length)

    try {
      await removeFromWishlistByProductId(productId)
      toast.success('Removed from wishlist')
    } catch (error: unknown) {
      console.error('Error removing from wishlist:', error)
      const message = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined
      toast.error(message || 'Failed to remove from wishlist')
      
      // Revert on error
      setWishlist(previousWishlist)
      setWishlistCount(previousWishlist.length)
      throw error
    }
  }

  const isInWishlist = (productId: number): boolean => {
    if (!user) {
      // Check localStorage for unauthenticated users
      return isClient ? isInLocalWishlist(productId) : false
    }
    
    // Check database wishlist for authenticated users
    return wishlist.some(item => item.productId === productId)
  }

  useEffect(() => {
    // Only refresh wishlist when user changes (login/logout)
    if (isClient) {
      refreshWishlist()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isClient])

  // Method to directly set synced wishlist data (used after login sync)
  const setSyncedWishlistData = (items: WishlistItem[], count: number) => {
    console.log('[WishlistContext] Setting synced wishlist data:', items, count)
    setWishlist(items)
    setWishlistCount(count)
    // Clear localStorage after successful sync - database is now the source of truth
    if (isClient) {
      clearLocalWishlist()
      setLocalWishlist([])
      console.log('[WishlistContext] Local wishlist cleared after sync')
    }
  }

  const contextValue = useMemo(() => ({
    wishlist,
    wishlistCount,
    loading,
    refreshWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    setSyncedWishlistData,
    localWishlist,
  }), [wishlist, wishlistCount, loading, localWishlist])

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
