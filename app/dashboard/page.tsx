'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Droplets, Activity, Moon, Clock, Utensils, User, Home, Calendar, Plus } from 'lucide-react'

interface TrackingCard {
  id: string
  icon: React.ReactNode
  label: string
  value?: string
  color: string
  href: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
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

        if (profileData) {
          setProfile(profileData)
        }
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🌸</div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const trackingCards: TrackingCard[] = [
    {
      id: 'pr',
      icon: <Heart className="w-8 h-8" />,
      label: 'PR Tracker',
      color: 'from-orange-400 to-orange-500',
      href: '/tracking/heart',
    },
    {
      id: 'glucose',
      icon: <Droplets className="w-8 h-8" />,
      label: 'Glucose',
      color: 'from-blue-400 to-blue-500',
      href: '/tracking/glucose',
    },
    {
      id: 'bp',
      icon: <Activity className="w-8 h-8" />,
      label: 'BP Tracker',
      color: 'from-teal-400 to-teal-500',
      href: '/tracking/bp',
    },
    {
      id: 'steps',
      icon: <Clock className="w-8 h-8" />,
      label: 'Steps',
      color: 'from-yellow-400 to-yellow-500',
      href: '/tracking/steps',
    },
    {
      id: 'sleep',
      icon: <Moon className="w-8 h-8" />,
      label: 'Sleep',
      color: 'from-purple-600 to-purple-700',
      href: '/tracking/sleep',
    },
    {
      id: 'diet',
      icon: <Utensils className="w-8 h-8" />,
      label: 'Diet',
      color: 'from-green-600 to-green-700',
      href: '/tracking/diet',
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Health Tracker</h1>
              <p className="text-muted-foreground text-sm">
                {profile?.tracking_type === 'pregnancy' ? 'Track your pregnancy journey' : 'Track your wellness'}
              </p>
            </div>
            <Link href="/profile">
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Featured Section with Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-0">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {profile?.tracking_type === 'pregnancy' ? 'Your Pregnancy Journey' : 'Your Wellness Journey'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {profile?.tracking_type === 'pregnancy'
                  ? 'Track baby development and your health'
                  : 'Monitor your cycle and overall health'}
              </p>
              <Link href={profile?.tracking_type === 'pregnancy' ? '/pregnancy' : '/calendar'}>
                <Button className="bg-gradient-to-r from-primary to-accent text-white">
                  {profile?.tracking_type === 'pregnancy' ? 'View Pregnancy' : 'View Calendar'} →
                </Button>
              </Link>
            </div>
          </Card>
          <Card className="overflow-hidden border-0">
            <Image
              src="/images/mother-child-dashboard.jpg"
              alt="Mother and child wellness"
              width={300}
              height={250}
              className="w-full h-full object-cover"
            />
          </Card>
        </div>

        {/* Tracking Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trackingCards.map((card) => (
            <Link key={card.id} href={card.href}>
              <Card className="h-40 p-6 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1 border-0 bg-white">
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${card.color} text-white`}>
                    {card.icon}
                  </div>
                  <h3 className="text-foreground font-semibold text-center">{card.label}</h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/calendar">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-all border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">View Calendar</h3>
                  <p className="text-sm text-muted-foreground">See your cycle or pregnancy timeline</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/education">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-all border-0 bg-gradient-to-br from-pink-50 to-purple-50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/20">
                  <Plus className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Learn & Grow</h3>
                  <p className="text-sm text-muted-foreground">Read health articles and guides</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary">
              <Home className="w-6 h-6" />
              <span className="text-xs font-semibold">Home</span>
            </Link>
            <Link href="/calendar" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <Calendar className="w-6 h-6" />
              <span className="text-xs font-semibold">Calendar</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <User className="w-6 h-6" />
              <span className="text-xs font-semibold">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
