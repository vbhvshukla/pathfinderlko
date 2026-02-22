import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'
import axios from 'axios'
import Loader from '@/components/ui/loader'

export default function AdminMagazines() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [featured, setFeatured] = useState(false)
  const [publishedAt, setPublishedAt] = useState('')
  const [status, setStatus] = useState(null)
  const [mags, setMags] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [openingId, setOpeningId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => { loadList() }, [])

  async function loadList() {
    setLoading(true)
    try {
      const res = await apiFetch('/magazines')
      setMags(res.magazines || [])
    } catch (e) {
      console.error('Failed to load magazines', e)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!title) {
      setStatus({ type: 'error', message: 'Provide a title' })
      return
    }

    try {
      setUploading(true)
      let res
      if (!file) {
        setStatus({ type: 'error', message: 'Please upload a PDF file' })
        return
      }
      if (!coverFile) {
        setStatus({ type: 'error', message: 'Please upload a cover image' })
        return
      }
      const fd = new FormData()
      fd.append('file', file)
      if (coverFile) fd.append('cover', coverFile)
      fd.append('title', title)
      if (featured) fd.append('featured', 'true')
      if (publishedAt) fd.append('publishedAt', publishedAt)
      res = await apiFetch('/magazines', { method: 'POST', data: fd })

      setStatus({ type: 'success', message: 'Magazine created' })
      setTitle('')
      setFile(null)
      setCoverFile(null)
      setFeatured(false)
      setPublishedAt('')
      await loadList()
    } catch (err) {
      console.error(err)
      setStatus({ type: 'error', message: err?.message || 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  async function openPdf(m) {
    try {
      setStatus(null)
      setOpeningId(m._id || m.id)
      // Always use backend proxy to avoid CORS when the download URL is on Cloudinary
      const url = `/api/magazines/${m._id}/download`
      const res = await axios.get(url, { responseType: 'blob', withCredentials: true })
      const contentType = res.headers['content-type'] || 'application/pdf'
      const blob = new Blob([res.data], { type: contentType })
      // If we get HTML (e.g. an auth redirect or error page) show a helpful message
      if (/html|text/i.test(contentType)) {
        const text = await blob.text()
        console.error('Expected PDF but received HTML/text response when fetching PDF:', text)
        setStatus({ type: 'error', message: 'Failed to open PDF (received non-PDF response)' })
        return
      }
      const blobUrl = URL.createObjectURL(blob)
      window.open(blobUrl, '_blank', 'noopener,noreferrer')
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
      setOpeningId(null)
    } catch (err) {
      console.error('Failed to fetch PDF', err)
      setStatus({ type: 'error', message: 'Failed to open PDF' })
      setOpeningId(null)
    }
  }

  async function handleDelete(m) {
    const id = m._id || m.id
    if (!id) return
    if (!window.confirm(`Delete magazine "${m.title}"? This action cannot be undone.`)) return
    try {
      setDeletingId(id)
      setStatus(null)
      await apiFetch(`/magazines/${id}`, { method: 'DELETE' })
      setStatus({ type: 'success', message: 'Magazine deleted' })
      await loadList()
    } catch (err) {
      console.error('Failed to delete magazine', err)
      setStatus({ type: 'error', message: err?.message || 'Delete failed' })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="text-left">
      <h1 className="text-2xl font-bold mb-4">Magazines</h1>
      {status && <div className={`mb-4 p-2 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{status.message}</div>}

      <div className="mb-6">
        <div className="bg-white border rounded-lg shadow-sm p-6 text-left">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Create Magazine</h3>
            <p className="text-sm text-muted">Upload a PDF and a cover image.</p>
          </div>
          <form onSubmit={handleUpload} className="space-y-3 mb-6">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Magazine title" className="w-full p-2 border rounded" />
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <div className="flex items-start sm:items-center gap-2 w-full sm:w-auto">
                    <label className="text-sm">PDF file</label>
                    <input required type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="border rounded px-2 py-1" />
                  </div>
                  <div className="flex items-start sm:items-center gap-2 w-full sm:w-auto">
                    <label className="text-sm">Cover image</label>
                    <input required type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className="border rounded px-2 py-1" />
                  </div>
                  <div className="text-sm text-muted self-center">Both required</div>
                </div>
            </div>
        

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} /> Featured</label>
          <label className="flex items-center gap-2">Published at: <input type="date" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} className="p-1 border rounded ml-2" /></label>
        </div>

        <div>
          <Button type="submit" disabled={uploading}>{uploading ? <span className="flex items-center gap-2"><Loader size={14} /> Creating</span> : 'Create Magazine'}</Button>
        </div>
      </form>

        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Existing Magazines</h2>
      {loading ? (
        <div className="flex items-center gap-2"><Loader /> Loading…</div>
      ) : mags.length === 0 ? (
        <div className="text-muted">No magazines yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mags.map(m => (
            <div key={m._id || m.id} className="p-3 border rounded flex gap-4 items-start">
              <div className="w-24 h-32 bg-muted rounded overflow-hidden">
                  {m.imageUrl ? <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" /> : null}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{m.title}</div>
                <div className="text-sm text-muted">{m.publishedAt ? new Date(m.publishedAt).toLocaleDateString() : ''} {m.featured ? ' • Featured' : ''}</div>
                <div className="mt-2 flex gap-2">
                    {(m._id || m.id) && (
                      <button type="button" onClick={() => openPdf(m)} className="text-sm text-primary underline">
                        Open PDF
                      </button>
                    )}
                    <button type="button" onClick={() => handleDelete(m)} disabled={deletingId === (m._id || m.id)} className="text-sm text-red-600 underline">
                      {deletingId === (m._id || m.id) ? <span className="flex items-center gap-2"><Loader size={12} /> Deleting</span> : 'Delete'}
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
