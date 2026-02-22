import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import client from '@/lib/api'

export default function AdminImages() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState(null)

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await client.post('/api/uploads', fd)
      if (!res?.data) throw new Error('Upload failed')
      setStatus({ type: 'success', message: 'Uploaded' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upload Images</h1>
      {status && <div className={`mb-4 p-2 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{status.message}</div>}
      <form onSubmit={handleUpload} className="space-y-3">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <div>
          <Button type="submit">Upload</Button>
        </div>
      </form>
    </div>
  )
}
