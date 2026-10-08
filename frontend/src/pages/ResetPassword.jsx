import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { apiFetch } from '@/lib/api'
import SEO from '@/components/SEO'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)

    if (!password || password.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters.' })
      return
    }
    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    try {
      setLoading(true)
      const res = await apiFetch('/auth/reset-password', { method: 'POST', data: { token, password } })
      setStatus({ type: 'success', message: res.message || 'Password updated successfully.' })
      setTimeout(() => navigate('/auth'), 2000)
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'This reset link is invalid or has expired.' })
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <main className="max-w-md mx-auto px-4 py-12">
        <SEO title="Reset Password" noIndex />
        <Card>
          <CardHeader>
            <CardTitle>Invalid link</CardTitle>
            <CardDescription>This password reset link is missing its token. Please request a new one.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/forgot-password" className="text-primary underline text-sm">Request a new reset link</Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <SEO title="Reset Password" noIndex />
      <Card>
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
          <CardDescription>Choose a new password for your account.</CardDescription>
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
                <Label htmlFor="password">New password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
