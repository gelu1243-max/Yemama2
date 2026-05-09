'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Calendar, User, ArrowLeft, Plus, Heart } from 'lucide-react'

export default function HeartTrackingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Heart Rate Tracker</h1>
              <p className="text-muted-foreground text-sm">Monitor your heart health</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Current Stats */}
        <Card className="p-8 border-0 bg-gradient-to-br from-orange-50 to-pink-50 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-4">❤️</div>
            <div className="text-5xl font-bold text-orange-600 mb-2">75</div>
            <p className="text-muted-foreground">BPM (Last measured today)</p>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Button className="w-full bg-gradient-to-r from-primary to-accent text-white py-6 text-lg" onClick={() => router.push('/tracking/logs')}>
            <Plus className="w-5 h-5 mr-2" />
            Log Heart Rate
          </Button>

          <Card className="p-4 border-0">
            <h3 className="font-bold text-foreground mb-4">Recent Readings</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-foreground">Today at 9:30 AM</span>
                <span className="font-bold text-orange-600">78 BPM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-foreground">Yesterday at 2:15 PM</span>
                <span className="font-bold text-orange-600">72 BPM</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 bg-gradient-to-br from-orange-50 to-pink-50">
            <h3 className="font-bold text-foreground mb-2">Normal Range</h3>
            <p className="text-sm text-muted-foreground">60-100 BPM during rest is normal for adults</p>
            <p className="text-sm text-muted-foreground mt-2">During pregnancy, your heart rate may increase by 10-20 BPM</p>
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
