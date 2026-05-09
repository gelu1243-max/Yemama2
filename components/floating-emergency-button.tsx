'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Siren } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FloatingEmergencyButton() {
  const pathname = usePathname()

  if (pathname === '/emergency') {
    return null
  }

  return (
    <Link href="/emergency" className="fixed bottom-20 right-4 z-[60]">
      <Button className="rounded-full bg-red-600 px-4 text-white hover:bg-red-700">
        <Siren className="mr-2 h-4 w-4" />
        Emergency
      </Button>
    </Link>
  )
}
