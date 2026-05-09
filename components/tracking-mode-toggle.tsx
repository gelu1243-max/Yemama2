'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

type TrackingMode = 'period' | 'pregnancy'

interface TrackingModeToggleProps {
  userId?: string
  mode: TrackingMode
  onModeChange: (mode: TrackingMode) => void
}

export function TrackingModeToggle({ userId, mode, onModeChange }: TrackingModeToggleProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSetMode = async (nextMode: TrackingMode) => {
    if (nextMode === mode || saving) return

    const previousMode = mode
    onModeChange(nextMode)
    setSaving(true)
    setError(null)

    if (typeof window !== 'undefined') {
      localStorage.setItem('yemama-tracking-mode', nextMode)
    }

    if (!userId) {
      setSaving(false)
      return
    }

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ tracking_type: nextMode })
        .eq('user_id', userId)

      if (updateError) throw updateError
    } catch {
      onModeChange(previousMode)
      if (typeof window !== 'undefined') {
        localStorage.setItem('yemama-tracking-mode', previousMode)
      }
      setError('Unable to switch mode. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="inline-flex items-center rounded-full border border-white/60 bg-white/70 p-1 shadow-sm backdrop-blur">
        <Button
          type="button"
          size="sm"
          variant={mode === 'period' ? 'default' : 'ghost'}
          className="h-8 rounded-full px-4 text-xs"
          onClick={() => handleSetMode('period')}
          disabled={saving}
        >
          Cycle Mode
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === 'pregnancy' ? 'default' : 'ghost'}
          className="h-8 rounded-full px-4 text-xs"
          onClick={() => handleSetMode('pregnancy')}
          disabled={saving}
        >
          Pregnancy Mode
        </Button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
