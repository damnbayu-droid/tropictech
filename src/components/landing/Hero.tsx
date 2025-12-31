'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import Image from 'next/image'

export default function Hero() {
  const { t } = useLanguage()
  const [imageOpacity, setImageOpacity] = useState(30)

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="absolute inset-0">
        <Image
          src="https://i.ibb.co.com/Pzbsg8mx/2.jpg"
          alt="Tropic Tech Workstation Rental Bali"
          fill
          className="object-cover"
          style={{ opacity: imageOpacity / 100 }}
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-xl md:text-2xl mb-4 text-muted-foreground">
          {t('subtitle')}
        </p>
        <p className="text-lg md:text-xl mb-8 text-muted-foreground">
          {t('subtitle2')}
        </p>
        <Button
          size="lg"
          className="text-lg px-8 py-6"
          onClick={scrollToProducts}
        >
          {t('rentNow')}
        </Button>
      </div>

      {/* Opacity Control Slider - Like volume control on edge */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 bg-background/90 backdrop-blur-sm p-3 rounded-full shadow-lg border">
        <div className="h-40 flex items-center">
          <Slider
            value={[imageOpacity]}
            onValueChange={(value) => setImageOpacity(value[0])}
            min={0}
            max={100}
            step={5}
            orientation="vertical"
            className="w-2"
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {imageOpacity}%
        </span>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
