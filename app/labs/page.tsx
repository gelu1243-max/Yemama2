'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function LabsPage() {
  const supabase = createClient()
  const [fileUrl, setFileUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const saveResult = async () => {
    setMessage('')
    setError('')
    if (!fileUrl) {
      setError('Please provide a PDF/image URL for the result.')
      return
    }
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Please login first.')
      const { error: insertError } = await supabase.from('medical_results').insert({
        user_id: user.id,
        file_url: fileUrl,
        file_type: fileUrl.toLowerCase().includes('.pdf') ? 'pdf' : 'image',
        notes,
      })
      if (insertError) throw insertError
      setMessage('Result uploaded and ready to share with doctors.')
      setFileUrl('')
      setNotes('')
    } catch (err: any) {
      setError(err?.message || 'Unable to upload result.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl space-y-4 px-4 py-6">
      <Card className="p-4">
        <h1 className="text-xl font-semibold">Labs & Result Sharing</h1>
        <p className="text-sm text-muted-foreground">Find nearby labs and upload/share test results with your doctor.</p>
      </Card>
      <Card className="p-4">
        <p className="mb-2 text-sm font-medium">Nearby clinics/labs</p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>Black Lion Hospital Lab (Addis Ababa)</li>
          <li>Ras Desta Damtew Memorial Lab</li>
          <li>St. Paul Hospital Diagnostic Unit</li>
        </ul>
      </Card>
      <Card className="space-y-3 p-4">
        <Input placeholder="Result file URL (.pdf/.jpg/.png)" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
        <Textarea placeholder="Add notes for your doctor" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button onClick={saveResult} disabled={loading}>{loading ? 'Uploading...' : 'Upload and share'}</Button>
        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </Card>
    </div>
  )
}
