'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { CalendarDays, Home, Stethoscope, UserRound } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

type NavKey = 'dashboard' | 'calendar' | 'profile' | 'doctor'

interface MobileNavProps {
  active: NavKey
}

function NavItem({ href, active, icon, label }: { href: string; active: boolean; icon: ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 min-w-[48px]">
      <div className={['rounded-full p-2.5 transition-colors', active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'].join(' ')}>
        {icon}
      </div>
      <span className={['text-[11px] font-medium leading-tight text-center', active ? 'text-foreground' : 'text-muted-foreground'].join(' ')}>{label}</span>
    </Link>
  )
}

export function MobileNav({ active }: MobileNavProps) {
  const { t } = useI18n()
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/50 bg-white/80 backdrop-blur-md safe-area-bottom">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-around px-2 py-2">
        <NavItem href="/dashboard" active={active === 'dashboard'} icon={<Home className="h-5 w-5" />} label={t.nav.home} />
        <NavItem href="/calendar" active={active === 'calendar'} icon={<CalendarDays className="h-5 w-5" />} label={t.nav.calendar} />
        <NavItem href="/doctor" active={active === 'doctor'} icon={<Stethoscope className="h-5 w-5" />} label={t.nav.doctor} />
        <NavItem href="/profile" active={active === 'profile'} icon={<UserRound className="h-5 w-5" />} label={t.nav.profile} />
      </nav>
    </div>
  )
}
