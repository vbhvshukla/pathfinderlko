import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MagazineShelf({ magazines = [] }) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(null)
  const [pdfSrc, setPdfSrc] = useState(null)
  const [pdfLoaded, setPdfLoaded] = useState(false)
  const iframeRef = useRef(null)

  async function openReader(mag) {
    setCurrent(mag)
    console.log('Opening reader for magazine', mag)
    setOpen(true)
    try {
      if (!mag.pdfUrl) throw new Error('No pdfUrl available')
      
      const direct = mag.pdfUrl
      const res = await axios.get(direct, { responseType: 'blob', withCredentials: false })
      const contentType = res.headers['content-type'] || 'application/pdf'
      const blob = new Blob([res.data], { type: contentType })
      if (/html|text/i.test(contentType)) throw new Error('Non-PDF response')
      const objectUrl = URL.createObjectURL(blob)
      setPdfSrc(objectUrl)
    } catch (err) {
      console.error('Failed to load PDF for reader via pdfUrl', err)
      setPdfSrc(null)
    }
  }

  async function downloadPdf(mag) {
    try {
      if (!mag.pdfUrl) throw new Error('No pdfUrl available')
      const direct = mag.pdfUrl
      const res = await axios.get(direct, { responseType: 'blob', withCredentials: false })
      const contentType = res.headers['content-type'] || 'application/pdf'
      if (/html|text/i.test(contentType)) throw new Error('Non-PDF response')
      const blob = new Blob([res.data], { type: 'application/pdf' })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safe = (mag.title || 'magazine').replace(/[^a-z0-9\.\-\_ ]/gi, '_')
      a.download = `${safe}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (err) {
      console.error('Download failed via pdfUrl', err)
    }
  }

  function closeReader() {
    setOpen(false)
    setCurrent(null)
    if (pdfSrc) {
      try { URL.revokeObjectURL(pdfSrc) } catch (e) {}
      setPdfSrc(null)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Latest Magazines</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {magazines.map((m, idx) => (
          <Card key={idx} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">{m.title}</CardTitle>
              <CardDescription className="text-sm">{m.date}</CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="h-48 bg-muted overflow-hidden">
                <img
                  src={m.cover}
                  alt={m.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openReader(m)}>
                  Read
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadPdf(m)} className="no-underline">Download</Button>
              </div>
              <div className="text-sm text-muted">{m.pages ? `${m.pages} pages` : ''}</div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {open && current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={closeReader} />
          <div className="relative w-full max-w-4xl h-[80vh] bg-background rounded shadow-lg overflow-hidden z-10">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div>
                <div className="font-semibold">{current.title}</div>
                <div className="text-sm text-muted">{current.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => downloadPdf(current)}>Download</Button>
                <Button size="sm" onClick={closeReader}>Close</Button>
              </div>
            </div>

            <div className="w-full h-full">
              {pdfSrc ? (
                <div className="w-full h-full">
                  <iframe
                    ref={iframeRef}
                    src={pdfSrc}
                    title={current.title}
                    className="w-full h-full"
                    onLoad={() => { console.log('iframe loaded'); setPdfLoaded(true) }}
                  />
                  <div className="absolute top-3 right-3 z-20">
                    <a href={pdfSrc} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">Open in new tab</a>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">Loading…</div>
              )}
              {!pdfLoaded && pdfSrc && (
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-8 bg-yellow-50 text-yellow-800 px-3 py-1 rounded">If the PDF doesn't render, click "Open in new tab".</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
