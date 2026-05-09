'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Home, Calendar, User } from 'lucide-react'

interface CycleLog {
  date: string
  phase: 'period' | 'fertile' | 'ovulation' | 'luteal'
  symptoms?: string[]
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1))
  const [cycleLogs, setCycleLogs] = useState<Map<string, CycleLog>>(new Map())
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

        setProfile(profileData)

        // Fetch cycle logs
        const { data: logsData } = await supabase
          .from('cycle_logs')
          .select('*')
          .eq('user_id', authUser.id)

        const logsMap = new Map()
        logsData?.forEach((log: any) => {
          logsMap.set(log.date, log)
        })
        setCycleLogs(logsMap)
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'period':
        return 'bg-red-300 text-white'
      case 'fertile':
        return 'bg-pink-300 text-white'
      case 'ovulation':
        return 'bg-purple-400 text-white'
      case 'luteal':
        return 'bg-blue-300 text-white'
      default:
        return 'bg-gray-100 text-foreground'
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading calendar...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">
              {profile?.tracking_type === 'pregnancy' ? 'Pregnancy Calendar' : 'Your Cycle'}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Illustration */}
          <div className="lg:col-span-1">
            <Card className="p-4 border-0 overflow-hidden">
              <Image
                src="/images/cycle-calendar.jpg"
                alt="Calendar illustration showing cycle phases"
                width={400}
                height={400}
                className="w-full h-auto rounded-lg object-cover"
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-300"></div>
                  <span className="text-sm text-foreground">Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-pink-300"></div>
                  <span className="text-sm text-foreground">Fertile</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-400"></div>
                  <span className="text-sm text-foreground">Ovulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-300"></div>
                  <span className="text-sm text-foreground">Luteal</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-0">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-2xl font-bold text-foreground text-center flex-1">{monthName}</h2>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center font-semibold text-muted-foreground text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square"></div>
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  const dateStr = date.toISOString().split('T')[0]
                  const log = cycleLogs.get(dateStr)

                  return (
                    <div
                      key={day}
                      className={`aspect-square flex items-center justify-center rounded-lg font-semibold text-sm transition-all ${
                        log ? getPhaseColor(log.phase) : 'bg-gray-50 text-foreground hover:bg-gray-100'
                      } cursor-pointer`}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  {profile?.tracking_type === 'pregnancy'
                    ? 'Track important dates in your pregnancy journey'
                    : `Cycle length: ${profile?.cycle_length || 28} days | Period length: ${profile?.period_length || 5} days`}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="p-4 border-0 bg-gradient-to-br from-red-50 to-pink-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {Array.from(cycleLogs.values()).filter((l) => l.phase === 'period').length}
              </div>
              <p className="text-sm text-muted-foreground">Period Days Tracked</p>
            </div>
          </Card>
          <Card className="p-4 border-0 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Array.from(cycleLogs.values()).filter((l) => l.phase === 'ovulation').length}
              </div>
              <p className="text-sm text-muted-foreground">Ovulation Days</p>
            </div>
          </Card>
          <Card className="p-4 border-0 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{cycleLogs.size}</div>
              <p className="text-sm text-muted-foreground">Total Days Logged</p>
            </div>
          </Card>
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
            <Link href="/calendar" className="flex flex-col items-center gap-1 text-primary">
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
