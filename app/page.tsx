'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/auth/login')
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🌸</div>
        <h1 className="text-2xl font-bold text-foreground">yemama</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
