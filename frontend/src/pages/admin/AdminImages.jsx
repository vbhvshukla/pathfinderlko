import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import client from '@/lib/api'
import Loader from '@/components/ui/loader'
import { Image as ImageIcon, Upload, Eye, Trash2, Sparkles, FolderOpen } from 'lucide-react'
import { Label } from '@/components/ui/label'

export default function AdminImages() {
  const [files, setFiles] = useState([])
  const [category, setCategory] = useState('services')
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  // Automatically load images on mount and whenever the selected category changes
  useEffect(() => {
    loadImages()
  }, [category])

  async function loadImages() {
    setLoading(true)
    try {
      const res = await client.get(`/api/uploads?category=${encodeURIComponent(category)}`)
      setImages(res.data && res.data.uploads ? res.data.uploads : [])
      setFetched(true)
    } catch (err) {
      console.error('Failed to load images', err)
      setStatus({ type: 'error', message: 'Failed to load images.' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) return
    try {
      setDeletingId(id)
      await client.delete(`/api/uploads/${id}`)
      setImages(images.filter(i => i._id !== id && i.id !== id))
      setStatus({ type: 'success', message: 'Image deleted successfully!' })
      // Auto-dismiss status alert after 3 seconds
      setTimeout(() => setStatus(null), 3000)
    } catch (err) {
      console.error('Delete failed', err)
      setStatus({ type: 'error', message: 'Failed to delete image.' })
    } finally {
      setDeletingId(null)
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (files.length === 0) {
      setStatus({ type: 'error', message: 'Please select at least one image file to upload.' })
      return
    }
    const fd = new FormData()
    files.forEach(f => {
      fd.append('file', f)
    })
    fd.append('category', category)
    fd.append('featured', featured ? 'true' : 'false')

    try {
      setUploading(true)
      setStatus(null)
      const res = await client.post('/api/uploads', fd)
      if (!res?.data) throw new Error('Upload failed')
      setStatus({ 
        type: 'success', 
        message: files.length === 1 
          ? 'Image uploaded successfully to Cloudinary!' 
          : `Successfully uploaded ${files.length} images in bulk to Cloudinary!` 
      })
      
      // Reset inputs
      setFiles([])
      // Reset the file input DOM element manually by resetting the form
      e.target.reset()
      setFeatured(false)
      
      // Reload image database
      await loadImages()
      
      // Auto-dismiss status alert after 3 seconds
      setTimeout(() => setStatus(null), 4000)
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || err.message || 'Image upload failed.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload & Media Gallery</h1>
          <p className="text-sm text-muted-foreground">Upload services/gallery media assets to Cloudinary and manage existing files.</p>
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-xl text-sm border flex items-center gap-2.5 animate-in fade-in duration-200 ${
          status.type === 'success' 
            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
            : 'bg-destructive/10 text-destructive border-destructive/20'
        }`}>
          <div className="font-semibold">{status.message}</div>
        </div>
      )}

      {/* Styled Upload Form Card */}
      <Card className="bg-card">
        <CardContent className="p-6">
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5 text-primary" /> Select Images <span className="text-destructive">*</span></Label>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                required
                onChange={(e) => setFiles(Array.from(e.target.files))} 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5 text-primary" /> Category</Label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
              >
                <option value="services">Service Page</option>
                <option value="gallery">Events & Workshops (Gallery)</option>
                <option value="newspaper">Paper Cutouts (Media)</option>
              </select>
            </div>

            <div className="flex items-center justify-between md:justify-around gap-4 h-9">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={featured} 
                  onChange={e => setFeatured(e.target.checked)} 
                  className="rounded border-input text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                /> 
                <span>Featured</span>
              </label>
              
              <Button type="submit" disabled={uploading} className="h-9 px-6 gap-2 text-xs font-semibold shrink-0">
                {uploading ? (
                  <Loader size={12} />
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Upload Asset
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Dynamic Database Table Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" /> Existing Uploads — {category === 'services' ? 'Service Page' : category === 'newspaper' ? 'Paper Cutouts & Media' : 'Events & Workshops Gallery'}
          </h2>
          {loading && <div className="text-xs text-muted-foreground flex items-center gap-2"><Loader size={12} /> Syncing...</div>}
        </div>

        {loading && images.length === 0 ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : images.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-2xl bg-card">
            No images uploaded yet under this category.
          </div>
        ) : (
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm border-collapse text-left">
                <thead>
                  <tr className="border-b bg-muted/20 text-muted-foreground text-xs uppercase font-semibold">
                    <th className="p-4 w-24">Thumbnail</th>
                    <th className="p-4">Filename / Public ID</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {images.map(img => (
                    <tr key={img._id || img.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden border border-border shadow-sm">
                          <img src={img.url} alt={img.alt || img.title || 'upload'} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-foreground max-w-xs truncate">
                        {img.title || img.publicId || 'Untitled Upload'}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-xs">
                          {img.category || category}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={img.featured ? 'bg-emerald-600/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-600/10' : 'bg-muted text-muted-foreground hover:bg-muted'}>
                          {img.featured ? 'Featured' : 'Standard'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => window.open(img.url, '_blank')} disabled={deletingId === (img._id || img.id)}>
                            <Eye className="w-3.5 h-3.5" /> View
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive hover:text-destructive/80 gap-1" onClick={() => handleDelete(img._id || img.id)} disabled={deletingId === (img._id || img.id)}>
                            {deletingId === (img._id || img.id) ? (
                              'Deleting...'
                            ) : (
                              <>
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
