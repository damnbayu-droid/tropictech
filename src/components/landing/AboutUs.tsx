'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent } from '@/components/ui/card'
import { Award, Users, Calendar, Globe } from 'lucide-react'

export default function AboutUs() {
  const { t } = useLanguage()

  return (
    <section id="about-us" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('aboutUs')}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              PT Tropic Tech International is Bali\'s premier workstation and office equipment rental company. 
              For over 5 years, we have been serving digital nomads, remote workers, and businesses across Bali 
              with high-quality, reliable equipment.
            </p>
            <p className="text-lg text-muted-foreground">
              Our mission is to provide flexible, affordable, and top-quality workspace solutions that help you 
              stay productive while enjoying the beautiful island life in Bali.
            </p>
            <p className="text-lg text-muted-foreground">
              Whether you need a complete home office setup or just a single monitor for a week, we have the 
              perfect solution tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">5+</h3>
                <p className="text-sm text-muted-foreground">Years in Bali</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">1000+</h3>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">#1</h3>
                <p className="text-sm text-muted-foreground">In the Industry</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">9</h3>
                <p className="text-sm text-muted-foreground">Languages Supported</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
