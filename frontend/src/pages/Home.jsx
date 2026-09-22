import React, { useEffect, useState } from 'react'
import SEO from '@/components/SEO'
import Hero from '@/components/Hero'

import ServicesPreview from '@/components/ServicesPreview'
import Gallery from '@/components/Gallery'
import MagazineShelf from '@/components/MagazineShelf'
import Stats from '@/components/Stats'
import TestimonialsSection from '@/components/TestimonialsSection'
import FAQ from '@/components/FAQ'
import { apiFetch } from '@/lib/api'
import client from '@/lib/api'
import Loader from '@/components/ui/loader'
import fallbackImg1 from '@/assets/1.webp'
import fallbackImg2 from '@/assets/2.webp'
import fallbackImg3 from '@/assets/3.webp'
import fallbackImg4 from '@/assets/4.webp'
import fallbackDrPkd from '@/assets/drpkdwivedi.jpg'
import fallbackSandhya from '@/assets/sandhya.webp'
import fallbackGargi from '@/assets/gargi.webp'
import fallbackUrvassi from '@/assets/urvassi.webp'

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
      <SEO
        title="Best NGO & Psychologist in Lucknow"
        description="Pathfinder is a Lucknow-based NGO offering psychological counselling, career guidance and mental wellness workshops for students and families. Led by Dr. Sandhya Dwivedi. Book a session today."
        keywords="psychologist in Lucknow, NGO in Lucknow, best NGO in Lucknow, counselling in Lucknow, career counselling Lucknow, mental health NGO Lucknow, Dr. Sandhya Dwivedi, Pathfinder"
        canonicalUrl="https://pathfinderlko.org/"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { question: 'What counseling services does Pathfinder provide?', answer: 'Pathfinder provides professional mental health counseling, career guidance, stress management workshops, and student academic mentorship. We address issues ranging from anxiety and depression to career confusion and personal growth.' },
            { question: 'Who are the counselors at Pathfinder?', answer: 'Our counseling team is led by senior experts like Dr. Sandhya Dwivedi alongside certified, compassionate psychological counselors and career mentors dedicated to providing non-judgmental support.' },
            { question: 'Are sessions free or paid?', answer: 'As an NGO-led initiative in Lucknow, we prioritize accessibility. We offer subsidized and free counseling sessions for students and individuals from economically weaker backgrounds, alongside premium consultation services to sustain our outreach.' },
            { question: 'How do I book an appointment?', answer: 'You can book an appointment easily by clicking the "Book Appointment" buttons across the website or visiting the /appointments page. Fill in your details and select a convenient slot, and our team will get in touch to confirm.' },
            { question: 'Do you offer online or offline sessions?', answer: 'We offer both options. You can attend in-person sessions at our counseling center in Lucknow, or opt for convenient, confidential online audio/video sessions from the comfort of your home.' },
            { question: 'Is my information kept confidential?', answer: 'Absolutely. Privacy and confidentiality are foundational to Pathfinder. All conversation records, assessment results, and personal information are strictly protected and never shared without your explicit consent.' },
          ].map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        }}
      />
      <Hero />

      <ServicesPreview />
      
      <Stats />

      {galleryLoading ? (
        <section className="max-w-7xl mx-auto px-4 py-12 flex justify-center"><Loader /></section>
      ) : (
        <Gallery images={galleryImages.length ? galleryImages : [
          fallbackImg1,
          fallbackImg2,
          fallbackImg3,
          fallbackImg4,
          fallbackDrPkd,
          fallbackSandhya,
          fallbackGargi,
          fallbackUrvassi,
        ]} />
      )}

      <TestimonialsSection />

      <MagazineShelf magazines={magazines} />

      <FAQ />
    </div>
  )
}
