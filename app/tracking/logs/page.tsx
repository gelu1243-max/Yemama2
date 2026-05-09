'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { MobileNav } from '@/components/mobile-nav'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const SYMPTOMS = ['Cramps', 'Headache', 'Nausea', 'Fatigue', 'Back pain', 'Mood swings', 'Others']
const MOODS = ['Great', 'Good', 'Okay', 'Low', 'Very low']

type MetricForm = {
  bloodPressureSys: string
  bloodPressureDia: string
  heartRate: string
  sleepDuration: string
  energyLevel: string
}

export default function TrackingLogsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string>('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [mood, setMood] = useState('Okay')
  const [notes, setNotes] = useState('')
  const [metrics, setMetrics] = useState<MetricForm>({
    bloodPressureSys: '',
    bloodPressureDia: '',
    heartRate: '',
    sleepDuration: '',
    energyLevel: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [trendRows, setTrendRows] = useState<any[]>([])

  const symptomAdvice = useMemo(() => {
    if (selectedSymptoms.length === 0) return []
    const advice = new Set<string>()
    if (selectedSymptoms.some((s) => ['Nausea', 'Fatigue', 'Headache'].includes(s))) advice.add('Stay hydrated')
    if (selectedSymptoms.some((s) => ['Cramps', 'Back pain', 'Fatigue'].includes(s))) advice.add('Consider resting')
    if (selectedSymptoms.some((s) => ['Others', 'Back pain'].includes(s))) advice.add('Seek medical attention if severe')
    return Array.from(advice)
  }, [selectedSymptoms])

  const fetchTrendData = async (id: string) => {
    const { data } = await supabase
      .from('health_metrics')
      .select('date, metric_type, value')
      .eq('user_id', id)
      .in('metric_type', ['heart_rate', 'sleep_duration', 'energy_level'])
      .order('date', { ascending: true })
      .limit(90)

    const map = new Map<string, any>()
    ;(data || []).forEach((row: any) => {
      const current = map.get(row.date) || { date: row.date, heartRate: null, sleep: null, energy: null }
      if (row.metric_type === 'heart_rate') current.heartRate = Number(row.value)
      if (row.metric_type === 'sleep_duration') current.sleep = Number(row.value)
      if (row.metric_type === 'energy_level') current.energy = Number(row.value)
      map.set(row.date, current)
    })
    setTrendRows(Array.from(map.values()))
  }

  const loadDayData = async (id: string, day: string) => {
    setError('')
    setMessage('')
    const [{ data: logs }, { data: symptoms }, { data: metricRows }] = await Promise.all([
      supabase.from('cycle_logs').select('notes').eq('user_id', id).eq('date', day).maybeSingle(),
      supabase.from('symptoms').select('symptom_name').eq('user_id', id).eq('date', day),
      supabase.from('health_metrics').select('metric_type, value, notes').eq('user_id', id).eq('date', day),
    ])

    setSelectedSymptoms((symptoms || []).map((s: any) => s.symptom_name))
    setNotes(logs?.notes || '')

    const foundMood = metricRows?.find((r: any) => r.metric_type === 'mood')
    setMood(foundMood?.notes || 'Okay')

    const heart = metricRows?.find((r: any) => r.metric_type === 'heart_rate')
    const bp = metricRows?.find((r: any) => r.metric_type === 'blood_pressure')
    const sleep = metricRows?.find((r: any) => r.metric_type === 'sleep_duration')
    const energy = metricRows?.find((r: any) => r.metric_type === 'energy_level')
    const [sys = '', dia = ''] = String(bp?.notes || '/').split('/')

    setMetrics({
      bloodPressureSys: sys,
      bloodPressureDia: dia,
      heartRate: heart?.value ? String(heart.value) : '',
      sleepDuration: sleep?.value ? String(sleep.value) : '',
      energyLevel: energy?.value ? String(energy.value) : '',
    })
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)
      await Promise.all([loadDayData(user.id, date), fetchTrendData(user.id)])
      setLoading(false)
    }
    init()
  }, [])

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const saveAll = async () => {
    setError('')
    setMessage('')
    if (!date) {
      setError('Please select a date.')
      return
    }
    if (!mood) {
      setError('Please select your mood.')
      return
    }
    setSaving(true)
    try {
      const bpSys = Number(metrics.bloodPressureSys || 0)
      const bpDia = Number(metrics.bloodPressureDia || 0)
      const heartRate = Number(metrics.heartRate || 0)
      const sleep = Number(metrics.sleepDuration || 0)
      const energy = Number(metrics.energyLevel || 0)

      if ((metrics.bloodPressureSys || metrics.bloodPressureDia) && (!bpSys || !bpDia)) {
        throw new Error('Blood pressure requires both systolic and diastolic values.')
      }
      if (heartRate && (heartRate < 30 || heartRate > 220)) throw new Error('Heart rate looks invalid.')
      if (sleep && (sleep < 0 || sleep > 24)) throw new Error('Sleep duration must be between 0 and 24 hours.')
      if (energy && (energy < 1 || energy > 10)) throw new Error('Energy level must be between 1 and 10.')

      await supabase.from('cycle_logs').upsert({
        user_id: userId,
        date,
        phase: 'luteal',
        symptoms: selectedSymptoms,
        notes,
      }, { onConflict: 'user_id,date' })

      await supabase.from('symptoms').delete().eq('user_id', userId).eq('date', date)
      if (selectedSymptoms.length > 0) {
        await supabase.from('symptoms').insert(selectedSymptoms.map((symptom) => ({
          user_id: userId,
          date,
          symptom_name: symptom,
          intensity: 3,
          notes,
        })))
      }

      const metricPayload = [
        heartRate ? { user_id: userId, date, metric_type: 'heart_rate', value: heartRate, unit: 'bpm', notes: null } : null,
        sleep ? { user_id: userId, date, metric_type: 'sleep_duration', value: sleep, unit: 'hours', notes: null } : null,
        energy ? { user_id: userId, date, metric_type: 'energy_level', value: energy, unit: 'score', notes: null } : null,
        bpSys && bpDia ? { user_id: userId, date, metric_type: 'blood_pressure', value: bpSys, unit: 'mmHg', notes: `${bpSys}/${bpDia}` } : null,
        { user_id: userId, date, metric_type: 'mood', value: MOODS.indexOf(mood) + 1, unit: 'scale', notes: mood },
      ].filter(Boolean)

      if (metricPayload.length > 0) {
        await supabase.from('health_metrics').upsert(metricPayload as any[], { onConflict: 'user_id,date,metric_type' })
      }

      await fetchTrendData(userId)
      setMessage('Your log has been saved successfully.')
    } catch (err: any) {
      setError(err?.message || 'Unable to save your log.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><Spinner className="h-6 w-6" /></div>
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6">
        <Card className="p-4">
          <h1 className="text-xl font-semibold">Daily Health Log</h1>
          <p className="text-sm text-muted-foreground">Track symptoms, mood, notes, and wellness metrics.</p>
        </Card>

        <Card className="space-y-4 p-4">
          <Input type="date" value={date} onChange={(e) => { setDate(e.target.value); loadDayData(userId, e.target.value) }} />
          <div>
            <p className="mb-2 text-sm font-medium">Symptoms (multi-select)</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SYMPTOMS.map((symptom) => (
                <label key={symptom} className="flex items-center gap-2 rounded border p-2 text-sm">
                  <Checkbox checked={selectedSymptoms.includes(symptom)} onCheckedChange={() => toggleSymptom(symptom)} />
                  {symptom}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Mood</p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((value) => (
                <Button key={value} type="button" size="sm" variant={mood === value ? 'default' : 'outline'} onClick={() => setMood(value)}>
                  {value}
                </Button>
              ))}
            </div>
          </div>

          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes for today..." />

          <div className="grid gap-2 sm:grid-cols-2">
            <Input value={metrics.bloodPressureSys} onChange={(e) => setMetrics((p) => ({ ...p, bloodPressureSys: e.target.value }))} placeholder="Blood pressure systolic" />
            <Input value={metrics.bloodPressureDia} onChange={(e) => setMetrics((p) => ({ ...p, bloodPressureDia: e.target.value }))} placeholder="Blood pressure diastolic" />
            <Input value={metrics.heartRate} onChange={(e) => setMetrics((p) => ({ ...p, heartRate: e.target.value }))} placeholder="Heart rate (BPM)" />
            <Input value={metrics.sleepDuration} onChange={(e) => setMetrics((p) => ({ ...p, sleepDuration: e.target.value }))} placeholder="Sleep duration (hours)" />
            <Input value={metrics.energyLevel} onChange={(e) => setMetrics((p) => ({ ...p, energyLevel: e.target.value }))} placeholder="Energy level (1-10)" />
          </div>

          <div className="flex gap-2">
            <Button type="button" onClick={saveAll} disabled={saving}>
              {saving ? <><Spinner className="mr-2" />Saving...</> : 'Save log'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setMessage(symptomAdvice.length ? symptomAdvice.join(' • ') : 'No symptom advice yet. Select symptoms first.')}>
              Get Advice
            </Button>
          </div>
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold">Wellness Trends</h2>
          {trendRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No trends yet. Save your first log.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendRows}>
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" name="Heart rate" />
                  <Line type="monotone" dataKey="sleep" stroke="#3b82f6" name="Sleep" />
                  <Line type="monotone" dataKey="energy" stroke="#10b981" name="Energy" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
      <MobileNav active="dashboard" />
    </div>
  )
}
