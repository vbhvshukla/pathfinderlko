import React, { useState } from 'react'
import {
  Compass,
  Target,
  HeartPulse,
  Brain,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'

import sandhya from '../assets/sandhya.png'
import drpkd from '../assets/drpkd.png'
import gargi from '../assets/gargi.png'
import urvashi from '../assets/urvassi.png'
import vaibhav from '../assets/vaibhav.png'



const TIMELINE = [
  {
    year: '2011',
    title: 'NGO Inception',
    desc: 'Registered under the Society Registration Act 1860 under Brigupyari Seva Samiti, starting our mental health advocacy in Lucknow.'
  },
  {
    year: '2016',
    title: 'Counselling Center Open',
    desc: 'Inaugurated our specialized physical center in Lucknow, providing psychological assessments and stream selection resources to local schools.'
  },
  {
    year: '2020',
    title: 'Digital Pivot & Covid Support',
    desc: 'Expanded our services online to combat isolation, offering secure, remote one-on-one video counselling sessions and emergency anxiety hotlines.'
  },
  {
    year: '2026',
    title: 'Pathfinder Portal Launch',
    desc: 'Released our modern digital application allowing dynamic appointments booking, free self-assessment testing, and magazine sharing.'
  }
]

const PILLARS = [
  {
    icon: Brain,
    title: 'Psychological Wellness',
    desc: 'Providing scientific, evidence-based therapy and counselling to address anxiety, stress, depression, and personal struggles in a safe, non-judgmental environment.'
  },
  {
    icon: Compass,
    title: 'Career & Stream Selection',
    desc: 'Utilizing standardized testing, personal mapping, and expert mentoring to align students with their natural strengths and upcoming industry trends.'
  },
  {
    icon: Users,
    title: 'Community Empowerment',
    desc: 'Hosting workshops and open outreach sessions in Lucknow schools and colleges to tackle gender sensitization, social stigma, and study burnout.'
  }
]

const TEAM = [
  {
    name: 'Dr. Sandhya Dwivedi',
    role: 'Director | Chief Psychologist',
    qualifications: 'P.G.(Psy), PGDPC, MCA, Ph.D.',
    bio: 'Dedicated counselling psychologist with over 20 years of experience helping individuals resolve emotional conflicts and clear career confusion.',
    img: sandhya,
  },
  {
    name: 'Prof. (Dr.) P.K. Dwivedi',
    role: 'Managing Director',
    qualifications: 'Ph.D. Mathematics',
    bio: 'A passionate academician and administrator who oversees the program logistics and educational outreach camps across Lucknow schools.',
    img: drpkd,
  },
  {
    name: 'Ms. Gargi Dwivedi',
    role: 'Content Writer | Software Analyst',
    qualifications: 'Tech Analyst & Writer',
    bio: 'Ensures that Pathfinder’s digital contents, self-assessments, and mental health tools remain accurate, approachable, and highly secure.',
    img: gargi,
  },
  {
    name: 'Ms. Urvashi',
    role: 'Program Manager',
    qualifications: 'SDE | Pathfinder Operations',
    bio: 'Supervises coordination between schools, colleges, and local corporate groups to organize impactful workshops and student outreach camps.',
    img: urvashi,
  },
  {
    name: 'Mr. Vaibhav Shukla',
    role: 'IT & Infrastructure Lead',
    qualifications: 'Software Developer',
    bio: 'Architected and maintains Pathfinder’s digital assets, appointment infrastructure, and online self-assessment portals.',
    img: vaibhav,
  }
]

export default function About() {
  const [activeTab, setActiveTab] = useState('mission')

  const tabContents = {
    mission: {
      title: 'Our Mission',
      badge: 'Transforming Lives',
      text: 'To illuminate the path of psychological wellness and career direction for students, professionals, and families. We believe that professional, compassionate guidance is a right, not a privilege, and we dedicate our resources to bridging societal gaps in mental health awareness and career clarity.',
      bullets: [
        'Accessible subsidized & free outreach counselling for the underprivileged.',
        'Scientific assessment frameworks with certified psychologists.',
        'Continuous community training and student guidance workshops.'
      ]
    },
    vision: {
      title: 'Our Vision',
      badge: 'A Healthier Society',
      text: 'To build a progressive society where seeking mental health support is completely destigmatized and every young student has access to tailored mentorship. We envision Lucknow and surrounding regions as thriving centers of mental resilience and empowered academic excellence.',
      bullets: [
        'A comprehensive grid of local mental health emergency advisors.',
        'Destigmatizing psychological services through continuous local awareness.',
        'Robust digital tools that bring quality therapy to remote rural students.'
      ]
    },
    values: {
      title: 'Core Values',
      badge: 'Built on Trust',
      text: 'Our operations and services are anchored on strict professional standards and human values. We treat every voice with utmost respect and keep client information absolute, safe, and confidential.',
      bullets: [
        'Absolute Confidentiality: Secure and private consultations.',
        'Empathetic Approach: Compassionate, non-judgmental environments.',
        'Scientific Integrity: Evidence-based therapy and assessment tools.'
      ]
    }
  }

  const currentTab = tabContents[activeTab]

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-20 left-10 w-[40vw] h-[40vw] bg-sky-500/5 rounded-full filter blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-[45vw] h-[45vw] bg-primary/5 rounded-full filter blur-3xl pointer-events-none animate-pulse"></div>

      {/* Hero Banner Section */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto text-center space-y-6">
        <Badge variant="outline" className="px-3.5 py-1.5 border-primary/20 text-primary bg-primary/5 text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Our Mission & Journey
        </Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-[1.1] text-foreground">
          Empowering Minds,{' '}
          <span className="bg-gradient-to-r from-sky-600 via-primary to-indigo-600 bg-clip-text text-transparent">
            Shaping Futures
          </span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Operating under the aegis of Brigupyari Seva Samiti, Pathfinder is dedicated to promoting mental wellness, stream/career clarity, and personality development for individuals of all ages in Lucknow.
        </p>


      </section>

      {/* Mission, Vision, Values - Interactive Tabs */}
      <section className="py-16 bg-muted/20 border-y relative">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          {/* Tab buttons */}
          <div className="flex justify-center border-b pb-2">
            <div className="flex gap-2 bg-muted/60 p-1.5 rounded-xl border">
              {Object.keys(tabContents).map((tabKey) => (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`text-sm font-semibold px-6 py-2.5 rounded-lg transition-all capitalize ${activeTab === tabKey
                      ? 'bg-card text-primary shadow border'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {tabKey === 'values' ? 'Core Values' : `Our ${tabKey}`}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Content Card */}
          <div className="grid md:grid-cols-5 gap-8 items-center bg-card/40 backdrop-blur-sm border p-8 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300 min-h-[300px]">
            <div className="md:col-span-3 space-y-4 text-left">
              <Badge className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/5">{currentTab.badge}</Badge>
              <h2 className="text-2xl font-bold text-foreground">{currentTab.title}</h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify">
                {currentTab.text}
              </p>
            </div>
            <div className="md:col-span-2 space-y-3 bg-muted/30 p-5 rounded-xl border text-left">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">Key Aspects</h3>
              {currentTab.bullets.map((bullet, idx) => (
                <div key={idx} className="flex gap-2.5 text-sm items-start text-foreground/90">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars / Scope Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-xs font-semibold uppercase">Our Pillars</Badge>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">How Pathfinder Helps</h2>
          <p className="text-muted-foreground text-sm">We provide tailored intervention programs addressing mental wellness, career routing, and soft skills.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div
                key={idx}
                className="group relative bg-card hover:bg-card/90 border hover:border-primary/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4 text-left">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-snug">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify">{pillar.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Chronological Visual Timeline */}
      <section className="py-20 bg-muted/10 border-y relative">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-xs font-semibold uppercase">Our Legacy</Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">Pathfinder History Timeline</h2>
            <p className="text-muted-foreground text-sm">Our growth from a local Seva Samiti initiative in 2011 to a thriving counseling portal.</p>
          </div>

          <div className="relative border-l-2 border-primary/20 ml-4 md:ml-0 md:left-1/2 space-y-8 md:space-y-12">
            {TIMELINE.map((time, idx) => (
              <div key={idx} className="relative pl-8 md:pl-0 md:w-1/2 group">
                {/* Visual Timeline Dot */}
                <div className="absolute top-1.5 -left-[9px] md:group-hover:scale-125 w-4.5 h-4.5 rounded-full border-2 border-primary bg-background flex items-center justify-center z-10 transition-transform duration-300">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                </div>

                {/* Alternating Card layout for Desktop */}
                <div className={`md:max-w-md ${idx % 2 === 0 ? 'md:-translate-x-[108%] md:text-right' : 'md:translate-x-[8%] md:text-left'} text-left`}>
                  <div className="p-6 bg-card border rounded-2xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300">
                    <div className="text-sm font-bold text-primary flex items-center gap-1.5 justify-start md:justify-normal">
                      <Calendar className="w-4 h-4" /> {time.year}
                    </div>
                    <h3 className="text-base font-bold text-foreground mt-1.5 leading-snug">{time.title}</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed text-justify md:text-inherit">{time.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rebuilt Team Showcase Carousel */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-12 text-center relative">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-xs font-semibold uppercase">The Experts</Badge>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">Meet Our Dedicated Team</h2>
          <p className="text-muted-foreground text-sm">Professional certified counselors, writers, and software architects working collaboratively.</p>
        </div>

        <div className="px-6 md:px-12">
          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent className="items-stretch">
              {TEAM.map((member, idx) => (
                <CarouselItem key={idx} className="sm:basis-1/2 lg:basis-1/3 p-4 flex">
                  <div className="bg-card hover:bg-card/90 border hover:border-primary/30 transition-all duration-300 rounded-2xl shadow-sm overflow-hidden group flex flex-col justify-between h-full hover:-translate-y-1 flex-1">
                    <div className="flex flex-col">
                      <div className="w-full h-80 overflow-hidden relative bg-muted flex-none">
                        <img
                          src={member.img}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 text-left">
                          <h3 className="text-lg font-bold text-white leading-tight">{member.name}</h3>
                          <Badge variant="outline" className="mt-1 bg-primary/20 text-white border-white/20 hover:bg-primary/20 text-[10px] uppercase font-semibold">
                            {member.qualifications.split('|')[0] || member.qualifications}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-5 text-left space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-primary uppercase tracking-wider">{member.role}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed italic mt-2">"{member.bio}"</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-12 bg-background border border-primary/25 text-primary hover:bg-primary/5" />
            <CarouselNext className="-right-4 md:-right-12 bg-background border border-primary/25 text-primary hover:bg-primary/5" />
          </Carousel>
        </div>
      </section>
    </main>
  )
}
