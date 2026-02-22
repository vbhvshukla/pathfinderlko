import React, { useEffect, useState } from 'react'
import { User, Phone } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await apiFetch('/appointments')
        setAppointments(data.appointments || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border rounded">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : (
          <>
            {appointments.length === 0 && <div className="text-muted">No appointments yet</div>}
            {appointments.map((a) => (
              <div key={a._id} className="p-4 border rounded">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="mb-3 sm:mb-0">
                      <div className="font-semibold flex items-center gap-2"><User className="w-5 h-5"/>{a.name} — {a.serviceName || a.serviceId || a.service}</div>
                      <div className="text-sm text-muted"><span className="mr-2">{a.email}</span><Phone className="inline-block w-4 h-4 mr-1"/>{a.phone}</div>
                    </div>
                    <div className="text-sm">{a.date ? new Date(a.date).toLocaleString() : 'No date'}</div>
                  </div>
                  {a.address && <div className="mt-2 text-sm">{a.address}</div>}
                </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
