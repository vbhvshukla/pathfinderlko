import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiFetch } from '@/lib/api'
import axios from 'axios'
import Loader from '@/components/ui/loader'
import { toast } from 'sonner'
import { BookOpen, Plus, Trash2, Upload, FileText, Calendar, Sparkles, Check, X, ExternalLink } from 'lucide-react'

export default function AdminMagazines() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [featured, setFeatured] = useState(false)
  const [publishedAt, setPublishedAt] = useState('')
  const [mags, setMags] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [openingId, setOpeningId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    loadList()
  }, [])

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview)
      }
    }
  }, [coverPreview])

  async function loadList() {
    setLoading(true)
    try {
      const res = await apiFetch('/magazines')
      setMags(res.magazines || [])
    } catch (e) {
      console.error('Failed to load magazines', e)
      toast.error('Failed to retrieve magazines list.')
    } finally {
      setLoading(false)
    }
  }

  const handleCoverChange = (selectedFile) => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
    }
    setCoverFile(selectedFile)
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setCoverPreview(url)
    } else {
      setCoverPreview(null)
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!title) {
      toast.error('Provide a magazine title')
      return
    }
    if (!file) {
      toast.error('Please select a PDF document')
      return
    }
    if (!coverFile) {
      toast.error('Please select a cover image')
      return
    }

    try {
      setUploading(true)
      const fd = new FormData()
      fd.append('file', file)
      fd.append('cover', coverFile)
      fd.append('title', title)
      if (featured) fd.append('featured', 'true')
      if (publishedAt) fd.append('publishedAt', publishedAt)

      await apiFetch('/magazines', { method: 'POST', data: fd })

      toast.success('Magazine uploaded successfully!')
      setTitle('')
      setFile(null)
      setCoverFile(null)
      setCoverPreview(null)
      setFeatured(false)
      setPublishedAt('')
      setModalOpen(false)
      await loadList()
    } catch (err) {
      console.error(err)
      toast.error(err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function openPdf(m) {
    const id = m._id || m.id
    try {
      setOpeningId(id)
      const url = `/api/magazines/${id}/download`
      const res = await axios.get(url, { responseType: 'blob', withCredentials: true })
      const contentType = res.headers['content-type'] || 'application/pdf'
      const blob = new Blob([res.data], { type: contentType })
      
      if (/html|text/i.test(contentType)) {
        const text = await blob.text()
        console.error('Expected PDF but received HTML/text response:', text)
        toast.error('Failed to open PDF (invalid file response)')
        return
      }
      
      const blobUrl = URL.createObjectURL(blob)
      window.open(blobUrl, '_blank', 'noopener,noreferrer')
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
    } catch (err) {
      console.error('Failed to fetch PDF', err)
      toast.error('Failed to retrieve PDF document')
    } finally {
      setOpeningId(null)
    }
  }

  async function handleDelete(m) {
    const id = m._id || m.id
    if (!id) return
    if (!window.confirm(`Delete magazine "${m.title}"? This action cannot be undone.`)) return
    try {
      setDeletingId(id)
      await apiFetch(`/magazines/${id}`, { method: 'DELETE' })
      toast.success('Magazine deleted successfully!')
      await loadList()
    } catch (err) {
      console.error('Failed to delete magazine', err)
      toast.error(err?.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Magazines Administration</h1>
          <p className="text-sm text-muted-foreground">Publish, manage, and distribute digital magazines and resources.</p>
        </div>
        <div>
          <Button onClick={() => setModalOpen(true)} size="sm" className="gap-1 text-xs">
            <Plus className="w-4 h-4" /> Upload Magazine
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader /></div>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">All Publications</CardTitle>
            <CardDescription className="text-xs">Manage current live PDF catalogs and digital documents.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            {mags.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted">No magazines found. Upload your first publication.</div>
            ) : (
              <table className="w-full text-sm border-collapse text-left">
                <thead>
                  <tr className="border-b bg-muted/20 text-muted-foreground text-xs uppercase font-semibold">
                    <th className="p-4 w-24">Cover</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Published Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mags.map(m => (
                    <tr key={m._id || m.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-16 bg-muted rounded overflow-hidden shadow-sm border border-border transition-transform hover:scale-105 duration-200">
                          {m.imageUrl ? (
                            <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No Cover</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-foreground max-w-xs truncate">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary shrink-0" />
                          {m.title}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {m.publishedAt ? new Date(m.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="p-4">
                        <Badge className={m.featured ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/10 font-medium' : 'bg-muted text-muted-foreground hover:bg-muted font-medium'}>
                          {m.featured ? 'Featured' : 'Standard'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          {(m._id || m.id) && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => openPdf(m)}
                              disabled={openingId === (m._id || m.id)}
                              className="h-8 text-xs gap-1"
                            >
                              {openingId === (m._id || m.id) ? (
                                <>
                                  <Loader size={12} /> Opening...
                                </>
                              ) : (
                                <>
                                  <ExternalLink className="w-3.5 h-3.5" /> View PDF
                                </>
                              )}
                            </Button>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(m)}
                            disabled={deletingId === (m._id || m.id)}
                            className="h-8 text-xs text-destructive hover:text-destructive/80"
                          >
                            {deletingId === (m._id || m.id) ? 'Deleting...' : 'Delete'}
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
      )}

      {/* UPLOAD MAGAZINE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-card rounded-2xl border shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between mb-4 flex-none border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Upload New Magazine</h3>
                  <p className="text-xs text-muted-foreground">Distribute digital PDFs with elegant thumbnail covers.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setModalOpen(false)
                  setTitle('')
                  setFile(null)
                  setCoverFile(null)
                  setCoverPreview(null)
                  setFeatured(false)
                  setPublishedAt('')
                }} 
                className="p-1 rounded-full hover:bg-muted text-muted-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 overflow-y-auto flex-1 pr-1 text-left pb-2">
              <div className="space-y-2">
                <Label htmlFor="mag-title" className="text-xs font-semibold">Magazine Title <span className="text-destructive">*</span></Label>
                <Input
                  id="mag-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pathfinder Digest - Autumn Issue"
                  required
                  className="text-sm focus-visible:ring-primary"
                />
              </div>

              {/* Styled File Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">PDF Document <span className="text-destructive">*</span></Label>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-4 hover:border-primary/50 transition cursor-pointer relative flex flex-col items-center justify-center text-center bg-muted/5 min-h-[110px]">
                    <input 
                      required 
                      type="file" 
                      accept="application/pdf" 
                      onChange={(e) => setFile(e.target.files[0])} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="w-6 h-6 text-muted-foreground mb-1.5" />
                    <span className="text-xs text-foreground font-semibold px-2 break-all max-w-full truncate">
                      {file ? file.name : "Select PDF"}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1">PDF File formats</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Cover Image <span className="text-destructive">*</span></Label>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-4 hover:border-primary/50 transition cursor-pointer relative flex flex-col items-center justify-center text-center bg-muted/5 min-h-[110px]">
                    <input 
                      required 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleCoverChange(e.target.files[0])} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="w-6 h-6 text-muted-foreground mb-1.5" />
                    <span className="text-xs text-foreground font-semibold px-2 break-all max-w-full truncate">
                      {coverFile ? coverFile.name : "Select Cover"}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1">Images up to 5MB</span>
                  </div>
                </div>
              </div>

              {/* Cover Preview Section */}
              {coverPreview && (
                <div className="mt-1 flex items-center gap-3 border rounded-xl p-3 bg-muted/10 border-border animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="w-12 h-16 bg-muted rounded overflow-hidden shadow border shrink-0">
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-foreground truncate">{coverFile?.name}</div>
                    <div className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-0.5 font-medium">
                      <Check className="w-3.5 h-3.5" /> Ready for upload
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setCoverFile(null)
                      if (coverPreview) {
                        URL.revokeObjectURL(coverPreview)
                      }
                      setCoverPreview(null)
                    }} 
                    className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-2">
                  <Label htmlFor="mag-date" className="text-xs font-semibold">Published Date</Label>
                  <Input
                    id="mag-date"
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="text-sm focus-visible:ring-primary h-9"
                  />
                </div>

                <div className="flex items-center gap-2 h-full pt-6 pl-1">
                  <input
                    id="mag-featured"
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <Label htmlFor="mag-featured" className="text-xs font-medium text-foreground cursor-pointer select-none">
                    Feature on Home Shelf
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t flex-none">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setModalOpen(false)
                    setTitle('')
                    setFile(null)
                    setCoverFile(null)
                    setCoverPreview(null)
                    setFeatured(false)
                    setPublishedAt('')
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={uploading} className="gap-1">
                  {uploading ? (
                    <>
                      <Loader size={14} /> Uploading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Upload & Publish
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

