import React, { useEffect, useState } from 'react'
import { Star, Quote, Plus, X } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const defaultTestimonials = [
  {
    name: 'Anjali Sharma',
    content: 'The career guidance sessions at Pathfinder helped me find my true passion. The counselors are extremely knowledgeable and supportive.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    content: 'I was dealing with severe exam stress. Pathfinder provided a safe space and actionable coping strategies that literally changed my academic life.',
    rating: 5,
  },
  {
    name: 'Sneha Gupta',
    content: 'Wonderful NGO initiative! The mental health workshops they conducted in our college were eye-opening and highly interactive.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', content: '', rating: 5 })

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await apiFetch('/testimonials')
        if (res && res.testimonials) {
          setTestimonials(res.testimonials)
        }
      } catch (err) {
        console.error('Failed to load testimonials', err)
      } finally {
        setLoading(false)
      }
    }
    loadTestimonials()
  }, [])

  const items = testimonials.length ? testimonials : defaultTestimonials

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error('Please fill out all required fields.')
      return
    }
    setSubmitting(true)
    try {
      await apiFetch('/testimonials', {
        method: 'POST',
        data: formData,
      })
      toast.success('Testimonial submitted successfully! It will be visible once approved by an admin.')
      setFormData({ name: '', content: '', rating: 5 })
      setModalOpen(false)
    } catch (err) {
      toast.error(err.message || 'Failed to submit testimonial.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-20 relative bg-muted/20 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 items-center md:items-start">
          <div className="text-center md:text-left w-full md:w-auto">
            <span className="text-sm font-semibold tracking-wider text-primary uppercase block text-center md:text-left">Testimonials</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground text-center md:text-left">
              What People Say About Us
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto md:mx-0 text-center md:text-left">
              Hear from students, professionals, and parents who have experienced counseling and mentorship at Pathfinder.
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="w-fit gap-2 self-center md:self-auto shrink-0">
            <Plus className="w-4 h-4" /> Share Your Story
          </Button>
        </div>

        <div className="w-full">
          <Carousel
            plugins={[
              Autoplay({
                delay: 3500,
                stopOnInteraction: false,
              }),
            ]}
            opts={{ align: 'start', loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {items.map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-card hover:border-primary/30 transition-colors duration-300 text-left">
                    <CardContent className="p-6 flex flex-col justify-between h-full gap-6">
                      <div className="space-y-4">
                        <div className="flex gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < item.rating ? 'fill-current' : 'text-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                        <Quote className="w-8 h-8 text-primary/10 stroke-[1.5]" />
                        <p className="text-sm text-foreground/80 leading-relaxed italic">
                          "{item.content}"
                        </p>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">Beneficiary</div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Share Testimonial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-card rounded-2xl border shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Write a Testimonial</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setModalOpen(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="t-name">Your Name</Label>
                <Input
                  id="t-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 hover:scale-110 transition-transform text-amber-500"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating ? 'fill-current' : 'text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="t-content">Your Review</Label>
                <Textarea
                  id="t-content"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tell us about your experience..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
