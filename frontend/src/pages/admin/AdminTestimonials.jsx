import React, { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Loader from '@/components/ui/loader'
import { toast } from 'sonner'
import { Star, Quote, Check, Trash2, MessageSquareHeart } from 'lucide-react'

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending') // 'all', 'pending', 'approved'
  const [approvingId, setApprovingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const data = await apiFetch('/testimonials/all')
      setTestimonials(data.testimonials || [])
    } catch (err) {
      toast.error('Failed to load testimonials.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleApprove(t) {
    setApprovingId(t._id)
    try {
      await apiFetch(`/testimonials/${t._id}/approve`, { method: 'PUT' })
      toast.success(`"${t.name}"'s testimonial is now live.`)
      load()
    } catch (err) {
      toast.error(err.message || 'Failed to approve testimonial.')
    } finally {
      setApprovingId(null)
    }
  }

  async function handleDelete(t) {
    if (!window.confirm(`Delete the testimonial from "${t.name}"? This cannot be undone.`)) return
    setDeletingId(t._id)
    try {
      await apiFetch(`/testimonials/${t._id}`, { method: 'DELETE' })
      toast.success('Testimonial deleted.')
      setTestimonials(prev => prev.filter(x => x._id !== t._id))
    } catch (err) {
      toast.error(err.message || 'Failed to delete testimonial.')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = testimonials.filter(t => {
    if (filter === 'pending') return !t.approved
    if (filter === 'approved') return t.approved
    return true
  })

  const pendingCount = testimonials.filter(t => !t.approved).length

  function Stars({ rating }) {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i < (rating || 0) ? 'fill-current' : 'text-muted-foreground/30'}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquareHeart className="w-6 h-6 text-primary" /> Testimonials Moderation
          </h1>
          <p className="text-sm text-muted-foreground">Review, approve, or delete stories submitted by visitors before they appear on the site.</p>
        </div>
        {pendingCount > 0 && (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs px-2.5 py-1 w-fit">
            {pendingCount} pending review
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 bg-muted p-1 rounded-lg w-fit">
        {['pending', 'approved', 'all'].map((f) => (
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

      {loading ? (
        <div className="flex justify-center py-20"><Loader /></div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            <MessageSquareHeart className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
            {filter === 'pending' ? 'No testimonials waiting for review.' : 'No testimonials found.'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div key={t._id} className="p-4 border rounded-2xl bg-card shadow-sm space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Stars rating={t.rating} />
                  {t.approved ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Live</Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">Pending</Badge>
                  )}
                </div>
              </div>

              <div className="text-sm text-foreground/90 italic flex gap-2">
                <Quote className="w-4 h-4 text-primary/40 shrink-0 mt-0.5" />
                <span className="break-words">{t.content}</span>
              </div>

              <div className="flex gap-2 pt-1 border-t">
                {!t.approved && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 text-xs flex-1 mt-2 gap-1.5 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                    onClick={() => handleApprove(t)}
                    disabled={approvingId === t._id}
                  >
                    {approvingId === t._id ? 'Approving...' : (<><Check className="w-3.5 h-3.5" /> Approve</>)}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 text-xs flex-1 mt-2 gap-1.5 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(t)}
                  disabled={deletingId === t._id}
                >
                  {deletingId === t._id ? 'Deleting...' : (<><Trash2 className="w-3.5 h-3.5" /> Delete</>)}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
