'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

export default function Reviews() {
  const { t } = useLanguage()

  const reviews = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent service! The equipment was in perfect condition and delivery was super fast. Highly recommend for anyone working remotely in Bali.',
    },
    {
      name: 'Michael Chen',
      rating: 5,
      date: '1 month ago',
      comment: 'Best rental company in Bali! Great selection of high-quality equipment at competitive prices. The team is very professional and helpful.',
    },
    {
      name: 'Emma Williams',
      rating: 5,
      date: '3 months ago',
      comment: 'Saved my digital nomad experience! Ordered a complete workstation setup and everything arrived perfectly. Will definitely use again.',
    },
  ]

  return (
    <section id="reviews" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('reviews')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{review.comment}</p>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
