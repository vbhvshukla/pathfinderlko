import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { apiFetch } from '@/lib/api'
import SEO from '@/components/SEO'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your email address.' })
      return
    }
    setStatus(null)
    try {
      setLoading(true)
      const res = await apiFetch('/auth/forgot-password', { method: 'POST', data: { email } })
      setStatus({ type: 'success', message: res.message || 'If an account exists for that email, a reset link has been sent.' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <SEO title="Forgot Password" noIndex />
      <Card>
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>Enter your email and we'll send you a link to reset it.</CardDescription>
        </CardHeader>
        <CardContent>
          {status && (
            <div className={`mb-4 p-3 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {status.message}
            </div>
          )}

          {!(status?.type === 'success') && (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>
          )}

          <div className="text-center text-sm text-muted mt-4">
            <Link to="/auth" className="text-primary underline">Back to sign in</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
