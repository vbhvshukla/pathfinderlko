import React from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { CheckCircle2, Download, Calendar, ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

export default function AppointmentSuccess() {
  const location = useLocation()
  const appointment = location.state?.appointment

  if (!appointment) {
    return <Navigate to="/appointments" replace />
  }

  const apiBase = import.meta.env.VITE_API_URL || ''
  const receiptUrl = `${apiBase}/api/appointments/${appointment._id}/receipt`

  return (
    <div className="max-w-xl mx-auto px-4 py-16 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-4">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Booking Received!</h1>
        <p className="text-muted-foreground mt-2">
          Your booking is pending confirmation. An email confirmation has been sent.
        </p>
      </div>

      <Card className="border-emerald-500/20 shadow-md">
        <CardHeader className="bg-muted/40 border-b pb-4">
          <CardTitle className="text-base font-bold">Appointment Summary</CardTitle>
          <CardDescription className="text-xs">ID: {appointment._id}</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-b pb-4">
            <div>
              <span className="text-muted-foreground block text-xs uppercase font-semibold">Name</span>
              <span className="font-medium text-foreground">{appointment.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase font-semibold">Phone</span>
              <span className="font-medium text-foreground">{appointment.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase font-semibold">E-mail</span>
              <span className="font-medium text-foreground truncate block max-w-[180px]" title={appointment.email}>
                {appointment.email}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase font-semibold">Service</span>
              <span className="font-medium text-foreground">{appointment.serviceName || appointment.serviceId || 'General Counseling'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-b pb-4">
            <div>
              <span className="text-muted-foreground block text-xs uppercase font-semibold">Requested Date</span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'To be scheduled'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase font-semibold">Time Slot</span>
              <span className="font-medium text-foreground">{appointment.timeSlot || 'To be scheduled'}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase font-semibold">Sessions</span>
              <span className="font-medium text-foreground">{appointment.sessions || 1} Session(s)</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase font-semibold">Total Amount</span>
              <span className="font-semibold text-primary text-base">₹{appointment.charges || 0}.00</span>
            </div>
          </div>

          <div>
            <span className="text-muted-foreground block text-xs uppercase font-semibold mb-1">Notes</span>
            <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/40 p-2.5 rounded-lg border border-dashed">
              "{appointment.notes || 'No extra notes provided.'}"
            </p>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 p-4 border-t flex flex-col sm:flex-row gap-3">
          <Button asChild variant="outline" className="w-full sm:w-1/2 gap-2">
            <a href={receiptUrl} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4" /> Download PDF Receipt
            </a>
          </Button>
          <Button asChild className="w-full sm:w-1/2 gap-2">
            <Link to="/my-appointments">
              My Appointments <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center mt-6">
        <Button asChild variant="ghost" className="gap-2">
          <Link to="/">
            <Home className="w-4 h-4" /> Back to Homepage
          </Link>
        </Button>
      </div>
    </div>
  )
}
