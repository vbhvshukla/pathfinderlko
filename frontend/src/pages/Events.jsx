import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Clock, Users, ArrowRight, Check, X, Phone, FileText } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Loader from '@/components/ui/loader'
import { selectCurrentUser } from '@/store/authSlice'
import { apiFetch } from '@/lib/api'
import { toast } from 'sonner'

export default function Events() {
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()

  const [filter, setFilter] = useState('upcoming')
  const [events, setEvents] = useState([])
  const [registeredEvents, setRegisteredEvents] = useState({})
  
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingRSVPs, setLoadingRSVPs] = useState(false)

  // Registration Modal States
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch events from backend database on mount
  useEffect(() => {
    async function fetchEvents() {
      setLoadingEvents(true)
      try {
        const data = await apiFetch('/events')
        if (data && data.events) {
          setEvents(data.events)
        }
      } catch (err) {
        console.error('Failed to load events:', err)
        toast.error('Failed to load events.')
      } finally {
        setLoadingEvents(false)
      }
    }
    fetchEvents()
  }, [])

  // Fetch user's registered events on mount (or when user auth changes)
  useEffect(() => {
    async function fetchMyRSVPs() {
      if (!user) {
        setRegisteredEvents({})
        return
      }
      setLoadingRSVPs(true)
      try {
        const data = await apiFetch('/rsvp/my-rsvps')
        if (data && data.rsvps) {
          const mapped = {}
          data.rsvps.forEach((rsvp) => {
            mapped[String(rsvp.eventId)] = true
          })
          setRegisteredEvents(mapped)
        }
      } catch (err) {
        console.error('Failed to load registered events:', err)
      } finally {
        setLoadingRSVPs(false)
      }
    }
    fetchMyRSVPs()
  }, [user])

  const handleRSVPClick = (event) => {
    if (!user) {
      toast.warning('Please log in to RSVP for events.')
      navigate('/auth?redirect=/events')
      return
    }
    setSelectedEvent(event)
    setPhone('')
    setNotes('')
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault()
    if (!phone.trim()) {
      toast.error('Phone number is required.')
      return
    }

    setSubmitting(true)
    try {
      await apiFetch('/rsvp', {
        method: 'POST',
        data: {
          eventId: String(selectedEvent._id),
          phone: phone.trim(),
          notes: notes.trim(),
        },
      })
      toast.success(`Successfully registered for: ${selectedEvent.title}`)
      setRegisteredEvents((prev) => ({ ...prev, [String(selectedEvent._id)]: true }))
      setSelectedEvent(null)
    } catch (err) {
      toast.error(err.message || 'Failed to submit RSVP registration.')
    } finally {
      setSubmitting(false)
    }
  }

  const items = events.filter((e) => e.type === filter)
  const loading = loadingEvents || loadingRSVPs

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-300">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
          Events & Workshops
        </h1>
        <p className="text-muted-foreground">
          Discover our upcoming seminars, community outreach events, and career mentorship bootcamps in Lucknow.
        </p>
      </div>

      <div className="flex justify-center border-b pb-4">
        <div className="flex gap-2 bg-muted p-1 rounded-xl">
          <button
            onClick={() => setFilter('upcoming')}
            className={`text-sm font-semibold px-6 py-2 rounded-lg transition-all ${
              filter === 'upcoming' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`text-sm font-semibold px-6 py-2 rounded-lg transition-all ${
              filter === 'past' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Past Highlights
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="text-center py-16 border border-dashed rounded-2xl bg-card">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-foreground text-lg">No Events Found</p>
              <p className="text-muted-foreground text-sm">There are no events loaded under this category currently.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((event) => (
                <Card 
                  key={event._id} 
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="cursor-pointer hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >

                  <CardHeader className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                        {event.category}
                      </Badge>
                      {event.type === 'upcoming' && (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          Booking Open
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold leading-snug">{event.title}</CardTitle>
                    <CardDescription className="text-sm font-medium">{event.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed text-justify">{event.description}</p>
                    
                    <div className="space-y-2 border-t pt-3 text-xs text-muted-foreground">
                      {event.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      {event.limit && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{event.limit}</span>
                        </div>
                      )}
                      {event.impact && (
                        <div className="flex items-center gap-2 font-semibold text-foreground bg-muted/40 p-2 rounded-lg border border-dashed">
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span>Impact: {event.impact}</span>
                        </div>
                      )}
                    </div>


                  </CardContent>
                  
                  <CardFooter className="pt-3 border-t">
                    {event.type === 'upcoming' ? (
                      registeredEvents[String(event._id)] ? (
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2" disabled>
                          <Check className="w-4.5 h-4.5" /> Registered
                        </Button>
                      ) : (
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRSVPClick(event)
                          }} 
                          className="w-full gap-2"
                        >
                          RSVP / Register <ArrowRight className="w-4 h-4" />
                        </Button>
                      )
                    ) : (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/events/${event._id}`)
                        }} 
                        variant="outline" 
                        className="w-full gap-2 hover:bg-primary/5 text-xs h-9"
                      >
                        View Gallery & Highlights <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* RSVP Registration Modal */}
      {selectedEvent && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-card rounded-2xl border shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Event Registration</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedEvent(null)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="mb-4 bg-muted/40 p-3 rounded-lg border border-dashed text-xs text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground">{selectedEvent.title}</div>
              <div>Date: {selectedEvent.date}</div>
              <div>Location: {selectedEvent.location}</div>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name" className="text-xs">Your Name (Pre-filled)</Label>
                <Input
                  id="reg-name"
                  value={user.name}
                  disabled
                  className="bg-muted/30 cursor-not-allowed text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-xs">Your Email (Pre-filled)</Label>
                <Input
                  id="reg-email"
                  value={user.email}
                  disabled
                  className="bg-muted/30 cursor-not-allowed text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone" className="text-xs flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-primary" /> Contact Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  required
                  className="text-sm focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-notes" className="text-xs flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-primary" /> Any questions or notes for mentors?
                </Label>
                <Textarea
                  id="reg-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ask anything or state reasons for joining (optional)..."
                  className="text-sm focus-visible:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting}>
                  {submitting ? 'Registering...' : 'Confirm RSVP'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
