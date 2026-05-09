'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function GlobalBackButton() {
  const router = useRouter()

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="fixed left-3 top-3 z-[60] h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur"
      onClick={() => router.back()}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  )
}
