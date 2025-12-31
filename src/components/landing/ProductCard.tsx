'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    category: string
    monthly_price: number
    stock: number
    image_url?: string | null
  }
  onOrder: (productId: string, duration: number) => void
}

export default function ProductCard({ product, onOrder }: ProductCardProps) {
  const { t } = useLanguage()
  const [duration, setDuration] = useState(7)

  const dailyPrice = (product.monthly_price || 0) / 30
  const totalPrice = dailyPrice * duration

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        {product.image_url ? (
          <div className="relative aspect-video w-full mb-3 rounded-lg overflow-hidden bg-muted">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video w-full mb-3 rounded-lg bg-muted flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
        )}

        <CardTitle className="line-clamp-1">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('daily')}:</span>
            <span className="font-semibold">
              Rp {dailyPrice.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('monthly')}:</span>
            <span className="font-semibold">
              Rp {(product.monthly_price || 0).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('rentalDuration')} (days)
            </label>
            <Input
              type="number"
              min="1"
              value={duration}
              onChange={(e) =>
                setDuration(parseInt(e.target.value) || 1)
              }
            />
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between font-semibold">
              <span>{t('totalPrice')}:</span>
              <span className="text-primary">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onOrder(product.id, duration)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : t('order')}
        </Button>
      </CardFooter>
    </Card>
  )
}
