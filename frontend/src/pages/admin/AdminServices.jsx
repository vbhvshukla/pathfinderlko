import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Loader from '@/components/ui/loader'
import { toast } from 'sonner'

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingService, setEditingService] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    price: 500,
    sessions: 1,
    active: true,
  })

  async function loadServices() {
    setLoading(true)
    try {
      const res = await apiFetch('/services')
      if (res && res.services) {
        setServices(res.services)
      }
    } catch (err) {
      toast.error('Failed to load services.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  const handleOpenAdd = () => {
    setEditingService(null)
    setFormData({
      title: '',
      description: '',
      duration: 60,
      price: 500,
      sessions: 1,
      active: true,
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (svc) => {
    setEditingService(svc)
    setFormData({
      title: svc.title,
      description: svc.description || '',
      duration: svc.duration || 60,
      price: svc.price || 0,
      sessions: svc.sessions || 1,
      active: svc.active !== undefined ? svc.active : true,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return
    try {
      await apiFetch(`/services/${id}`, { method: 'DELETE' })
      toast.success('Service deleted successfully.')
      loadServices()
    } catch (err) {
      toast.error(err.message || 'Failed to delete service.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Title is required.')
      return
    }

    setSubmitting(true)
    try {
      if (editingService) {
        await apiFetch(`/services/${editingService._id}`, {
          method: 'PUT',
          data: formData,
        })
        toast.success('Service package updated successfully.')
      } else {
        await apiFetch('/services', {
          method: 'POST',
          data: formData,
        })
        toast.success('New service package created successfully.')
      }
      setModalOpen(false)
      loadServices()
    } catch (err) {
      toast.error(err.message || 'Failed to save service.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader size={40} className="text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services Management</h1>
          <p className="text-sm text-muted-foreground">Configure the counseling and mental health services visible on the booking form.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Add Service Package
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configured Packages</CardTitle>
          <CardDescription>Below is the list of counseling packages currently stored in the database.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                      No services defined. Fallback default list is being shown on the booking page.
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((svc) => (
                    <TableRow key={svc._id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="font-semibold text-foreground">{svc.title}</div>
                        <div className="text-xs text-muted-foreground max-w-[280px] truncate" title={svc.description}>
                          {svc.description || 'No description provided.'}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{svc.duration} mins</TableCell>
                      <TableCell>{svc.sessions} Session(s)</TableCell>
                      <TableCell className="font-medium">₹{svc.price}</TableCell>
                      <TableCell>
                        {svc.active ? (
                          <Badge className="bg-emerald-500 text-white flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            <X className="w-3 h-3" /> Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(svc)}>
                          <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(svc._id)}>
                          <Trash2 className="w-4 h-4 text-destructive hover:text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-card rounded-2xl border shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{editingService ? 'Edit Service Package' : 'Create Service Package'}</h3>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="s-title">Service Title</Label>
                <Input
                  id="s-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Anxiety & Stress Therapy"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="s-desc">Description</Label>
                <Textarea
                  id="s-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe what counseling covers..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="s-duration">Duration (Minutes)</Label>
                  <Input
                    id="s-duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    min={15}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-sessions">Sessions Count</Label>
                  <Input
                    id="s-sessions"
                    type="number"
                    value={formData.sessions}
                    onChange={(e) => setFormData({ ...formData, sessions: Number(e.target.value) })}
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="s-price">Price (INR)</Label>
                  <Input
                    id="s-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    min={0}
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    id="s-active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-input"
                  />
                  <Label htmlFor="s-active" className="cursor-pointer">Active / Visible</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
