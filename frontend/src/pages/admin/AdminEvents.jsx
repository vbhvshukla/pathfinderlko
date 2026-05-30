import React, { useState, useEffect } from 'react'
import { Calendar, Plus, Edit, Trash2, Users, FileText, Phone, Mail, User, Info, Upload, Image } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Loader from '@/components/ui/loader'
import client, { apiFetch } from '@/lib/api'
import { toast } from 'sonner'

export default function AdminEvents() {
  const [activeTab, setActiveTab] = useState('events') // 'events' or 'rsvps'
  const [events, setEvents] = useState([])
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(true)

  // Direct upload states and handlers
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  async function handleCoverUpload(file) {
    if (!file) return
    setUploadingCover(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('category', 'events')
      const res = await client.post('/api/uploads', fd)
      if (res?.data?.upload?.url) {
        setFormData(prev => ({ ...prev, coverImage: res.data.upload.url }))
        toast.success('Cover image uploaded successfully!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to upload cover image.')
    } finally {
      setUploadingCover(false)
    }
  }

  async function handleGalleryUpload(file) {
    if (!file) return
    setUploadingGallery(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('category', 'events')
      const res = await client.post('/api/uploads', fd)
      if (res?.data?.upload?.url) {
        setFormData(prev => {
          const currentList = prev.gallery ? prev.gallery.split('\n').filter(Boolean) : []
          currentList.push(res.data.upload.url)
          return { ...prev, gallery: currentList.join('\n') }
        })
        toast.success('Gallery photo uploaded successfully!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to upload gallery photo.')
    } finally {
      setUploadingGallery(false)
    }
  }

  // Event modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    description: '',
    limit: '',
    type: 'upcoming',
    impact: '',
    coverImage: '',
    gallery: ''
  })

  // Load events and RSVPs
  async function loadData() {
    setLoading(true)
    try {
      const eventsRes = await apiFetch('/events')
      if (eventsRes && eventsRes.events) {
        setEvents(eventsRes.events)
      }

      const rsvpsRes = await apiFetch('/rsvp/admin/all-rsvps')
      if (rsvpsRes && rsvpsRes.rsvps) {
        setRsvps(rsvpsRes.rsvps)
      }
    } catch (err) {
      console.error('Failed to load admin data:', err)
      toast.error('Failed to load administrator data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Open modal for adding
  const handleAddClick = () => {
    setEditingEvent(null)
    setFormData({
      title: '',
      category: '',
      date: '',
      time: '',
      location: '',
      description: '',
      limit: '',
      type: 'upcoming',
      impact: '',
      coverImage: '',
      gallery: ''
    })
    setModalOpen(true)
  }

  // Open modal for editing
  const handleEditClick = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title || '',
      category: event.category || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      description: event.description || '',
      limit: event.limit || '',
      type: event.type || 'upcoming',
      impact: event.impact || '',
      coverImage: event.coverImage || '',
      gallery: event.gallery ? event.gallery.join('\n') : ''
    })
    setModalOpen(true)
  }

  // Handle Event submission (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.category || !formData.date || !formData.location || !formData.description) {
      toast.error('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      const galleryArray = formData.gallery
        ? formData.gallery.split('\n').map(url => url.trim()).filter(Boolean)
        : []

      const submitData = {
        ...formData,
        gallery: galleryArray
      }

      if (editingEvent) {
        // Edit mode
        await apiFetch(`/events/${editingEvent._id}`, {
          method: 'PUT',
          data: submitData
        })
        toast.success('Event updated successfully!')
      } else {
        // Add mode
        await apiFetch('/events', {
          method: 'POST',
          data: submitData
        })
        toast.success('Event created successfully!')
      }
      setModalOpen(false)
      loadData()
    } catch (err) {
      toast.error(err.message || 'Failed to save event.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Event deletion
  const handleDeleteClick = async (eventId, title) => {
    if (!confirm(`Are you sure you want to delete the event: "${title}"?`)) {
      return
    }

    try {
      await apiFetch(`/events/${eventId}`, {
        method: 'DELETE'
      })
      toast.success('Event deleted successfully!')
      loadData()
    } catch (err) {
      toast.error(err.message || 'Failed to delete event.')
    }
  }

  // Helper to map eventId to Event Title
  const getEventTitle = (eventId) => {
    // Check if event exists in backend list matching database ID string or static number
    const match = events.find(e => String(e._id) === String(eventId) || String(e.id) === String(eventId))
    return match ? match.title : `Event (ID: ${eventId})`
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events & RSVPs Administration</h1>
          <p className="text-sm text-muted-foreground">Manage events and workshops, and track user rsvps/registrations.</p>
        </div>
        
        {/* Toggle buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-muted p-1 rounded-lg border">
            <button
              onClick={() => setActiveTab('events')}
              className={`text-xs font-semibold px-4 py-1.5 rounded-md transition-all ${
                activeTab === 'events' ? 'bg-card text-primary shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Event Manager
            </button>
            <button
              onClick={() => setActiveTab('rsvps')}
              className={`text-xs font-semibold px-4 py-1.5 rounded-md transition-all ${
                activeTab === 'rsvps' ? 'bg-card text-primary shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              RSVPs ({rsvps.length})
            </button>
          </div>
          
          {activeTab === 'events' && (
            <Button onClick={handleAddClick} size="sm" className="gap-1 text-xs">
              <Plus className="w-4 h-4" /> Add Event
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader /></div>
      ) : activeTab === 'events' ? (
        /* EVENTS LIST PANEL */
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Workshops & Outreach Campaigns</CardTitle>
            <CardDescription className="text-xs">Direct database CRUD of dynamic and past events.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            {events.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted">No events found in the database.</div>
            ) : (
              <table className="w-full text-sm border-collapse text-left">
                <thead>
                  <tr className="border-b bg-muted/20 text-muted-foreground text-xs uppercase font-semibold">
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Schedule</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Type</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {events.map((e) => (
                    <tr key={e._id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-semibold text-foreground max-w-xs truncate">{e.title}</td>
                      <td className="p-4">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                          {e.category}
                        </Badge>
                      </td>
                      <td className="p-4 text-xs">
                        <div className="font-medium text-foreground">{e.date}</div>
                        {e.time && <div className="text-muted-foreground mt-0.5">{e.time}</div>}
                      </td>
                      <td className="p-4 text-xs max-w-[150px] truncate">{e.location}</td>
                      <td className="p-4">
                        <Badge className={e.type === 'upcoming' ? 'bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/10' : 'bg-muted text-muted-foreground hover:bg-muted'}>
                          {e.type}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button onClick={() => handleEditClick(e)} variant="ghost" size="icon" className="w-8 h-8 rounded-full text-foreground hover:text-primary">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleDeleteClick(e._id, e.title)} variant="ghost" size="icon" className="w-8 h-8 rounded-full text-destructive hover:text-destructive/80">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      ) : (
        /* RSVPS LIST PANEL */
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Attendees & Registrations</CardTitle>
            <CardDescription className="text-xs">View guest details and registrations saved in the database.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            {rsvps.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted">No guest registrations found.</div>
            ) : (
              <table className="w-full text-sm border-collapse text-left">
                <thead>
                  <tr className="border-b bg-muted/20 text-muted-foreground text-xs uppercase font-semibold">
                    <th className="p-4">Event</th>
                    <th className="p-4">Attendee</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Notes / Questions</th>
                    <th className="p-4">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rsvps.map((r) => (
                    <tr key={r._id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-semibold text-foreground max-w-xs truncate">
                        {getEventTitle(r.eventId)}
                      </td>
                      <td className="p-4 text-xs">
                        <div className="font-semibold text-foreground flex items-center gap-1"><User className="w-3 h-3 text-primary" /> {r.name}</div>
                        <div className="text-muted-foreground flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3 text-muted-foreground" /> {r.email}</div>
                      </td>
                      <td className="p-4 text-xs font-medium text-foreground whitespace-nowrap">
                        <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary" /> {r.phone}</span>
                      </td>
                      <td className="p-4 text-xs max-w-sm leading-relaxed text-muted-foreground italic break-words">
                        {r.notes ? `"${r.notes}"` : <span className="text-muted-foreground/30">—</span>}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      {/* EVENT ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-card rounded-2xl border shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 flex-none border-b pb-3">
              <h3 className="text-lg font-bold">{editingEvent ? 'Edit Event & Workshop' : 'Create New Event'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-full hover:bg-muted text-muted-foreground">
                <Trash2 className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 text-left pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="ev-title" className="text-xs">Event Title <span className="text-destructive">*</span></Label>
                  <Input
                    id="ev-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. mindfulness and stress relief"
                    required
                    className="text-sm focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ev-category" className="text-xs">Category <span className="text-destructive">*</span></Label>
                  <Input
                    id="ev-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Mental Health"
                    required
                    className="text-sm focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ev-type" className="text-xs">Event Type <span className="text-destructive">*</span></Label>
                  <select
                    id="ev-type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="upcoming">Upcoming (Booking Open)</option>
                    <option value="past">Past Highlights (Finished)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ev-date" className="text-xs">Date Schedule <span className="text-destructive">*</span></Label>
                  <Input
                    id="ev-date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. June 15, 2026"
                    required
                    className="text-sm focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ev-time" className="text-xs">Time Schedule</Label>
                  <Input
                    id="ev-time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 04:00 PM - 05:30 PM"
                    className="text-sm focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="ev-loc" className="text-xs">Location <span className="text-destructive">*</span></Label>
                  <Input
                    id="ev-loc"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Gomti Nagar Library, Lucknow or Online via Zoom"
                    required
                    className="text-sm focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ev-limit" className="text-xs">Attendance Limit</Label>
                  <Input
                    id="ev-limit"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                    placeholder="e.g. 50 Seats Only / Unlimited"
                    className="text-sm focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ev-impact" className="text-xs">Past Impact</Label>
                  <Input
                    id="ev-impact"
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    placeholder="e.g. 200+ Beneficiaries (For Past events)"
                    className="text-sm focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label className="text-xs font-semibold">Cover Image Banner</Label>
                  
                  {formData.coverImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-border shadow-sm aspect-video max-h-40 bg-muted group">
                      <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => setFormData({ ...formData, coverImage: '' })}
                          className="w-9 h-9 rounded-full"
                          title="Remove Cover Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-muted-foreground/20 rounded-xl p-4 hover:border-primary/50 transition cursor-pointer flex flex-col items-center justify-center text-center bg-muted/5 min-h-[100px]">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleCoverUpload(e.target.files[0])} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {uploadingCover ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <Loader size={16} />
                          <span className="text-[10px] text-muted-foreground">Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                          <span className="text-xs font-semibold text-foreground">Click to upload Event Cover</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, WebP</span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="space-y-1 mt-2">
                    <Label htmlFor="ev-cover" className="text-[10px] text-muted-foreground">Or paste direct URL</Label>
                    <Input
                      id="ev-cover"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="https://res.cloudinary.com/..."
                      className="text-xs h-7 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label className="text-xs font-semibold">Gallery Images</Label>
                    <div className="relative shrink-0">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleGalleryUpload(e.target.files[0])} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploadingGallery}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        disabled={uploadingGallery}
                        className="h-7 text-[10px] gap-1 px-2.5"
                      >
                        {uploadingGallery ? <Loader size={10} /> : <Upload className="w-3 h-3" />}
                        Upload & Append Photo
                      </Button>
                    </div>
                  </div>
                  
                  <Textarea
                    id="ev-gallery"
                    rows={3}
                    value={formData.gallery}
                    onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
                    placeholder="Enter image URLs (one per line) or use the button to upload..."
                    className="text-sm focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="ev-desc" className="text-xs">Description <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="ev-desc"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a detailed description of the workshop topics, speaker details..."
                    required
                    className="text-sm focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t flex-none">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting}>
                  {submitting ? 'Saving...' : editingEvent ? 'Save Changes' : 'Create Event'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
