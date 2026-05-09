'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Calendar, User, ArrowLeft, Plus } from 'lucide-react'

export default function SleepTrackingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sleep Tracker</h1>
              <p className="text-muted-foreground text-sm">Track your rest and recovery</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="p-8 border-0 bg-gradient-to-br from-purple-50 to-indigo-50 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-4">😴</div>
            <div className="text-5xl font-bold text-purple-600 mb-2">7h 30m</div>
            <p className="text-muted-foreground">Average sleep last night</p>
          </div>
        </Card>

        <div className="space-y-4">
          <Button className="w-full bg-gradient-to-r from-primary to-accent text-white py-6 text-lg">
            <Plus className="w-5 h-5 mr-2" />
            Log Sleep
          </Button>

          <Card className="p-4 border-0">
            <h3 className="font-bold text-foreground mb-4">Sleep Quality Tips</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Maintain consistent sleep schedule</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>7-9 hours recommended for adults</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>During pregnancy, rest as much as needed</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

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
