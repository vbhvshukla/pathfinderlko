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
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-muted/10">
                <th className="text-left px-3 py-2 text-sm">Name</th>
                <th className="text-left px-3 py-2 text-sm">Email</th>
                <th className="text-left px-3 py-2 text-sm">Subject</th>
                <th className="text-left px-3 py-2 text-sm">Message</th>
                <th className="text-left px-3 py-2 text-sm">Contact</th>
                <th className="text-left px-3 py-2 text-sm">Received</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-3 align-top"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-3 py-3 align-top"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-3 py-3 align-top"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-3 py-3 align-top max-w-xl"><Skeleton className="h-4 w-full" /></td>
                  <td className="px-3 py-3 align-top"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-3 py-3 align-top"><Skeleton className="h-4 w-40" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-muted">No messages</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-muted/10">
                <th className="text-left px-3 py-2 text-sm">Name</th>
                <th className="text-left px-3 py-2 text-sm">Email</th>
                <th className="text-left px-3 py-2 text-sm">Subject</th>
                <th className="text-left px-3 py-2 text-sm">Message</th>
                <th className="text-left px-3 py-2 text-sm">Contact</th>
                <th className="text-left px-3 py-2 text-sm">Received</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m._id || m.id || m.email} className="border-t">
                  <td className="px-3 py-3 align-top">
                    <div className="font-semibold">{m.name}</div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <div className="text-sm text-muted">{m.email}</div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <div className="text-sm">{m.subject || '-'}</div>
                  </td>
                  <td className="px-3 py-3 align-top max-w-xl">
                    <div className="text-sm break-words">{m.message}</div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <div className="text-sm">{m.contactNumber || '-'}</div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <div className="text-sm text-muted">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-muted">{loading ? <Skeleton className="h-4 w-48" /> : `Showing page ${page} of ${pages} — ${total} messages`}</div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
          {Array.from({ length: pages }).slice(0, 10).map((_, i) => {
            const p = i + 1
            return (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded ${p === page ? 'bg-primary text-primary-foreground' : 'border'}`}>
                {p}
              </button>
            )
          })}
          <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
        </div>
      </div>
    </div>
  )
}
