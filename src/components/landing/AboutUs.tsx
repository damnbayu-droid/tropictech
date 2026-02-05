'use client'

import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent } from '@/components/ui/card'
import { Award, Users, Calendar, Globe, Building2, TrendingUp, HeartHandshake } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AboutUs() {
  const { t } = useLanguage()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const stats = [
    {
      icon: Calendar,
      value: '5+',
      label: 'Years in Bali',
      title: 'Our Journey',
      description: 'Founded in 2019, Tropic Tech International started with a single container and a dream to support the growing nomad community.',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-primary mt-1" />
            <p className="text-sm">We have grown from a small side-project to a full-scale legal entity (PT) with a dedicated warehouse in Denpasar.</p>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary mt-1" />
            <p className="text-sm">Over the years, we have survived and thrived through Bali\'s tourism cycles by focusing on one thing: uncompromising quality.</p>
          </div>
        </div>
      )
    },
    {
      icon: Users,
      value: '1000+',
      label: 'Happy Customers',
      title: 'Who We Serve',
      description: 'From solo freelancers to Fortune 500 remote teams, we have enabled productivity across the island.',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-primary mt-1" />
            <p className="text-sm">Our clients come from over 45 different countries, representing the true spirit of Bali\'s international hub.</p>
          </div>
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-primary mt-1" />
            <p className="text-sm">We take pride in our 98% retention rate for monthly subscribers—if they come once, they usually stay for their whole trip.</p>
          </div>
        </div>
      )
    },
    {
      icon: Award,
      value: '#1',
      label: 'In the Industry',
      title: 'Industry Leadership',
      description: 'Ranked as Bali\'s top-rated hardware rental service based on customer reviews and equipment variety.',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Award className="h-5 w-5 text-primary mt-1" />
            <p className="text-sm">We are the only provider in Bali offering professional-grade ergonomic chairs and 34-inch ultrawide monitors.</p>
          </div>
          <div className="flex items-start gap-3">
            <HeartHandshake className="h-5 w-5 text-primary mt-1" />
            <p className="text-sm">Our partnerships with local co-working spaces ensure that we are at the heart of the community, not just a vendor.</p>
          </div>
        </div>
      )
    },
    {
      icon: Globe,
      value: '9',
      label: 'Languages Supported',
      title: 'Global Standards',
      description: 'Our diverse team speaks multiple languages to support our global clientele seamlessly.',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-primary mt-1" />
            <p className="text-sm">We provide support in English, Indonesian, Russian, French, Spanish, German, and more.</p>
          </div>
          <p className="text-xs text-muted-foreground border-t pt-2">No matter where you are from, our mission is to ensure clear communication and zero friction in your setup.</p>
        </div>
      )
    }
  ]

  return (
    <section id="about-us" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('aboutUs')}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              PT Tropic Tech International is Bali's premier workstation and office equipment rental company.
              For over 5 years, we have been serving digital nomads, remote workers, and businesses across Bali
              with high-quality, reliable equipment.
            </p>
            <p className="text-lg text-muted-foreground">
              Our mission is to provide flexible, affordable, and top-quality workspace solutions that help you
              stay productive while enjoying the beautiful island life in Bali.
            </p>
            <p className="text-lg text-muted-foreground font-medium text-primary italic">
              "We don't just rent hardware; we build the infrastructure for your success in paradise."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const content = (
                <Card className="hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 group">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                        <stat.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              )

              if (!mounted) return <div key={`static-${index}`}>{content}</div>

              return (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    {content}
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-2xl flex items-center gap-3">
                        <stat.icon className="h-6 w-6 text-primary" />
                        {stat.title}
                      </DialogTitle>
                      <DialogDescription className="text-base pt-2">
                        {stat.description}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                      {stat.content}
                    </div>
                  </DialogContent>
                </Dialog>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
