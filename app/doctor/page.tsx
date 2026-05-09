'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DoctorPage() {
  const supabase = createClient()
  const [mode, setMode] = useState<'nearby' | 'online'>('nearby')
  const [doctors, setDoctors] = useState<any[]>([])

  useEffect(() => {
    const loadDoctors = async () => {
      const { data } = await supabase.from('doctors').select('*').limit(20)
      setDoctors(data || [])
    }
    loadDoctors()
  }, [])

  const filtered = doctors.filter((d) => mode === 'online' ? d.online_available : true)

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl space-y-4 px-4 py-6">
      <Card className="p-4">
        <h1 className="text-xl font-semibold">Doctor Finder</h1>
        <p className="text-sm text-muted-foreground">Find nearby clinics or online doctors and contact quickly.</p>
      </Card>
      <div className="flex gap-2">
        <Button variant={mode === 'nearby' ? 'default' : 'outline'} onClick={() => setMode('nearby')}>Nearby doctors</Button>
        <Button variant={mode === 'online' ? 'default' : 'outline'} onClick={() => setMode('online')}>Online doctors</Button>
      </div>
      {filtered.length === 0 ? (
        <Card className="p-4 text-sm text-muted-foreground">No doctors found yet. Seed `doctors` table to populate this list.</Card>
      ) : filtered.map((doctor) => (
        <Card key={doctor.id} className="p-4">
          <p className="font-semibold">{doctor.name}</p>
          <p className="text-sm text-muted-foreground">{doctor.specialty} {doctor.city ? `• ${doctor.city}` : ''}</p>
          <div className="mt-3 flex gap-2">
            <a href={doctor.phone ? `tel:${doctor.phone}` : '#'}><Button size="sm">Call</Button></a>
            <Button size="sm" variant="outline">Book appointment</Button>
            {doctor.online_available ? <Button size="sm" variant="outline">Contact online</Button> : null}
          </div>
        </Card>
      ))}
    </div>
  )
}
