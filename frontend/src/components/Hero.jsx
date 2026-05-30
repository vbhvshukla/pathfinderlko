import React from 'react'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem} from '@/components/ui/carousel'
import img1 from '../assets/1.jpg'
import img2 from '../assets/2.jpg'
import img3 from '../assets/3.jpg'
import Autoplay from "embla-carousel-autoplay"
import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { t } = useTranslation()
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-accent/30 -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{t('hero_title')}</h1>
            <p className="text-lg text-gray-700 mb-6">{t('hero_sub')}</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Button onClick={() => window.location.href = '/appointments'}>{t('hero_cta_book')}</Button>
              <Button variant="outline" onClick={() => window.location.href = '/services'}>{t('hero_cta_about')}</Button>
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center md:text-left">Quick contact: <a href="mailto:info@pathfinderlko.in" className="underline">info@pathfinderlko.in</a> • <a href="tel:+919794940394" className="underline">+91 97949 40394</a></p>
          </div>
          <div className="hidden md:block">
            <Carousel className="w-full" plugins={[Autoplay({delay: 2000})]}>
              <CarouselContent className="h-64">
                <CarouselItem>
                  <div className="w-full h-64 bg-card rounded-lg shadow-lg overflow-hidden">
                    <img src={img1} alt="slide 1" className="w-full h-full object-cover" />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="w-full h-64 bg-card rounded-lg shadow-lg overflow-hidden">
                    <img src={img2} alt="slide 2" className="w-full h-full object-cover" />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="w-full h-64 bg-card rounded-lg shadow-lg overflow-hidden">
                    <img src={img3} alt="slide 3" className="w-full h-full object-cover" />
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}
