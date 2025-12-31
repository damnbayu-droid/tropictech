'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, HeadphonesIcon, Shield, Clock } from 'lucide-react'

export default function Services() {
  const { t } = useLanguage()

  const services = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your location anywhere in Bali',
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs',
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'High-quality equipment regularly maintained and inspected',
    },
    {
      icon: Clock,
      title: 'Flexible Rentals',
      description: 'Rent for any duration - daily, weekly, or monthly plans available',
    },
  ]

  return (
    <section id="services" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('services')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
