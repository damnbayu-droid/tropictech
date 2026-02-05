'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ProductCard from './ProductCard'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'

export default function Products({
  onOrder,
}: {
  onOrder: (productId: string, duration: number) => void
}) {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (api) {
      api.scrollTo(0)
    }
  }, [selectedCategory, api])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        const fetchedProducts = data.products
        setProducts(fetchedProducts)

        // Extract unique categories from actual products
        const uniqueCategories = Array.from(
          new Set(fetchedProducts.map((p: any) => p.category))
        ) as string[]
        setCategories(['All', ...uniqueCategories.sort()])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory)

  return (
    <section id="products" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          {t('products')}
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false, // Changed to false for better UX when filtering
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                <div className="p-1">
                  <ProductCard
                    product={product}
                    onOrder={onOrder}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
