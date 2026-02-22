import React, { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', contactNumber: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', message: 'Name, email and message are required.' })
      return
    }

    try {
      setLoading(true)
      const data = await apiFetch('/contact', { method: 'POST', data: form })
      setStatus({ type: 'success', message: data.message || 'Message sent successfully.' })
      setForm({ name: '', email: '', subject: '', message: '', contactNumber: '' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to send message.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-6 py-12 text-left">
      <div className="max-w-md mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>Send us a message and we'll get back to you shortly.</CardDescription>
            <CardAction>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="link">Help</Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Please fill the form</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardAction>
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
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" type="email" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" value={form.message} onChange={handleChange} rows={6} placeholder="Your message" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactNumber">Contact Number (optional)</Label>
                <Input id="contactNumber" name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Phone" />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" onClick={handleSubmit} className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
