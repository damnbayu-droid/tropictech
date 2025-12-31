'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ProductCard from './ProductCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const categories = [
  'All',
  'Desks',
  'Monitors',
  'Chairs',
  'Keyboard & Mouse',
  'Accessories',
]

export default function Products({
  onOrder,
}: {
  onOrder: (productId: string, duration: number) => void
}) {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [products, setProducts] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setItemsPerView(width < 1024 ? 2 : 4)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        let filtered = data.products
        if (selectedCategory !== 'All') {
          filtered = filtered.filter(
            (p: any) => p.category === selectedCategory
          )
        }
        setProducts(filtered)
        setCurrentIndex(0)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const maxIndex = Math.max(0, products.length - itemsPerView)

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
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* MOBILE VIEW */}
        {isMobile ? (
          <div className="space-y-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOrder={onOrder}
              />
            ))}
          </div>
        ) : (
          /* DESKTOP / TABLET SLIDER */
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-300"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                  width: `${products.length * (100 / itemsPerView)}%`,
                }}
              >
                {products.map((product) => (
                  <div key={product.id} className="w-1/4 px-2">
                    <ProductCard
                      product={product}
                      onOrder={onOrder}
                    />
                  </div>
                ))}
              </div>
            </div>

            {products.length > itemsPerView && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background shadow"
                  onClick={() =>
                    setCurrentIndex((i) => Math.max(i - itemsPerView, 0))
                  }
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background shadow"
                  onClick={() =>
                    setCurrentIndex((i) =>
                      Math.min(i + itemsPerView, maxIndex)
                    )
                  }
                  disabled={currentIndex >= maxIndex}
                >
                  <ChevronRight />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
