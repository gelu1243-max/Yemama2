import Link from 'next/link'
import { ShieldCheck, Sparkles, HeartPulse, BrainCircuit, Baby, CalendarClock } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6">
        <header className="glass-card mb-8 flex items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">yemama</p>
            <h1 className="text-lg font-semibold text-foreground">Women&apos;s Health Companion</h1>
          </div>
          <Link href="/auth/login" className="soft-pill">
            Login
          </Link>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="soft-pill mb-4 inline-flex">Personalized for cycle and pregnancy</p>
            <h2 className="text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Understand Your Body. Every Day.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              Track your cycle, predict your future, and support your journey through every phase.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Start Tracking
              </Link>
              <Link
                href="/auth/signup?mode=pregnancy"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white/70 px-6 text-sm font-semibold text-foreground transition hover:bg-white"
              >
                Switch to Pregnancy Mode
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-6 top-4 h-24 w-24 rounded-full bg-cyan-200/45 blur-xl" />
            <div className="absolute -right-4 bottom-10 h-24 w-24 rounded-full bg-pink-200/60 blur-xl" />
            <div className="glass-card rounded-[2.2rem] p-3">
              <div className="rounded-[1.7rem] bg-gradient-to-br from-cyan-100 via-emerald-50 to-pink-100 p-4">
                <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>9:41</span>
                  <span>Week 20</span>
                </div>
                <div className="glass-card p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">Today&apos;s Insights</p>
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-primary">Live</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Hydration on track. Mood stable. Great sleep trend this week.</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="glass-card p-3">
                    <p className="text-muted-foreground">Cycle Day</p>
                    <p className="text-lg font-semibold">Day 14</p>
                  </div>
                  <div className="glass-card p-3">
                    <p className="text-muted-foreground">Baby Size</p>
                    <p className="text-lg font-semibold">Mango</p>
                  </div>
                </div>
                <button className="mt-4 h-10 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Smart Cycle Predictions', CalendarClock],
            ['Pregnancy Week Tracking', Baby],
            ['AI Health Assistant', BrainCircuit],
            ['Privacy-First Design', ShieldCheck],
          ].map(([label, Icon]) => (
            <article key={label as string} className="glass-card p-5">
              <Icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{label as string}</h3>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            ['1', 'Log your data', 'Daily notes, symptoms, mood, and health markers in one place.'],
            ['2', 'Get predictions', 'Accurate cycle windows and week-by-week pregnancy updates.'],
            ['3', 'Understand your body', 'Clear insights you can use in your day-to-day decisions.'],
          ].map(([step, title, text]) => (
            <article key={step as string} className="glass-card p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Step {step as string}</p>
              <h3 className="text-lg font-semibold text-foreground">{title as string}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text as string}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            '“I finally understand my cycle patterns. The reminders are gentle and accurate.”',
            '“Pregnancy mode feels made for me, from baby growth to daily guidance.”',
            '“Clean, calming, and private. It feels like a wellness app, not a medical form.”',
          ].map((quote) => (
            <blockquote key={quote} className="glass-card p-5 text-sm text-foreground">
              <Sparkles className="mb-3 h-4 w-4 text-primary" />
              {quote}
            </blockquote>
          ))}
        </section>

        <section className="glass-card mt-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Built with safety at the center</h3>
            <p className="text-sm text-muted-foreground">Encrypted storage, private profiles, and secure authentication by design.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <HeartPulse className="h-4 w-4" />
            Privacy + Encryption + Safety
          </div>
        </section>
      </div>

      <footer className="border-t border-white/50 bg-white/60 px-4 py-6 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} yemama</p>
          <div className="flex items-center gap-4">
            <Link href="/profile">About</Link>
            <Link href="/profile">Privacy</Link>
            <Link href="/profile">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
