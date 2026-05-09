'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Calendar, User, ArrowLeft, Plus } from 'lucide-react'

export default function StepsTrackingPage() {
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
              <h1 className="text-3xl font-bold text-foreground">Step Tracker</h1>
              <p className="text-muted-foreground text-sm">Monitor your activity</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="p-8 border-0 bg-gradient-to-br from-yellow-50 to-orange-50 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-4">👟</div>
            <div className="text-5xl font-bold text-yellow-600 mb-2">8,234</div>
            <p className="text-muted-foreground">Steps today (Goal: 10,000)</p>
          </div>
        </Card>
        <Button className="w-full bg-gradient-to-r from-primary to-accent text-white py-6 text-lg mb-4">
          <Plus className="w-5 h-5 mr-2" /> Log Steps
        </Button>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <Home className="w-6 h-6" /><span className="text-xs font-semibold">Home</span>
            </Link>
            <Link href="/calendar" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <Calendar className="w-6 h-6" /><span className="text-xs font-semibold">Calendar</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <User className="w-6 h-6" /><span className="text-xs font-semibold">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
