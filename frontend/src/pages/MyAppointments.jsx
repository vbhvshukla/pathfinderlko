import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
import { Calendar, Download, AlertCircle, Plus, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Loader from '@/components/ui/loader'

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await apiFetch('/appointments/my')
        if (res && res.appointments) {
          setAppointments(res.appointments)
        }
      } catch (err) {
        setError(err.message || 'Failed to load appointments.')
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [])

  function getStatusBadge(status) {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">Confirmed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      case 'rescheduled':
        return <Badge className="bg-amber-500 text-white hover:bg-amber-600">Rescheduled</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const apiBase = import.meta.env.VITE_API_URL || ''

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size={40} className="text-primary animate-spin" />
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage and track your counseling sessions at Pathfinder.</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/appointments">
            <Plus className="w-4 h-4" /> Book New Session
          </Link>
        </Button>
      </div>

      {error ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-6 flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </CardContent>
        </Card>
      ) : appointments.length === 0 ? (
        <Card className="text-center p-12 border-dashed">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <ClipboardList className="w-12 h-12 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">No Appointments Found</CardTitle>
            <CardDescription className="max-w-md">
              You haven't scheduled any mental health or career guidance sessions with us yet.
            </CardDescription>
            <Button asChild>
              <Link to="/appointments">Schedule Your First Session</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointments History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Charges</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appt) => (
                    <TableRow key={appt._id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-foreground">
                        {appt.serviceName || appt.serviceId || 'General Counseling'}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {appt.date ? new Date(appt.date).toLocaleDateString() : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">{appt.timeSlot || 'Pending'}</TableCell>
                      <TableCell>{appt.sessions || 1}</TableCell>
                      <TableCell className="font-medium text-foreground">₹{appt.charges || 0}</TableCell>
                      <TableCell>{getStatusBadge(appt.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="icon" title="Download Invoice">
                          <a
                            href={`${apiBase}/api/appointments/${appt._id}/receipt`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
