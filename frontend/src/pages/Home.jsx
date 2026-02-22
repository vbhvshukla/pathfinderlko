import React, { useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import TrustedBy from '@/components/TrustedBy'
import ServicesPreview from '@/components/ServicesPreview'
import Gallery from '@/components/Gallery'
import MagazineShelf from '@/components/MagazineShelf'
import { apiFetch } from '@/lib/api'
import client from '@/lib/api'
import Loader from '@/components/ui/loader'

export default function Home() {
  const [magazines, setMagazines] = useState([])
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryLoading, setGalleryLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await apiFetch('/magazines')
        const mags = (res && res.magazines) || []
        const mapped = mags.map(m => ({
          _id: m._id,
          id: m._id,
          title: m.title,
          cover: m.imageUrl || m.cover,
          pdfUrl: m.downloadUrl || m.pdfUrl,
          date: m.publishedAt ? new Date(m.publishedAt).toLocaleDateString() : '',
          pages: m.pages,
        }))
        if (mounted) setMagazines(mapped)
      } catch (e) {
        console.error('Failed to load magazines', e)
      }
    }
    load()
    // load gallery images
    let mountedGallery = true
    async function loadGallery() {
      setGalleryLoading(true)
      try {
        const res = await client.get(`/api/uploads?category=${encodeURIComponent('gallery')}`)
        const uploads = (res && res.data && res.data.uploads) || []
        const urls = uploads.map(u => u.url).filter(Boolean).slice(0, 8)
        if (mountedGallery) setGalleryImages(urls)
      } catch (err) {
        console.error('Failed to load gallery images', err)
      } finally {
        setGalleryLoading(false)
      }
    }
    loadGallery()
    return () => { mounted = false }
  }, [])
  return (
    <div className="bg-background text-foreground">
      <Hero />
      <TrustedBy />
      <ServicesPreview />

      {galleryLoading ? (
        <section className="max-w-7xl mx-auto px-4 py-12 flex justify-center"><Loader /></section>
      ) : (
        <Gallery images={galleryImages.length ? galleryImages : [
          '/src/assets/1.jpg',
          '/src/assets/2.jpg',
          '/src/assets/3.jpg',
          '/src/assets/4.jpg',
          '/src/assets/drpkdwivedi.jpg',
          '/src/assets/anmol.png',
          '/src/assets/gargi.png',
          '/src/assets/urvassi.png',
        ]} />
      )}

      <MagazineShelf magazines={magazines} />

      {/* <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">More</h2>
        <p className="text-muted mb-6">Additional homepage content will be added here.</p>
      </section> */}

    </div>
  )
}
