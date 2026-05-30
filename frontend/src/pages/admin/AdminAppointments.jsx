import React, { useEffect, useState } from 'react'
import { User, Phone, Mail, Calendar, Clock, Edit2, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
]

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'confirmed', 'cancelled', 'rescheduled'

  // Reschedule modal state
  const [editAppt, setEditAppt] = useState(null)
  const [editForm, setEditForm] = useState({ date: '', timeSlot: '', status: '' })
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const data = await apiFetch('/appointments')
      setAppointments(data.appointments || [])
    } catch (e) {
      toast.error('Failed to load appointments.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleOpenEdit = (appt) => {
    setEditAppt(appt)
    setEditForm({
      date: appt.date ? new Date(appt.date).toISOString().split('T')[0] : '',
      timeSlot: appt.timeSlot || TIME_SLOTS[0],
      status: appt.status || 'pending',
    })
  }

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      await apiFetch(`/appointments/${apptId}/status`, {
        method: 'PATCH',
        data: { status: newStatus },
      })
      toast.success(`Appointment marked as ${newStatus}`)
      load()
    } catch (err) {
      toast.error(err.message || 'Failed to update status.')
    }
  }

  const handleSaveReschedule = async (e) => {
    e.preventDefault()
    if (!editForm.date) {
      toast.error('Please select a date.')
      return
    }
    setSubmitting(true)
    try {
      await apiFetch(`/appointments/${editAppt._id}`, {
        method: 'PATCH',
        data: editForm,
      })
      toast.success('Appointment details updated and client notified.')
      setEditAppt(null)
      load()
    } catch (err) {
      toast.error(err.message || 'Failed to update appointment.')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredAppointments = appointments.filter((a) => {
    if (filter === 'all') return true
    return a.status === filter
  })

  function getStatusBadge(status) {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Confirmed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      case 'rescheduled':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Rescheduled</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments Management</h1>
          <p className="text-sm text-muted-foreground">Review, reschedule, and manage statuses of patient bookings.</p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-muted p-1 rounded-lg">
          {['all', 'pending', 'confirmed', 'rescheduled', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md capitalize transition-all ${
                filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 border rounded-2xl bg-card space-y-3">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : (
          <>
            {filteredAppointments.length === 0 && (
              <div className="text-center py-12 border border-dashed rounded-2xl bg-card">
                <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-foreground">No appointments found</p>
                <p className="text-sm text-muted-foreground">There are no appointments matching this status filter.</p>
              </div>
            )}
            {filteredAppointments.map((a) => (
              <div key={a._id} className="p-5 border rounded-2xl bg-card hover:border-primary/20 transition-all duration-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-base text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> {a.name}
                    </span>
                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                      {a.serviceName || a.serviceId || 'General Counseling'}
                    </Badge>
                    {getStatusBadge(a.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{a.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{a.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{a.date ? new Date(a.date).toLocaleDateString() : 'Pending Date'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{a.timeSlot || 'Pending Slot'}</span>
                    </div>
                  </div>

                  {(a.address || a.notes) && (
                    <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
                      {a.address && <div><strong>Address:</strong> {a.address}</div>}
                      {a.notes && <div><strong>Notes:</strong> "{a.notes}"</div>}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 md:self-center">
                  {a.status !== 'confirmed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
                      onClick={() => handleUpdateStatus(a._id, 'confirmed')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Confirm
                    </Button>
                  )}
                  {a.status !== 'cancelled' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={() => handleUpdateStatus(a._id, 'cancelled')}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => handleOpenEdit(a)}>
                    <Edit2 className="w-3.5 h-3.5" /> Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Reschedule modal */}
      {editAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-card rounded-2xl border shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold mb-4">Reschedule Appointment</h3>
            <form onSubmit={handleSaveReschedule} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Select Date</label>
                <input
                  type="date"
                  value={editForm.date}
                  min={todayStr}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Select Slot</label>
                <select
                  value={editForm.timeSlot}
                  onChange={(e) => setEditForm({ ...editForm, timeSlot: e.target.value })}
                  className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot} className="bg-card text-foreground">
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Change Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="pending" className="bg-card text-foreground">Pending</option>
                  <option value="confirmed" className="bg-card text-foreground">Confirmed</option>
                  <option value="rescheduled" className="bg-card text-foreground">Rescheduled</option>
                  <option value="cancelled" className="bg-card text-foreground">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setEditAppt(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Save & Notify User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
