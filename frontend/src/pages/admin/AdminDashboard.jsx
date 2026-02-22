import React, { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Calendar, Mail } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ appointments: 0, contacts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [aJson, cJson] = await Promise.all([apiFetch('/appointments'), apiFetch('/contact')])
        setCounts({ appointments: aJson?.appointments?.length || 0, contacts: cJson?.messages?.length || (cJson?.messages ? cJson.messages.length : (cJson?.length || 0)) })
      } catch (e) {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border rounded flex items-center gap-4">
          {loading ? <Skeleton className="w-8 h-8" /> : <Calendar className="w-8 h-8 text-muted" />}
          <div>
            <div className="text-sm text-muted">Appointments</div>
            <div className="text-3xl font-semibold">{loading ? <Skeleton className="h-8 w-20" /> : counts.appointments}</div>
          </div>
        </div>

        <div className="p-4 border rounded flex items-center gap-4">
          {loading ? <Skeleton className="w-8 h-8" /> : <Mail className="w-8 h-8 text-muted" />}
          <div>
            <div className="text-sm text-muted">Contact Messages</div>
            <div className="text-3xl font-semibold">{loading ? <Skeleton className="h-8 w-20" /> : counts.contacts}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
