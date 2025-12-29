'use client'

import { useAuthModal } from '@/contexts/AuthModalContext'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import ForgotPasswordModal from './ForgotPasswordModal'

export default function AuthModals() {
  const { activeModal } = useAuthModal()

  if (!activeModal) return null

  return (
    <>
      {activeModal === 'login' && <LoginModal />}
      {activeModal === 'register' && <RegisterModal />}
      {activeModal === 'forgot-password' && <ForgotPasswordModal />}
    </>
  )
}
