'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { MobileNav } from '@/components/mobile-nav'

const DOCTORS = [
  {
    emoji: '👩⚕️',
    type: 'OB-GYN',
    tagline: 'Your main pregnancy doctor',
    when: 'Regular prenatal visits, any pregnancy concern',
    urgency: 'routine',
    tips: ['First visit at 8–10 weeks', 'Every 4 weeks until week 28', 'Weekly from week 36'],
  },
  {
    emoji: '🌸',
    type: 'Midwife',
    tagline: 'For natural, low-risk births',
    when: 'Low-risk pregnancy, natural birth preference',
    urgency: 'routine',
    tips: ['Great for low-risk pregnancies', 'Continuous labor support', 'Holistic care approach'],
  },
  {
    emoji: '🔬',
    type: 'MFM Specialist',
    tagline: 'High-risk pregnancy expert',
    when: 'Twins, gestational diabetes, preeclampsia',
    urgency: 'specialist',
    tips: ['Referred by your OB-GYN', 'Advanced ultrasound', 'Complex condition management'],
  },
  {
    emoji: '❤️',
    type: 'Cardiologist',
    tagline: 'Heart & blood pressure care',
    when: 'Chest pain, high BP, heart palpitations',
    urgency: 'urgent',
    tips: ['Seek care promptly for chest pain', 'Pregnancy increases heart workload', 'Monitor BP regularly'],
  },
  {
    emoji: '🩺',
    type: 'Endocrinologist',
    tagline: 'Diabetes & thyroid specialist',
    when: 'Gestational diabetes, thyroid issues',
    urgency: 'specialist',
    tips: ['Affects 2–10% of pregnancies', 'Diet & medication management', 'Regular glucose monitoring'],
  },
  {
    emoji: '🧠',
    type: 'Mental Health',
    tagline: 'Emotional wellbeing support',
    when: 'Anxiety, depression, mood swings',
    urgency: 'routine',
    tips: ['Perinatal mood disorders are common', 'Therapy & support groups help', 'Never hesitate to ask for help'],
  },
  {
    emoji: '🥗',
    type: 'Nutritionist',
    tagline: 'Prenatal nutrition guide',
    when: 'Diet concerns, gestational diabetes diet',
    urgency: 'routine',
    tips: ['Folate, iron, calcium are key', 'Avoid raw fish & unpasteurized foods', '8–10 glasses of water daily'],
  },
  {
    emoji: '🚨',
    type: 'Emergency / L&D',
    tagline: 'Go NOW — don\'t wait',
    when: 'Heavy bleeding, severe pain, no fetal movement',
    urgency: 'emergency',
    tips: ['Don\'t wait — go to the ER', 'Call your OB-GYN on the way', 'Bring your prenatal records'],
  },
]

const urgencyStyle: Record<string, { pill: string; card: string }> = {
  routine: { pill: 'bg-green-100 text-green-700', card: 'border-green-100' },
  specialist: { pill: 'bg-blue-100 text-blue-700', card: 'border-blue-100' },
  urgent: { pill: 'bg-orange-100 text-orange-700', card: 'border-orange-100' },
  emergency: { pill: 'bg-red-100 text-red-700', card: 'border-red-200' },
}

const urgencyLabel: Record<string, string> = {
  routine: 'Routine',
  specialist: 'Specialist',
  urgent: '⚠️ Urgent',
  emergency: '🚨 Emergency',
}

export default function DoctorsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen pb-28">
      <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-white/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold">Your Care Team 👩⚕️</h1>
            <p className="text-xs text-muted-foreground">Know who to call & when</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* Intro */}
        <div className="rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 p-5">
          <p className="text-2xl mb-2">💜</p>
          <p className="font-bold text-foreground">You deserve great care</p>
          <p className="text-sm text-muted-foreground mt-1">Here's a friendly guide to the doctors who can support you through your journey.</p>
        </div>

        {/* Doctor cards */}
        {DOCTORS.map((doc, i) => {
          const style = urgencyStyle[doc.urgency]
          return (
            <div key={i} className={`rounded-3xl bg-white border-2 ${style.card} p-5`}>
              <div className="flex items-start gap-4">
                <div className="text-4xl">{doc.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold text-foreground">{doc.type}</p>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${style.pill}`}>
                      {urgencyLabel[doc.urgency]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{doc.tagline}</p>

                  <div className="bg-gray-50 rounded-2xl p-3 mb-3">
                    <p className="text-xs font-semibold text-foreground mb-1">📍 See them when:</p>
                    <p className="text-xs text-muted-foreground">{doc.when}</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {doc.tips.map((tip, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="text-primary text-xs mt-0.5">✓</span>
                        <p className="text-xs text-muted-foreground">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Emergency banner */}
        <div className="rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 p-5 text-white">
          <p className="font-bold text-lg mb-3">🚨 Go to the ER immediately if:</p>
          <div className="grid grid-cols-2 gap-2">
            {['Heavy bleeding', 'Severe abdominal pain', 'No fetal movement', 'Sudden severe headache', 'Difficulty breathing', 'Fever over 38°C'].map(s => (
              <div key={s} className="bg-white/20 rounded-xl px-3 py-2 text-xs font-medium">• {s}</div>
            ))}
          </div>
        </div>

      </div>
      <MobileNav active="doctors" />
    </div>
  )
}
