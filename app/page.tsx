'use client'

import Link from 'next/link'
import { ShieldCheck, Sparkles, HeartPulse, BrainCircuit, Baby, CalendarClock } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function HomePage() {
  const { t } = useI18n()
  const l = t.landing

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6">
        <header className="glass-card mb-8 flex items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{t.app_name}</p>
            <h1 className="text-lg font-semibold text-foreground">{t.tagline}</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <Link href="/auth/login" className="soft-pill">{l.login}</Link>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="soft-pill mb-4 inline-flex">{l.hero_badge}</p>
            <h2 className="text-balance text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              {l.hero_title}
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              {l.hero_desc}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/signup" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                {l.start_tracking}
              </Link>
              <Link href="/auth/signup?mode=pregnancy" className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-white/70 px-6 text-sm font-semibold text-foreground transition hover:bg-white">
                {l.pregnancy_mode}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -left-6 top-4 h-24 w-24 rounded-full bg-cyan-200/45 blur-xl" />
            <div className="absolute -right-4 bottom-10 h-24 w-24 rounded-full bg-pink-200/60 blur-xl" />
            <div className="glass-card rounded-[2.2rem] p-3">
              <div className="rounded-[1.7rem] bg-gradient-to-br from-cyan-100 via-emerald-50 to-pink-100 p-4">
                <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>9:41</span><span>Week 20</span>
                </div>
                <div className="glass-card p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">{l.today_insights}</p>
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-primary">{l.live}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{l.insights_text}</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="glass-card p-3">
                    <p className="text-muted-foreground">{l.cycle_day}</p>
                    <p className="text-lg font-semibold">14</p>
                  </div>
                  <div className="glass-card p-3">
                    <p className="text-muted-foreground">{l.baby_size}</p>
                    <p className="text-lg font-semibold">🥭</p>
                  </div>
                </div>
                <button className="mt-4 h-11 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {l.continue}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {([
            [l.features.cycle, CalendarClock],
            [l.features.pregnancy, Baby],
            [l.features.ai, BrainCircuit],
            [l.features.privacy, ShieldCheck],
          ] as const).map(([label, Icon]) => (
            <article key={label} className="glass-card p-5">
              <Icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{label}</h3>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-3">
          {([
            ['1', l.steps['1_title'], l.steps['1_text']],
            ['2', l.steps['2_title'], l.steps['2_text']],
            ['3', l.steps['3_title'], l.steps['3_text']],
          ] as const).map(([step, title, text]) => (
            <article key={step} className="glass-card p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{l.step} {step}</p>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          {l.quotes.map((quote) => (
            <blockquote key={quote} className="glass-card p-5 text-sm text-foreground">
              <Sparkles className="mb-3 h-4 w-4 text-primary" />
              {quote}
            </blockquote>
          ))}
        </section>

        <section className="glass-card mt-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">{l.safety_title}</h3>
            <p className="text-sm text-muted-foreground">{l.safety_desc}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <HeartPulse className="h-4 w-4" />
            {l.safety_badge}
          </div>
        </section>
      </div>

      <footer className="border-t border-white/50 bg-white/60 px-4 py-6 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {t.app_name}</p>
          <div className="flex items-center gap-4">
            <Link href="/profile">{l.footer_about}</Link>
            <Link href="/profile">{l.footer_privacy}</Link>
            <Link href="/profile">{l.footer_contact}</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
