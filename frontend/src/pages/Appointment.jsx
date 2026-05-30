import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
import { selectCurrentUser } from '@/store/authSlice'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Loader from '@/components/ui/loader'

const DEFAULT_SERVICES = [
  { _id: 'depression', title: 'Depression, anxiety and phobias', price: 500 },
  { _id: 'stress', title: 'Stress management', price: 500 },
  { _id: 'career', title: 'Career management /Counselling', price: 500 },
  { _id: 'relationship', title: 'Relationship and family issues', price: 500 },
  { _id: 'child', title: 'Child/Teenager counselling', price: 500 },
  { _id: 'addictions', title: 'Mental and emotional addictions', price: 500 },
]

const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
]

export default function Appointment() {
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()

  const [services, setServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    city: '',
    address: '',
    phone: '',
    service: '',
    sessions: 1,
    date: '',
    timeSlot: TIME_SLOTS[0],
    notes: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  // Fetch active services from DB
  useEffect(() => {
    async function getServices() {
      try {
        const res = await apiFetch('/services')
        if (res && res.services && res.services.length > 0) {
          setServices(res.services)
          setForm(prev => ({ ...prev, service: res.services[0]._id }))
        } else {
          setServices(DEFAULT_SERVICES)
          setForm(prev => ({ ...prev, service: DEFAULT_SERVICES[0]._id }))
        }
      } catch (err) {
        console.error('Failed to load services, falling back to defaults', err)
        setServices(DEFAULT_SERVICES)
        setForm(prev => ({ ...prev, service: DEFAULT_SERVICES[0]._id }))
      } finally {
        setServicesLoading(false)
      }
    }
    getServices()
  }, [])

  // Prefill logged-in user info
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }))
    }
  }, [user])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function getSelectedService() {
    return services.find(s => s._id === form.service)
  }

  function computeCharges() {
    const svc = getSelectedService()
    const price = svc ? svc.price : 500
    const sessions = Number(form.sessions) || 1
    return price * sessions
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)

    if (!form.name || !form.email || !form.phone || !form.service || !form.date) {
      setStatus({ type: 'error', message: 'Please fill out name, email, phone, service and date.' })
      return
    }

    try {
      setLoading(true)
      const selectedSvc = getSelectedService()
      const payload = {
        ...form,
        serviceId: selectedSvc?._id,
        serviceName: selectedSvc?.title || selectedSvc?.name,
        charges: computeCharges(),
      }
      const data = await apiFetch('/appointments', { method: 'POST', data: payload })
      
      // Navigate to success page
      navigate('/appointments/success', { state: { appointment: data.appointment } })
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to book appointment.' })
    } finally {
      setLoading(false)
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size={40} className="text-primary animate-spin" />
      </div>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in duration-300">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="text-center pb-4 border-b bg-muted/20">
          <CardTitle className="text-2xl font-bold">Book a Counseling Session</CardTitle>
          <CardDescription>
            Share your details and schedule your appointment with Pathfinder's expert mentors.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {status && (
            <div className={`mb-6 p-4 rounded-xl border text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-destructive/5 border-destructive/20 text-destructive'}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Anjali Sharma" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail Address</Label>
                <Input id="email" name="email" value={form.email} onChange={handleChange} type="email" placeholder="e.g. name@example.com" required />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" value={form.age} onChange={handleChange} type="number" placeholder="e.g. 24" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={form.city} onChange={handleChange} placeholder="e.g. Lucknow" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (+91)</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Residential Address</Label>
              <Input id="address" name="address" value={form.address} onChange={handleChange} placeholder="e.g. 12/A, Gomti Nagar" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service">Select Service Package</Label>
                <select
                  name="service"
                  id="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {services.map(s => (
                    <option key={s._id} value={s._id} className="bg-card text-foreground">
                      {s.title || s.name} (₹{s.price}/session)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessions">Number of Sessions</Label>
                <Input id="sessions" name="sessions" value={form.sessions} onChange={handleChange} type="number" min={1} required />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Appointment Date</Label>
                <Input
                  id="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  type="date"
                  min={todayStr}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot">Preferred Time Slot</Label>
                <select
                  name="timeSlot"
                  id="timeSlot"
                  value={form.timeSlot}
                  onChange={handleChange}
                  className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot} className="bg-card text-foreground">
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes / Concerns</Label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Let us know briefly what issues you wish to discuss..."
                rows={3}
                className="w-full flex min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-dashed text-sm">
              <span className="font-semibold text-muted-foreground">Estimated Charges:</span>
              <span className="font-bold text-lg text-primary">₹{computeCharges()}.00</span>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full h-10 text-sm font-semibold" disabled={loading}>
                {loading ? 'Booking...' : 'Confirm and Book Session'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
