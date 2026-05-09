'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const { t } = useI18n()
  const a = t.auth

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || t.errors.sign_in_failed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            {t.app_name}
          </h1>
          <p className="text-muted-foreground text-lg">{a.login_title}</p>
        </div>

        <Card className="p-6 shadow-lg border-0">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{a.email}</label>
              <Input type="email" placeholder={a.email_placeholder} value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-12" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{a.password}</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full h-12" />
            </div>
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold rounded-full transition-all" disabled={loading}>
              {loading ? a.signing_in : a.sign_in}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {a.no_account}{' '}
            <Link href="/auth/signup" className="text-primary font-semibold hover:underline">{a.sign_up}</Link>
          </div>
        </Card>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>{a.tagline}</p>
        </div>
      </div>
    </div>
  )
}
