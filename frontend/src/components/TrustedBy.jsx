import React from 'react'
import logo1 from '../assets/1.svg'
import logo2 from '../assets/2.svg'
import logo3 from '../assets/3.svg'
import logo4 from '../assets/react.svg'

const logos = [
  { alt: 'Acme', src: logo1 },
  { alt: 'Globex', src: logo2 },
  { alt: 'Soylent', src: logo3 },
  { alt: 'React' , src: logo4}
]

export default function TrustedBy() {
  return (
    
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-center text-sm font-medium text-muted-foreground uppercase mb-6">Trusted by</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
          {logos.map((l) => (
            <div key={l.alt} className="flex items-center justify-center p-4 bg-white/5 rounded h-16">
              {/* Replace with real img or Next/Image in production */}
              <img src={l.src} alt={l.alt} className="max-h-28 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
