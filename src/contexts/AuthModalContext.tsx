'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type AuthModalType = 'login' | 'register' | 'forgot-password' | 'reset-password' | null

interface AuthModalContextType {
  activeModal: AuthModalType
  openLoginModal: () => void
  openRegisterModal: () => void
  openForgotPasswordModal: () => void
  openResetPasswordModal: () => void
  closeModal: () => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<AuthModalType>(null)

  const openLoginModal = () => setActiveModal('login')
  const openRegisterModal = () => setActiveModal('register')
  const openForgotPasswordModal = () => setActiveModal('forgot-password')
  const openResetPasswordModal = () => setActiveModal('reset-password')
  const closeModal = () => setActiveModal(null)

  return (
    <AuthModalContext.Provider
      value={{
        activeModal,
        openLoginModal,
        openRegisterModal,
        openForgotPasswordModal,
        openResetPasswordModal,
        closeModal,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider')
  }
  return context
}
