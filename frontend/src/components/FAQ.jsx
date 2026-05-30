import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    value: 'item-1',
    question: 'What counseling services does Pathfinder provide?',
    answer: 'Pathfinder provides professional mental health counseling, career guidance, stress management workshops, and student academic mentorship. We address issues ranging from anxiety and depression to career confusion and personal growth.',
  },
  {
    value: 'item-2',
    question: 'Who are the counselors at Pathfinder?',
    answer: 'Our counseling team is led by senior experts like Dr. P.K. Dwivedi alongside certified, compassionate psychological counselors and career mentors dedicated to providing non-judgmental support.',
  },
  {
    value: 'item-3',
    question: 'Are sessions free or paid?',
    answer: 'As an NGO-led initiative in Lucknow, we prioritize accessibility. We offer subsidized and free counseling sessions for students and individuals from economically weaker backgrounds, alongside premium consultation services to sustain our outreach.',
  },
  {
    value: 'item-4',
    question: 'How do I book an appointment?',
    answer: 'You can book an appointment easily by clicking the "Book Appointment" buttons across the website or visiting the /appointments page. Fill in your details and select a convenient slot, and our team will get in touch to confirm.',
  },
  {
    value: 'item-5',
    question: 'Do you offer online or offline sessions?',
    answer: 'We offer both options! You can attend in-person sessions at our counseling center in Lucknow, or opt for convenient, confidential online audio/video sessions from the comfort of your home.',
  },
  {
    value: 'item-6',
    question: 'Is my information kept confidential?',
    answer: 'Absolutely. Privacy and confidentiality are foundational to Pathfinder. All conversation records, assessment results, and personal information are strictly protected and never shared without your explicit consent.',
  }
]

export default function FAQ() {
  const { t } = useTranslation()
  return (
    <section className="py-20 bg-muted/30 border-y">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t('faq_title')}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {t('faq_sub')}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full bg-card border rounded-2xl p-6 shadow-sm divide-y">
          {faqs.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value} className="border-none py-2">
              <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-primary transition-colors py-3">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pt-1 pb-3">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
