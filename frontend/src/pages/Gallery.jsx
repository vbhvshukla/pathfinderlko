import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Image as ImageIcon, Camera, Newspaper, ChevronLeft, ChevronRight, X, Maximize2, Download, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import client from '@/lib/api'
import Loader from '@/components/ui/loader'
import { Skeleton } from '@/components/ui/skeleton'

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('events') // 'events' or 'newspaper'
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Fetch images based on the active tab category
  useEffect(() => {
    async function loadGalleryImages() {
      setLoading(true)
      try {
        // 'events' category translates to backend uploads category 'gallery'
        // 'newspaper' category translates to backend uploads category 'newspaper'
        const categoryQuery = activeTab === 'events' ? 'gallery' : 'newspaper'
        const res = await client.get(`/api/uploads?category=${categoryQuery}`)
        setImages(res.data && res.data.uploads ? res.data.uploads : [])
      } catch (err) {
        console.error('Failed to load gallery images', err)
      } finally {
        setLoading(false)
      }
    }
    loadGalleryImages()
  }, [activeTab])

  // Handlers for Lightbox Navigation
  const handlePrevImage = (e) => {
    e.stopPropagation()
    if (!images.length) return
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    if (!images.length) return
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground flex items-center justify-center gap-3">
          <ImageIcon className="w-8 h-8 md:w-10 md:h-10 text-primary shrink-0" />
          Media & Gallery
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Explore captured moments of our social impact drives, volunteer seminars, and press media print highlights in Lucknow.
        </p>
      </div>

      {/* Tabs Switcher Grid */}
      <div className="flex justify-center border-b pb-4">
        <div className="flex gap-2 bg-muted p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('events')}
            className={`text-sm font-semibold px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'events' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Camera className="w-4 h-4" />
            Events & Workshops
          </button>
          <button
            onClick={() => setActiveTab('newspaper')}
            className={`text-sm font-semibold px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'newspaper' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            Paper Cutouts & Press
          </button>
        </div>
      </div>

      {/* Media Grid Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
              <Skeleton className="w-2/3 h-4 rounded" />
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-3xl bg-card space-y-3 max-w-md mx-auto">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-foreground text-lg">No Images Uploaded</h3>
          <p className="text-muted-foreground text-sm">
            There are no media images uploaded under the "{activeTab === 'events' ? 'Events & Workshops' : 'Paper Cutouts'}" folder yet.
          </p>
          {/* Admin link helper */}
          <div className="pt-2">
            <Button size="sm" asChild>
              <Link to="/admin/images">Manage Media Uploads</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <Card 
              key={img._id || img.id} 
              onClick={() => setLightboxIndex(idx)}
              className="cursor-pointer overflow-hidden border border-border/80 hover:border-primary/30 hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img 
                  src={img.url} 
                  alt={img.alt || img.title || 'gallery-image'} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  loading="lazy"
                />
                
                {/* Category Badge Overlay */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="secondary" className="bg-background/85 backdrop-blur-md text-foreground text-[10px] font-semibold px-2 py-0.5 shadow-sm border border-border/40 select-none">
                    {activeTab === 'events' ? 'Volunteer Event' : 'Press Media Print'}
                  </Badge>
                </div>
                
                {/* Featured Badge Overlay */}
                {img.featured && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 shadow-md border-none select-none">
                      ★ Featured
                    </Badge>
                  </div>
                )}
                
                {/* Elegant Hover Overlay with Zoom Icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white gap-2 font-bold text-xs backdrop-blur-[2px]">
                  <span className="bg-primary/95 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" /> Expand View
                  </span>
                </div>
              </div>


            </Card>
          ))}
        </div>
      )}

      {/* FULL-SCREEN PREMIUM LIGHTBOX SLIDESHOW */}
      {lightboxIndex !== null && images.length > 0 && (
        <div 
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          {/* Lightbox Top Header Panel */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
            <div className="text-sm font-semibold tracking-wider flex items-center gap-2">
              <span>{activeTab === 'events' ? '📸 Event Drive Gallery' : '📰 Scanned Paper Cutout'}</span>
              <span className="text-white/40 font-normal">({lightboxIndex + 1} / {images.length})</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(images[lightboxIndex].url, '_blank')
                }}
                className="text-white hover:bg-white/10"
                title="Open in new window"
              >
                <ExternalLink className="w-5 h-5" />
              </Button>
              
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(images[lightboxIndex].url, '_blank')
                }}
                className="text-white hover:bg-white/10"
                title="Download High-Res"
              >
                <Download className="w-5 h-5" />
              </Button>

              <button 
                onClick={() => setLightboxIndex(null)} 
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Left Navigation Arrow */}
          <button 
            onClick={handlePrevImage}
            className="absolute left-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white z-20 transition"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Centered Image Showcase */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[85vw] max-h-[80vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-200"
          >
            <img 
              src={images[lightboxIndex].url} 
              alt={`lightbox-${lightboxIndex}`} 
              className="w-full h-full object-contain rounded-xl border border-white/10 shadow-2xl"
            />
            {images[lightboxIndex].title && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur px-4 py-2.5 rounded-lg border border-white/5 text-center text-white text-xs md:text-sm">
                {images[lightboxIndex].title}
              </div>
            )}
          </div>

          {/* Right Navigation Arrow */}
          <button 
            onClick={handleNextImage}
            className="absolute right-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white z-20 transition"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </main>
  )
}
