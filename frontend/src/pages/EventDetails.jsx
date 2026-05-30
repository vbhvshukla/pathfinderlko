import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/store/authSlice'
import { apiFetch } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Loader from '@/components/ui/loader'
import { toast } from 'sonner'
import { 
  Calendar, MapPin, Clock, Users, ArrowLeft, Check, X, Phone, FileText, 
  ChevronLeft, ChevronRight, Download, Maximize2 
} from 'lucide-react'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)

  const [event, setEvent] = useState(null)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [registered, setRegistered] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // RSVP Form Modal States
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  // Lightbox States
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    loadEventDetails()
  }, [id])

  async function loadEventDetails() {
    setLoadingEvent(true)
    try {
      const data = await apiFetch(`/events/${id}`)
      if (data && data.event) {
        setEvent(data.event)
        
        // Check RSVP status if authenticated
        if (user) {
          const rsvpsData = await apiFetch('/rsvp/my-rsvps')
          if (rsvpsData && rsvpsData.rsvps) {
            const hasRsvp = rsvpsData.rsvps.some(r => String(r.eventId) === String(id))
            setRegistered(hasRsvp)
          }
        }
      } else {
        toast.error('Event not found.')
        navigate('/events')
      }
    } catch (err) {
      console.error('Failed to load event details:', err)
      toast.error('Failed to retrieve event details.')
      navigate('/events')
    } finally {
      setLoadingEvent(false)
    }
  }

  const handleRSVPClick = () => {
    if (!user) {
      toast.warning('Please log in to register for this event.')
      navigate(`/auth?redirect=/events/${id}`)
      return
    }
    setPhone('')
    setNotes('')
    setRsvpModalOpen(true)
  }

  const handleRSVPSubmit = async (e) => {
    e.preventDefault()
    if (!phone.trim()) {
      toast.error('Contact phone number is required.')
      return
    }

    setSubmitting(true)
    try {
      await apiFetch('/rsvp', {
        method: 'POST',
        data: {
          eventId: String(id),
          phone: phone.trim(),
          notes: notes.trim(),
        }
      })
      toast.success(`Successfully registered for: ${event.title}!`)
      setRegistered(true)
      setRsvpModalOpen(false)
    } catch (err) {
      toast.error(err.message || 'Failed to submit RSVP registration.')
    } finally {
      setSubmitting(false)
    }
  }

  // Lightbox Navigation
  const handlePrevImage = (e) => {
    e.stopPropagation()
    if (!event?.gallery) return
    setLightboxIndex((prev) => (prev === 0 ? event.gallery.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    if (!event?.gallery) return
    setLightboxIndex((prev) => (prev === event.gallery.length - 1 ? 0 : prev + 1))
  }

  if (loadingEvent) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader />
        <span className="text-sm text-muted-foreground">Loading event details...</span>
      </div>
    )
  }

  if (!event) return null

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 text-left relative">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Button 
          onClick={() => navigate('/events')} 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Button>
      </div>

      {/* Header Banner Section */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="relative w-full h-[30vh] md:h-[45vh] overflow-hidden bg-muted flex items-end rounded-2xl md:rounded-3xl border border-border shadow-sm">
          {event.coverImage ? (
            <img src={event.coverImage} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-indigo-600/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/35" />

          <div className="w-full px-6 md:px-8 pb-6 md:pb-8 z-10 relative space-y-3">
            <Badge className="bg-primary/20 backdrop-blur-md text-white border-white/20 text-xs px-3 py-1 font-semibold uppercase">
              {event.category}
            </Badge>
            <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight max-w-3xl text-left drop-shadow-sm leading-tight">
              {event.title}
            </h1>
            <p className="text-sm md:text-base font-semibold text-muted-foreground flex items-center gap-1.5 drop-shadow-sm">
              <Calendar className="w-4.5 h-4.5 text-primary shrink-0" /> {event.date}
            </p>
          </div>
        </section>
      </div>

      {/* Main Grid Section */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column - Description and Photo Highlights */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <Card className="bg-card">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-bold text-foreground pb-2 border-b">About The Event</h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-justify whitespace-pre-line">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Event Photo Highlights Gallery */}
            {event.gallery && event.gallery.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-1.5">
                    📸 Photo Highlights
                  </h3>
                  <Badge variant="outline" className="text-xs text-muted-foreground font-medium">
                    {event.gallery.length} Images
                  </Badge>
                </div>

                {/* 3-Column Masonry style responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {event.gallery.map((imgUrl, imgIdx) => (
                    <div 
                      key={imgIdx} 
                      onClick={() => setLightboxIndex(imgIdx)}
                      className="group relative aspect-video sm:aspect-square rounded-2xl bg-muted overflow-hidden border border-border shadow-sm cursor-pointer transition-all duration-300 hover:scale-103 hover:border-primary/40 hover:shadow-md"
                    >
                      <img src={imgUrl} alt={`gallery-photo-${imgIdx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white gap-1.5 font-semibold text-xs">
                        <Maximize2 className="w-4 h-4" /> Expand View
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar Meta Data */}
          <div className="space-y-6 lg:sticky lg:top-4">
            
            {/* Sticky Sidebar details card */}
            <Card className="bg-card border-2 border-border/80 shadow-md">
              <CardHeader className="bg-muted/10 border-b pb-4">
                <CardTitle className="text-base font-bold">Event Details</CardTitle>
                <CardDescription className="text-xs">Quick schedule and logistics lookup.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs text-muted-foreground">
                
                {event.time && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-foreground text-sm">Schedule Time</div>
                      <div className="text-xs mt-0.5">{event.time}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 border-t pt-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground text-sm">Venue Location</div>
                    <div className="text-xs mt-0.5 leading-relaxed">{event.location}</div>
                  </div>
                </div>

                {event.limit && (
                  <div className="flex items-start gap-3 border-t pt-3">
                    <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-foreground text-sm">Attendance Limit</div>
                      <div className="text-xs mt-0.5">{event.limit}</div>
                    </div>
                  </div>
                )}

                {/* Impact Statement for Past events */}
                {event.impact && (
                  <div className="flex flex-col gap-1.5 bg-sky-600/5 p-4 rounded-xl border border-dashed border-sky-600/25 mt-4">
                    <div className="text-xs font-bold text-sky-600 uppercase tracking-widest">Impact Accomplished</div>
                    <div className="font-extrabold text-foreground text-sm mt-0.5 flex items-center gap-1.5">
                      <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                      {event.impact}
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Sidebar Action Button */}
              <CardFooter className="p-5 border-t bg-muted/5 flex flex-col gap-2">
                {event.type === 'upcoming' ? (
                  registered ? (
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2" disabled>
                      <Check className="w-4.5 h-4.5" /> Already Registered
                    </Button>
                  ) : (
                    <Button onClick={handleRSVPClick} className="w-full gap-2 text-sm py-5 font-bold shadow-md">
                      Register For Event
                    </Button>
                  )
                ) : (
                  <div className="text-center py-2 text-xs font-semibold text-muted-foreground bg-muted p-2 w-full rounded-lg">
                    Event Completed
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* FULL-SCREEN PREMIUM LIGHTBOX MODAL */}
      {lightboxIndex !== null && event.gallery && (
        <div 
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          {/* Lightbox Top Panel */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
            <div className="text-sm font-semibold tracking-wider">
              {event.title} <span className="text-white/40 ml-2">({lightboxIndex + 1} / {event.gallery.length})</span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(event.gallery[lightboxIndex], '_blank')
                }}
                className="text-white hover:bg-white/10"
                title="View Full Resolution"
              >
                <Download className="w-5 h-5" />
              </Button>
              <button 
                onClick={() => setLightboxIndex(null)} 
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Left Arrow */}
          <button 
            onClick={handlePrevImage}
            className="absolute left-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white z-20 transition"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Active Image */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[85vw] max-h-[80vh] flex items-center justify-center animate-in zoom-in-95 duration-200"
          >
            <img 
              src={event.gallery[lightboxIndex]} 
              alt={`highlights-lightbox-${lightboxIndex}`} 
              className="w-full h-full object-contain rounded-xl border border-white/10 shadow-2xl"
            />
          </div>

          {/* Right Arrow */}
          <button 
            onClick={handleNextImage}
            className="absolute right-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white z-20 transition"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* RSVP MODAL FORM (Direct RSVP support) */}
      {rsvpModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-card rounded-2xl border shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="text-base font-bold">Event RSVP Registration</h3>
              <button onClick={() => setRsvpModalOpen(false)} className="p-1 rounded-full hover:bg-muted text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRSVPSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="det-reg-name" className="text-xs">Your Name (Pre-filled)</Label>
                <Input
                  id="det-reg-name"
                  value={user.name}
                  disabled
                  className="bg-muted/30 cursor-not-allowed text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="det-reg-email" className="text-xs">Your Email (Pre-filled)</Label>
                <Input
                  id="det-reg-email"
                  value={user.email}
                  disabled
                  className="bg-muted/30 cursor-not-allowed text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="det-reg-phone" className="text-xs flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-primary" /> Contact Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="det-reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  required
                  className="text-sm focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="det-reg-notes" className="text-xs flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-primary" /> Any questions or notes for mentors?
                </Label>
                <Textarea
                  id="det-reg-notes"
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
                  onClick={() => setRsvpModalOpen(false)}
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
