'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrackingModeToggle } from '@/components/tracking-mode-toggle'
import { MobileNav } from '@/components/mobile-nav'
import { User, LogOut, Settings } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [mode, setMode] = useState<'period' | 'pregnancy'>('period')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) {
          router.push('/auth/login')
          return
        }

        setUser(authUser)

        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single()

        setProfile(profileData)
        if (profileData?.tracking_type) {
          setMode(profileData.tracking_type)
        }

        const localMode = typeof window !== 'undefined' ? localStorage.getItem('yemama-tracking-mode') : null
        if (localMode === 'period' || localMode === 'pregnancy') {
          setMode(localMode)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Account</p>
            <h1 className="text-xl font-semibold text-foreground">Profile</h1>
          </div>
          <TrackingModeToggle userId={user?.id} mode={mode} onModeChange={setMode} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        <Card className="glass-card mb-6 border-0 bg-gradient-to-br from-cyan-50 to-pink-50 p-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {profile?.full_name || 'Welcome to yemama'}
              </h2>
              <p className="text-muted-foreground mb-3">{user?.email}</p>
              <div className="inline-block px-3 py-1 bg-primary/20 rounded-full text-sm font-semibold text-primary">
                {mode === 'pregnancy' ? 'Pregnancy Tracking' : 'Cycle Tracking'}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-bold text-foreground">Health Settings</h3>
          <Card className="glass-card border-0 p-6">
            <div className="space-y-4">
              {mode === 'period' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Average Cycle Length
                    </label>
                    <div className="text-2xl font-bold text-primary">{profile?.cycle_length || 28} days</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Average Period Length
                    </label>
                    <div className="text-2xl font-bold text-primary">{profile?.period_length || 5} days</div>
                  </div>
                </>
              )}
              <Button variant="outline" className="w-full mt-4">
                <Settings className="w-4 h-4 mr-2" />
                Edit Settings
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-bold text-foreground">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card className="glass-card border-0 bg-gradient-to-br from-blue-50 to-purple-50 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">365+</div>
              <p className="text-sm text-muted-foreground">Days Tracked</p>
            </Card>
            <Card className="glass-card border-0 bg-gradient-to-br from-pink-50 to-purple-50 p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">12</div>
              <p className="text-sm text-muted-foreground">Cycles Tracked</p>
            </Card>
          </div>
        </div>

        {/* Account Management */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-bold text-foreground">Account</h3>
          <Card className="glass-card border-0 space-y-3 p-6">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Notification Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Privacy & Security
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Data Export
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </Card>
        </div>

        <Card className="glass-card mb-8 border-0 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
          <h3 className="font-bold text-foreground mb-2">About yemama</h3>
          <p className="text-sm text-muted-foreground mb-4">
            yemama is your compassionate companion for tracking pregnancy and menstrual cycles. Built with care for every woman&apos;s unique journey.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Help & Support
            </Button>
            <Button variant="outline" size="sm">
              Privacy Policy
            </Button>
          </div>
        </Card>

        <Card className="glass-card mb-8 overflow-hidden border-0 p-0">
          <Image
            src="/images/profile-mother.jpg"
            alt="Mother and child bond"
            width={400}
            height={300}
            className="w-full h-auto object-cover"
          />
        </Card>
      </div>

      <MobileNav active="profile" />
    </div>
  )
}
