import React from 'react'
import { CheckCircle, Users, Award, BookOpen } from 'lucide-react'

const stats = [
  {
    icon: Award,
    value: '20 Years +',
    label: 'Professional Experience',
    description: 'Dedicated team of expert counseling psychologists and mentors.',
  },
  {
    icon: Users,
    value: '1,000+',
    label: 'Individually Counseling',
    description: 'Personalized 1-on-1 therapeutic mental health & career counseling sessions.',
  },
  {
    icon: BookOpen,
    value: '10,000+',
    label: 'Mass Counseling',
    description: 'Conducted group seminars in schools, colleges, and social institutions.',
  },
  {
    icon: CheckCircle,
    value: '99%',
    label: 'Satisfaction Rate',
    description: 'Consistent positive feedback from our students and community.',
  },
]

export default function Stats() {
  return (
    <section className="relative py-16 overflow-hidden bg-card border-y">
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold tracking-wider text-primary uppercase">Our Impact</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Empowering the Community of Lucknow
          </h2>
          <p className="mt-3 text-muted-foreground">
            Through guidance, mentorship, and mental health support, we are making a measurable difference.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={i}
                className="relative overflow-hidden group p-6 bg-background border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold tracking-tight text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-muted-foreground mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground/80 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
