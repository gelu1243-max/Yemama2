'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { CalendarDays, Home, UserRound } from 'lucide-react'

type NavKey = 'dashboard' | 'calendar' | 'profile'

interface MobileNavProps {
  active: NavKey
}

function NavItem({ href, active, icon, label }: { href: string; active: boolean; icon: ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1">
      <div
        className={[
          'rounded-full p-2 transition-colors',
          active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground',
        ].join(' ')}
      >
        {icon}
      </div>
      <span className={['text-[11px] font-medium', active ? 'text-foreground' : 'text-muted-foreground'].join(' ')}>{label}</span>
    </Link>
  )
}

export function MobileNav({ active }: MobileNavProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/50 bg-white/75 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-around px-4 py-2">
        <NavItem href="/dashboard" active={active === 'dashboard'} icon={<Home className="h-5 w-5" />} label="Home" />
        <NavItem href="/calendar" active={active === 'calendar'} icon={<CalendarDays className="h-5 w-5" />} label="Calendar" />
        <NavItem href="/profile" active={active === 'profile'} icon={<UserRound className="h-5 w-5" />} label="Profile" />
      </nav>
    </div>
  )
}
