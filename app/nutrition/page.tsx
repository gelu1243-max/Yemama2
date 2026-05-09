'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const FOOD_CALORIES: Record<string, number> = {
  injera: 180,
  shiro: 230,
  lentils: 190,
  vegetables: 120,
  eggs: 80,
}

export default function NutritionPage() {
  const supabase = createClient()
  const [food, setFood] = useState('injera')
  const [portion, setPortion] = useState('1')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const estimatedCalories = useMemo(() => {
    const p = Number(portion || 0)
    if (!p || !FOOD_CALORIES[food]) return 0
    return Math.round(FOOD_CALORIES[food] * p)
  }, [food, portion])

  const quality = estimatedCalories < 300 ? 'needs_improvement' : estimatedCalories <= 700 ? 'moderate' : 'good'

  const saveFood = async () => {
    setMessage('')
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Please login first.')
      await supabase.from('food_logs').insert({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        food_name: food,
        portion,
        estimated_calories: estimatedCalories,
        quality,
      })
      setMessage(`Saved: ${estimatedCalories} kcal (${quality.replace('_', ' ')})`)
    } catch (err: any) {
      setError(err?.message || 'Unable to save food log.')
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl space-y-4 px-4 py-6">
      <Card className="p-4">
        <h1 className="text-xl font-semibold">Nutrition Recommendations</h1>
        <p className="text-sm text-muted-foreground">Affordable Ethiopian choices: Injera, Shiro, Lentils, Vegetables, Eggs.</p>
      </Card>

      <Card className="space-y-3 p-4">
        <Input value={food} onChange={(e) => setFood(e.target.value.toLowerCase())} placeholder="Food (injera, shiro, lentils...)" />
        <Input value={portion} onChange={(e) => setPortion(e.target.value)} placeholder="Portion estimate (e.g. 1.5)" />
        <p className="text-sm text-muted-foreground">Estimated calories: <span className="font-semibold text-foreground">{estimatedCalories}</span></p>
        <p className="text-sm text-muted-foreground">Classification: <span className="font-semibold text-foreground">{quality.replace('_', ' ')}</span></p>
        <Button onClick={saveFood}>Save food log</Button>
        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </Card>
    </div>
  )
}
