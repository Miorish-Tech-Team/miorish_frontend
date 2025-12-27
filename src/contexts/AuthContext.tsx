'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useMemo } from 'react'
import { authAPI, User } from '@/services/authService'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
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
    console.log('[AuthContext] Using cached user data')
    return globalUserState
  }

  if (fetchPromise) {
    console.log('[AuthContext] Waiting for existing fetch...')
    return fetchPromise
  }

  console.log('[AuthContext] Fetching user for the first time...')
  fetchPromise = (async () => {
    try {
      const currentUser = await authAPI.getCurrentUser()
      globalUserState = currentUser
      hasFetchedOnce = true
      globalIsLoading = false
      console.log('[AuthContext] User fetched successfully:', currentUser?.email || 'Not logged in')
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

    // Don't fetch user if we're on auth pages to prevent redirect loops
    const isAuthPage = typeof window !== 'undefined' && 
                      (window.location.pathname.startsWith('/auth/') ||
                       window.location.pathname === '/auth/login' ||
                       window.location.pathname === '/auth/register')

    if (isAuthPage) {
      console.log('[AuthContext] Skipping user fetch on auth page')
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

  const login = useMemo(() => (userData: User) => {
    globalUserState = userData
    setUser(userData)
  }, [])

  const logout = useMemo(() => async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
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
