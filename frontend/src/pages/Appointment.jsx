import React, { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

const SERVICES = [
  { id: 'depression', label: 'Depression, anxiety and phobias', price: 500 },
  { id: 'stress', label: 'Stress management', price: 500 },
  { id: 'career', label: 'Career management /Counselling', price: 500 },
  { id: 'relationship', label: 'Relationship and family issues', price: 500 },
  { id: 'child', label: 'Child/Teenager counselling', price: 500 },
  { id: 'addictions', label: 'Mental and emotional addictions', price: 500 },
]

export default function Appointment() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    city: '',
    address: '',
    phone: '',
    service: SERVICES[0].id,
    sessions: 1,
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function computeCharges() {
    const svc = SERVICES.find(s => s.id === form.service)
    const price = svc ? svc.price : 0
    const sessions = Number(form.sessions) || 1
    return price * sessions
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)

    if (!form.name || !form.email || !form.phone) {
      setStatus({ type: 'error', message: 'Please fill name, email and phone.' })
      return
    }

    try {
      setLoading(true)
      const payload = { ...form, charges: computeCharges() }
      const data = await apiFetch('/appointments', { method: 'POST', data: payload })
      setStatus({ type: 'success', message: data.message || 'Appointment booked successfully.' })
      setForm({ name: '', email: '', age: '', city: '', address: '', phone: '', service: SERVICES[0].id, sessions: 1 })
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to book appointment.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Book Your First Session</CardTitle>
          <CardDescription>Please enter your details and choose a service below.</CardDescription>
        </CardHeader>

        <CardContent>
          {status && (
            <div className={`mb-4 p-3 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Enter your Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Enter your E-mail</Label>
                <Input id="email" name="email" value={form.email} onChange={handleChange} type="email" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" value={form.age} onChange={handleChange} type="number" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">Enter your City</Label>
                <Input id="city" name="city" value={form.city} onChange={handleChange} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Enter your Address</Label>
              <Input id="address" name="address" value={form.address} onChange={handleChange} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number - +91</Label>
              <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="service">Select Service</Label>
              <select name="service" id="service" value={form.service} onChange={handleChange} className="input">
                {SERVICES.map(s => (
                  <option key={s.id} value={s.id}>{s.label} : ₹{s.price}/Session</option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sessions">Number of Sessions</Label>
                <Input id="sessions" name="sessions" value={form.sessions} onChange={handleChange} type="number" min={1} />
              </div>

              <div className="grid gap-2">
                <Label>Charges (INR)</Label>
                <div className="py-2 px-3 border rounded">₹{computeCharges()}</div>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Booking...' : 'Book Appointment'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
