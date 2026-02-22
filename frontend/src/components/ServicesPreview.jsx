import React from 'react'
import { Button } from '@/components/ui/button'

const icons = {
  'Psychological Counselling': (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v2M9 5v2M15 5v2M4 12h16M6 19h12" />
    </svg>
  ),
  'Career Counselling': (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2l7 4v6c0 5-7 10-7 10S5 17 5 12V6l7-4z" />
    </svg>
  ),
  'Personality Development': (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v6M5 8l7 14 7-14" />
    </svg>
  ),
  'Workshops & Seminars': (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7h18M12 3v18M5 21h14" />
    </svg>
  ),
  'Family & Online Counselling': (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 12a4 4 0 100-8 4 4 0 000 8zm6 8v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    </svg>
  ),
  'Assessment & Testing': (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 11h6M9 15h6M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
}

const services = [
  {
    title: 'Psychological Counselling',
    desc: 'One-on-one counselling for mental wellness and emotional support.',
  },
  {
    title: 'Career Counselling',
    desc: 'Help choosing academic streams and planning careers after study.',
  },
  {
    title: 'Personality Development',
    desc: 'Training to build confidence, communication, and soft skills.',
  },
  {
    title: 'Workshops & Seminars',
    desc: 'Workshops on careers, personality, social issues, and gender sensitization.',
  },
  {
    title: 'Family & Online Counselling',
    desc: 'Family therapy and secure online counselling sessions.',
  },
  {
    title: 'Assessment & Testing',
    desc: 'Psychological assessment and standardized testing for tailored recommendations.',
  },
]

export default function ServicesPreview() {
  return (
    <section className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="p-6 bg-card rounded-lg shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">{icons[s.title]}</span>
                <h4 className="text-lg font-semibold">{s.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
            </div>
            <div className="mt-4">
              <Button size="sm" variant="outline" onClick={() => window.location.href = '/services'}>See services</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
