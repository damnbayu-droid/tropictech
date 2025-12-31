'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function FAQ() {
  const { t } = useLanguage()

  const faqs = [
    {
      question: 'How do I rent equipment?',
      answer: 'Simply browse our products, select the duration, and click Order. You\'ll be guided through the checkout process with multiple payment options available.',
    },
    {
      question: 'What is the minimum rental period?',
      answer: 'Our minimum rental period is 1 day. You can rent equipment for as long as you need - from daily to monthly rentals.',
    },
    {
      question: 'Do you offer delivery services?',
      answer: 'Yes, we offer fast delivery across Bali. Delivery fees may apply depending on your location.',
    },
    {
      question: 'What happens if equipment is damaged?',
      answer: 'Minor wear and tear is expected. For significant damage, please contact us immediately. We offer protection plans for additional peace of mind.',
    },
    {
      question: 'Can I extend my rental period?',
      answer: 'Yes! You can extend your rental anytime through your dashboard or by contacting our support team.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept PayPal, credit/debit cards, Stripe, cryptocurrency, cash, and WhatsApp orders.',
    },
  ]

  return (
    <section id="faq" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('faq')}</h2>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
