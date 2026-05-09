'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function OnboardingPage() {
  const [trackingType, setTrackingType] = useState<'period' | 'pregnancy' | null>(null)
  const [cycleLengthInput, setCycleLengthInput] = useState('28')
  const [periodLengthInput, setPeriodLengthInput] = useState('5')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()
  const supabase = createClient()

  const handleTrackingTypeSelect = (type: 'period' | 'pregnancy') => {
    setTrackingType(type)
    setStep(2)
  }

  const handleComplete = async () => {
    if (!trackingType) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase.from('user_profiles').insert({
        user_id: user.id,
        tracking_type: trackingType,
        cycle_length: parseInt(cycleLengthInput),
        period_length: parseInt(periodLengthInput),
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error('Onboarding error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Welcome to yemama
          </h1>
          <p className="text-muted-foreground text-lg">Let&apos;s get you started</p>
        </div>

        {/* Step 1: Select tracking type */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-center text-foreground font-semibold text-lg mb-6">
              What would you like to track?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                onClick={() => handleTrackingTypeSelect('period')}
                className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Period Tracking</h3>
                  <p className="text-muted-foreground text-sm">
                    Track your menstrual cycle, symptoms, and fertility window
                  </p>
                </div>
              </Card>

              <Card
                onClick={() => handleTrackingTypeSelect('pregnancy')}
                className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">🤰</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Pregnancy Tracking</h3>
                  <p className="text-muted-foreground text-sm">
                    Follow your baby&apos;s development and monitor your health
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Configure preferences */}
        {step === 2 && trackingType === 'period' && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Customize Your Cycle</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Average Cycle Length (days)
                </label>
                <input
                  type="number"
                  value={cycleLengthInput}
                  onChange={(e) => setCycleLengthInput(e.target.value)}
                  min="21"
                  max="35"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">Typical range: 21-35 days</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Average Period Length (days)
                </label>
                <input
                  type="number"
                  value={periodLengthInput}
                  onChange={(e) => setPeriodLengthInput(e.target.value)}
                  min="2"
                  max="7"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">Typical range: 2-7 days</p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                >
                  {loading ? 'Setting up...' : 'Get Started'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Pregnancy info */}
        {step === 2 && trackingType === 'pregnancy' && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Start Your Pregnancy Journey</h2>
            <div className="space-y-6">
              <p className="text-muted-foreground">
                You&apos;ll be able to log pregnancy details like due date, health metrics, and baby development from your dashboard.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                >
                  {loading ? 'Setting up...' : 'Get Started'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
