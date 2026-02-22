import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import client from '@/lib/api'
import Loader from '@/components/ui/loader'

export default function AdminImages() {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('services')
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  async function loadImages() {
    setLoading(true)
    try {
      const res = await client.get(`/api/uploads?category=${encodeURIComponent(category)}`)
      setImages(res.data && res.data.uploads ? res.data.uploads : [])
      setFetched(true)
    } catch (err) {
      console.error('Failed to load images', err)
      setStatus({ type: 'error', message: 'Failed to load images' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this image?')) return
    try {
      setDeletingId(id)
      await client.delete(`/api/uploads/${id}`)
      setImages(images.filter(i => i._id !== id && i.id !== id))
      setStatus({ type: 'success', message: 'Deleted' })
    } catch (err) {
      console.error('Delete failed', err)
      setStatus({ type: 'error', message: 'Delete failed' })
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a file' })
      return
    }
    const fd = new FormData()
    fd.append('file', file)
    fd.append('category', category)
    fd.append('featured', featured ? 'true' : 'false')

    try {
      setUploading(true)
      const res = await client.post('/api/uploads', fd)
      if (!res?.data) throw new Error('Upload failed')
      setStatus({ type: 'success', message: 'Uploaded' })
      setFile(null)
      setCategory('services')
      setFeatured(false)
      await loadImages()
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Upload failed' })
    }
      setUploading(false)
  }


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upload Images</h1>
      {status && <div className={`mb-4 p-2 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{status.message}</div>}
      <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
        <form onSubmit={handleUpload} className="space-y-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm">Select image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="p-1 border rounded">
              <option value="services">Service Page</option>
              <option value="gallery">Gallery</option>
            </select>
            <label className="flex items-center gap-2 ml-4">
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} /> Featured
            </label>
            <div className="ml-auto">
              <Button type="button" onClick={loadImages} variant="ghost" disabled={loading}> 
                {loading ? <span className="flex items-center gap-2"><Loader size={14} /> Loading</span> : 'Fetch Images'}
              </Button>
            </div>
          </div>

          <div>
            <Button type="submit" disabled={uploading}>
              {uploading ? <span className="flex items-center gap-2"><Loader size={14} /> Uploading</span> : 'Upload'}
            </Button>
          </div>
        </form>
      </div>

      {fetched && images.length > 0 && (
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-3">Images — {category}</h3>
          {loading ? (
            <div className="flex items-center gap-2"><Loader /> Loading…</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img._id || img.id} className="border rounded p-2">
                  <div className="h-36 overflow-hidden mb-2">
                    <img src={img.url} alt={img.alt || img.title || 'upload'} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm truncate">{img.title || img.publicId || ''}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(img.url, '_blank')} disabled={deletingId === img._id || deletingId === img.id}>Open</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(img._id || img.id)} disabled={deletingId === img._id || deletingId === img.id}>
                        {deletingId === img._id || deletingId === img.id ? <span className="flex items-center gap-2"><Loader size={12} /> Deleting</span> : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
