'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useMemo } from 'react'
import { authAPI, User } from '@/services/authService'
import { syncAllToDatabase } from '@/utils/syncStorage'
import { clearAllAppStorage } from '@/utils/localStorage'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, onSyncComplete?: (cartData: any, wishlistData: any) => void) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Singleton pattern - only fetch user once globally
let globalUserState: User | null = null
let globalIsLoading = true
let fetchPromise: Promise<User | null> | null = null
let hasFetchedOnce = false

const fetchUserOnce = async (): Promise<User | null> => {
  if (hasFetchedOnce) {
    return globalUserState
  }

  if (fetchPromise) {
    return fetchPromise
  }

  fetchPromise = (async () => {
    try {
      const currentUser = await authAPI.getCurrentUser()
      globalUserState = currentUser
      hasFetchedOnce = true
      globalIsLoading = false
      return currentUser
    } catch (error) {
      console.error('[AuthContext] Failed to load user:', error)
      hasFetchedOnce = true
      globalIsLoading = false
      return null
    } finally {
      fetchPromise = null
    }
  })()

  return fetchPromise
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(globalUserState)
  const [isLoading, setIsLoading] = useState(globalIsLoading)
  const mountedRef = useRef(false)

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    // Don't fetch user if we're on auth pages to prevent redirect loops and 401 errors
    const isAuthPage = typeof window !== 'undefined' && 
                      window.location.pathname === '/auth/callback';

    if (isAuthPage) {
      setIsLoading(false)
      return
    }

    const loadUser = async () => {
      const currentUser = await fetchUserOnce()
      setUser(currentUser)
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const login = useMemo(() => async (userData: User, onSyncComplete?: (cartData: any, wishlistData: any) => void) => {
    // console.log('[AuthContext] User logging in:', userData)
    globalUserState = userData
    setUser(userData)
    
    // Sync localStorage data to database immediately after login
    // This updates the contexts in real-time without page refresh
    if (typeof window !== 'undefined') {
      try {
        // console.log('[AuthContext] Starting sync process...')
        const syncResult = await syncAllToDatabase(true)
        
        // console.log('[AuthContext] Sync completed:', syncResult)
        
        // Call the callback with synced data so LoginModal can update contexts
        if (onSyncComplete) {
          const cartData = syncResult.cartResult.cartData
          const wishlistData = syncResult.wishlistResult.wishlistData
          
          // console.log('[AuthContext] Calling onSyncComplete callback with data')
          onSyncComplete(cartData, wishlistData)
        }
      } catch (error) {
        console.error('[AuthContext] Failed to sync localStorage to database:', error)
      }
    }
  }, [])

  const logout = useMemo(() => async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear all app-specific localStorage (cart and wishlist)
      // User will start fresh as guest after logout
      if (typeof window !== 'undefined') {
        clearAllAppStorage()
        // console.log('[AuthContext] Cleared localStorage on logout')
      }
      globalUserState = null
      hasFetchedOnce = false
      setUser(null)
    }
  }, [])

  const updateUser = useMemo(() => (userData: User) => {
    globalUserState = userData
    setUser(userData)
  }, [])

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  }), [user, isLoading, login, logout, updateUser])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
