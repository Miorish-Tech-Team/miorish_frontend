'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

function AuthToastHandlerContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const blocked = searchParams.get('blocked')
    const message = searchParams.get('message')

    if (blocked === 'true' && message) {
      toast.error(message)
      
      // Remove the blocked parameter from URL
      const url = new URL(window.location.href)
      url.searchParams.delete('blocked')
      url.searchParams.delete('message')
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [searchParams, router])

  return null
}

export default function AuthToastHandler() {
  return (
    <Suspense fallback={null}>
      <AuthToastHandlerContent />
    </Suspense>
  )
}
