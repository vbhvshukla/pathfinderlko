import React, { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Mail } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminContacts() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await apiFetch('/contact', { params: { page, limit } })
        setMessages(data.messages || [])
        setPages(data.pages || 1)
        setTotal(data.total || 0)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, limit])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><Mail className="w-6 h-6"/>Contact Messages</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-2xl bg-card space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-muted">No messages</div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m._id || m.id || m.email} className="p-4 border rounded-2xl bg-card shadow-sm space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-foreground">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.email}</div>
                </div>
                <div className="text-xs text-muted-foreground text-right shrink-0">
                  {m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}
                </div>
              </div>
              {m.subject && <div className="text-sm font-medium">{m.subject}</div>}
              <div className="text-sm text-foreground/90 break-words">{m.message}</div>
              {m.contactNumber && <div className="text-xs text-muted-foreground">Contact: {m.contactNumber}</div>}
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-muted">{loading ? <Skeleton className="h-4 w-48" /> : `Showing page ${page} of ${pages} — ${total} messages`}</div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="min-w-[44px] min-h-[44px] px-3 py-2 border rounded-lg disabled:opacity-50 active:bg-accent/10" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
          {Array.from({ length: pages }).slice(0, 10).map((_, i) => {
            const p = i + 1
            return (
              <button key={p} onClick={() => setPage(p)} className={`min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg ${p === page ? 'bg-primary text-primary-foreground' : 'border active:bg-accent/10'}`}>
                {p}
              </button>
            )
          })}
          <button className="min-w-[44px] min-h-[44px] px-3 py-2 border rounded-lg disabled:opacity-50 active:bg-accent/10" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
        </div>
      </div>
    </div>
  )
}
