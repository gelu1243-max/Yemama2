'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Calendar, User, Plus, Heart, TrendingUp } from 'lucide-react'

interface PregnancyData {
  id: string
  conception_date: string
  current_week: number
  baby_weight?: number
  baby_height?: number
  mother_condition?: string
  due_date: string
}

export default function PregnancyPage() {
  const [user, setUser] = useState<any>(null)
  const [pregnancyData, setPregnancyData] = useState<PregnancyData | null>(null)
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

        const { data: pregData } = await supabase
          .from('pregnancy_data')
          .select('*')
          .eq('user_id', authUser.id)
          .single()

        if (pregData) {
          setPregnancyData(pregData)
        }
      } catch (err) {
        console.error('Error fetching pregnancy data:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const getBabyStage = (week: number) => {
    if (week < 4) return 'Conception'
    if (week < 8) return 'Embryo'
    if (week < 12) return 'Fetal Stage'
    if (week < 16) return 'Tiny Bean'
    if (week < 20) return 'Forming Features'
    if (week < 24) return 'Viable Baby'
    if (week < 28) return 'Quickening'
    if (week < 32) return 'Kicking Baby'
    if (week < 36) return 'Nearly There'
    return 'Ready to Meet'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading pregnancy data...</p>
      </div>
    )
  }

  if (!pregnancyData) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-foreground">Pregnancy Journey</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card className="p-8 text-center border-0 bg-gradient-to-br from-pink-50 to-purple-50">
            <div className="text-5xl mb-4">🤰</div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Start Your Journey</h2>
            <p className="text-muted-foreground mb-6">
              Add your pregnancy information to start tracking your baby's development and your health
            </p>
            <Button className="bg-gradient-to-r from-primary to-accent text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Pregnancy Info
            </Button>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-border">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex justify-around items-center">
              <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
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

  const currentWeek = pregnancyData.current_week || 20
  const progress = (currentWeek / 40) * 100
  const weeksRemaining = 40 - currentWeek

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Your Pregnancy Journey</h1>
          <p className="text-muted-foreground text-sm">
            Week {currentWeek} of 40 • {weeksRemaining} weeks to go
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Illustration */}
          <div className="lg:col-span-1">
            <Card className="p-4 border-0 overflow-hidden sticky top-32">
              <Image
                src="/images/pregnancy-development.jpg"
                alt="Pregnancy development timeline"
                width={400}
                height={500}
                className="w-full h-auto rounded-lg object-cover"
              />
              <div className="mt-4">
                <p className="text-sm font-semibold text-foreground mb-2">Current Stage</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {getBabyStage(currentWeek)}
                </p>
              </div>
            </Card>
          </div>

          {/* Pregnancy Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Bar */}
            <Card className="p-6 border-0">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-foreground">Pregnancy Progress</h3>
                  <span className="text-sm font-semibold text-primary">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">{currentWeek}</div>
                  <p className="text-xs text-muted-foreground">Weeks Passed</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent mb-1">{weeksRemaining}</div>
                  <p className="text-xs text-muted-foreground">Weeks Left</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">40</div>
                  <p className="text-xs text-muted-foreground">Total Weeks</p>
                </div>
              </div>
            </Card>

            {/* Baby Development */}
            <Card className="p-6 border-0 bg-gradient-to-br from-pink-50 to-purple-50">
              <h3 className="font-bold text-foreground mb-4">Baby Development</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Baby Weight
                  </label>
                  <div className="text-2xl font-bold text-foreground">
                    {pregnancyData.baby_weight || 'Not recorded'} g
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Baby Length
                  </label>
                  <div className="text-2xl font-bold text-foreground">
                    {pregnancyData.baby_height || 'Not recorded'} cm
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Update Baby Measurements
                </Button>
              </div>
            </Card>

            {/* Mother's Health */}
            <Card className="p-6 border-0">
              <h3 className="font-bold text-foreground mb-4">Your Health</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">Physical Condition</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pregnancyData.mother_condition || 'No health notes recorded'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Heart className="w-4 h-4 mr-2" />
                    Heart Health
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Weight Tracking
                  </Button>
                </div>

                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Health Update
                </Button>
              </div>
            </Card>

            {/* Due Date */}
            <Card className="p-6 border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">Expected Due Date</p>
                <p className="text-3xl font-bold text-foreground mb-2">
                  {new Date(pregnancyData.due_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {weeksRemaining} weeks and {Math.round((weeksRemaining * 7) % 7)} days to go
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
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
