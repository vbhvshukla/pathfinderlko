import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useDispatch } from 'react-redux'
import { login, register } from '@/store/authSlice'

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)

    if (mode === 'register') {
      if (!form.name || !form.email || !form.password) {
        setStatus({ type: 'error', message: 'Name, email and password are required.' })
        return
      }
      if (form.password !== form.confirmPassword) {
        setStatus({ type: 'error', message: 'Passwords do not match.' })
        return
      }
    } else {
      if (!form.email || !form.password) {
        setStatus({ type: 'error', message: 'Email and password are required.' })
        return
      }
    }

    try {
      setLoading(true)
      const payload = mode === 'register' ? { name: form.name, email: form.email, password: form.password } : { email: form.email, password: form.password }
      let user = null
      if (mode === 'register') {
        user = await dispatch(register(payload)).unwrap()
        setStatus({ type: 'success', message: 'Registered successfully' })
      } else {
        user = await dispatch(login(payload)).unwrap()
        setStatus({ type: 'success', message: 'Logged in' })
      }
      setForm(prev => ({ ...prev, password: '', confirmPassword: '' }))
      if (user?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed' })
    } finally {
      setLoading(false)
    }
  }


  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'login' ? 'Sign in' : 'Create account'}</CardTitle>
          <CardDescription>
            {mode === 'login' ? 'Please enter the following details to sign in.' : 'Please fill in the form.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {status && (
            <div className={`mb-4 p-3 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            {mode === 'register' && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={form.email} onChange={handleChange} type="email" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" value={form.password} onChange={handleChange} type="password" />
            </div>

            {mode === 'register' && (
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" />
              </div>
            )}

            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
              </Button>

              <div className="text-center text-sm text-muted">
                {mode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button type="button" className="text-primary underline" onClick={() => setMode('register')}>Create one</button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button type="button" className="text-primary underline" onClick={() => setMode('login')}>Sign in</button>
                  </>
                )}
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
