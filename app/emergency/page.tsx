'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function EmergencyPage() {
  const supabase = createClient()
  const [isLatePregnancy, setIsLatePregnancy] = useState(false)

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('pregnancy_data').select('current_week').eq('user_id', user.id).maybeSingle()
      setIsLatePregnancy((data?.current_week || 0) >= 32)
    }
    run()
  }, [])

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl space-y-4 px-4 py-6">
      {isLatePregnancy ? (
        <Card className="border-red-500 bg-red-50 p-4">
          <p className="font-semibold text-red-700">Labor Mode Priority Active</p>
          <p className="text-sm text-red-600">Emergency controls are highlighted for late-stage pregnancy.</p>
        </Card>
      ) : null}
      <Card className="p-4">
        <h1 className="text-xl font-semibold">Emergency Assistance</h1>
        <p className="text-sm text-muted-foreground">One tap access to emergency services and saved contacts.</p>
      </Card>
      <div className="grid gap-3">
        <a href="tel:911"><Button className="w-full bg-red-600 hover:bg-red-700">Call Emergency Number</Button></a>
        <a href="tel:939"><Button className="w-full" variant="outline">Call Ambulance</Button></a>
        <a href="tel:+251911000000"><Button className="w-full" variant="outline">Call Saved Contact</Button></a>
      </div>
    </div>
  )
}
