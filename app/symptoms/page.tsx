'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Plus } from 'lucide-react'
import { MobileNav } from '@/components/mobile-nav'

const SYMPTOMS = [
  { name: 'Nausea', emoji: '🤢' },
  { name: 'Fatigue', emoji: '😴' },
  { name: 'Headache', emoji: '🤕' },
  { name: 'Back Pain', emoji: '🔙' },
  { name: 'Swelling', emoji: '🦵' },
  { name: 'Heartburn', emoji: '🔥' },
  { name: 'Insomnia', emoji: '🌙' },
  { name: 'Mood Swings', emoji: '🎭' },
  { name: 'Dizziness', emoji: '💫' },
  { name: 'Shortness of Breath', emoji: '😮‍💨' },
  { name: 'Chest Pain', emoji: '💔' },
  { name: 'Severe Vomiting', emoji: '🤮' },
  { name: 'Bleeding', emoji: '🩸' },
  { name: 'Reduced Fetal Movement', emoji: '👶' },
  { name: 'High Blood Pressure', emoji: '📈' },
  { name: 'Cramping', emoji: '⚡' },
  { name: 'Spotting', emoji: '🔴' },
  { name: 'Breast Tenderness', emoji: '💗' },
  { name: 'Bloating', emoji: '🎈' },
  { name: 'Constipation', emoji: '😣' },
]

const DOCTOR_MAP: Record<string, { type: string; reason: string }[]> = {
  'Bleeding': [{ type: '🚨 OB-GYN / Emergency', reason: 'Needs immediate evaluation' }],
  'Reduced Fetal Movement': [{ type: '🚨 OB-GYN', reason: 'Fetal monitoring needed urgently' }],
  'High Blood Pressure': [{ type: '⚠️ OB-GYN / Cardiologist', reason: 'Preeclampsia screening required' }],
  'Chest Pain': [{ type: '🚨 Cardiologist / Emergency', reason: 'Cardiac evaluation needed' }],
  'Severe Vomiting': [{ type: '⚠️ OB-GYN', reason: 'Hyperemesis gravidarum treatment' }],
  'Shortness of Breath': [{ type: '⚠️ Pulmonologist / OB-GYN', reason: 'Respiratory assessment needed' }],
  'Swelling': [{ type: '⚠️ OB-GYN', reason: 'Rule out preeclampsia' }],
}

export default function SymptomsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [custom, setCustom] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<{ text: string; doctors: { type: string; reason: string }[] } | null>(null)

  useEffect(() => { fetchRecent() }, [])

  const fetchRecent = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('symptoms').select('*').eq('user_id', user.id)
      .order('date', { ascending: false }).limit(10)
    if (data) setRecent(data)
  }

  const toggle = (name: string) => {
    const next = new Set(selected)
    next.has(name) ? next.delete(name) : next.add(name)
    setSelected(next)
  }

  const analyze = (names: string[]) => {
    const msgs: string[] = []
    const docs: { type: string; reason: string }[] = []
    if (names.includes('Bleeding')) msgs.push('Any bleeding needs immediate attention.')
    if (names.includes('Reduced Fetal Movement')) msgs.push('Decreased fetal movement is serious — contact your provider now.')
    if (names.includes('High Blood Pressure') || (names.includes('Swelling') && names.includes('Headache')))
      msgs.push('These may indicate preeclampsia. Seek care promptly.')
    if (names.includes('Chest Pain') || names.includes('Shortness of Breath'))
      msgs.push('Chest or breathing symptoms need urgent evaluation.')
    if (names.includes('Severe Vomiting') || names.includes('Nausea'))
      msgs.push('Persistent nausea may indicate hyperemesis gravidarum. Stay hydrated.')
    if (names.includes('Fatigue') || names.includes('Insomnia'))
      msgs.push('Rest is important. Try a consistent sleep schedule.')
    if (msgs.length === 0) msgs.push('These appear to be common discomforts. Rest and monitor how you feel.')
    names.forEach(n => { if (DOCTOR_MAP[n]) docs.push(...DOCTOR_MAP[n]) })
    const unique = docs.filter((d, i, a) => a.findIndex(x => x.type === d.type) === i)
    if (unique.length === 0) unique.push({ type: '✅ GP / OB-GYN', reason: 'Regular prenatal check-up recommended' })
    return { text: msgs.join(' '), doctors: unique }
  }

  const handleLog = async () => {
    const names = [...selected]
    if (custom.trim()) names.push(custom.trim())
    if (names.length === 0) { toast({ title: 'Pick at least one symptom 💛', variant: 'destructive' }); return }
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.from('symptoms').insert(
        names.map(n => ({ user_id: user.id, date: new Date().toISOString().split('T')[0], symptom_name: n, intensity: 3, notes: notes || null }))
      )
      if (error) throw error
      setAnalysis(analyze(names))
      toast({ title: 'Logged! 🌸' })
      setOpen(false)
      setSelected(new Set())
      setCustom('')
      setNotes('')
      fetchRecent()
    } catch (err: any) {
      toast({ title: 'Oops!', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-28">
      <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-white/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold">How are you feeling? 🩺</h1>
            <p className="text-xs text-muted-foreground">Tap to log your symptoms</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">

        {/* Log button */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="w-full rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-white py-5 text-lg font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
              <Plus className="w-5 h-5" /> Log how I feel
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-lg">What are you feeling? 💭</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {SYMPTOMS.map(({ name, emoji }) => (
                  <button
                    key={name}
                    onClick={() => toggle(name)}
                    className={`rounded-2xl p-3 text-center transition-all active:scale-95 border-2 ${
                      selected.has(name)
                        ? 'bg-purple-100 border-purple-400 shadow-sm'
                        : 'bg-gray-50 border-transparent'
                    }`}
                  >
                    <div className="text-2xl mb-1">{emoji}</div>
                    <p className="text-xs font-medium leading-tight">{name}</p>
                  </button>
                ))}
              </div>
              <input
                className="w-full rounded-2xl border border-input bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="✏️ Something else? Type it here..."
                value={custom}
                onChange={e => setCustom(e.target.value)}
              />
              <textarea
                className="w-full rounded-2xl border border-input bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
                placeholder="📝 Any extra notes? (optional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <button
                onClick={handleLog}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 font-bold text-base active:scale-95 transition-transform disabled:opacity-60"
              >
                {loading ? 'Saving... 🌸' : 'Log & get insights ✨'}
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Analysis result */}
        {analysis && (
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5 space-y-4">
            <div>
              <p className="font-bold text-foreground mb-2">🔍 What this might mean</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{analysis.text}</p>
            </div>
            <div>
              <p className="font-bold text-foreground mb-3">👩⚕️ Who to see</p>
              <div className="space-y-2">
                {analysis.doctors.map((d, i) => (
                  <div key={i} className="bg-white rounded-2xl p-3 flex items-start gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{d.type}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{d.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent */}
        {recent.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-3 px-1">Recent logs</p>
            <div className="space-y-2">
              {recent.slice(0, 5).map((s, i) => {
                const sym = SYMPTOMS.find(x => x.name === s.symptom_name)
                return (
                  <div key={i} className="rounded-2xl bg-white border border-gray-100 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sym?.emoji || '🩺'}</span>
                      <div>
                        <p className="font-medium text-sm">{s.symptom_name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(n => (
                        <div key={n} className={`w-2 h-2 rounded-full ${n <= s.intensity ? 'bg-purple-400' : 'bg-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Emergency card */}
        <div className="rounded-3xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 p-5">
          <p className="font-bold text-red-600 mb-3">🚨 Go to the ER right away if you have:</p>
          <div className="grid grid-cols-2 gap-2">
            {['Heavy bleeding', 'Severe pain', 'No fetal movement', 'Sudden swelling', 'Fever 38°C+', 'Chest pain'].map(s => (
              <div key={s} className="bg-white/70 rounded-xl px-3 py-2 text-xs font-medium text-red-700">• {s}</div>
            ))}
          </div>
        </div>

      </div>
      <MobileNav active="symptoms" />
    </div>
  )
}
