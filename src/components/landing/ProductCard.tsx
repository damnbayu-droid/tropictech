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
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductDetailModal } from './ProductDetailModal'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    category: string
    monthly_price: number
    stock: number
    image_url?: string | null
    images?: string[]
    specs?: any
  }
  onOrder: (productId: string, duration: number) => void
}

export default function ProductCard({ product, onOrder }: ProductCardProps) {
  const { t } = useLanguage()
  const [duration, setDuration] = useState(30)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const dailyPrice = (product.monthly_price || 0) / 30
  const totalPrice = dailyPrice * duration

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      // simplified toast or alert
    }
  }

  return (
    <>
      <Card
        className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <CardHeader className="pb-3">
          {product.image_url ? (
            <div className="relative aspect-video w-full mb-3 rounded-lg overflow-hidden bg-muted">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
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

            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
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

        <CardFooter className="gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            className="flex-1"
            onClick={() => onOrder(product.id, duration)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : t('order')}
          </Button>
          <AddToCartButton
            item={{
              id: product.id,
              type: 'PRODUCT',
              name: product.name,
              price: dailyPrice * duration, // Price depends on duration
              duration: duration,
              image: product.image_url,
              quantity: 1
            }}
          />
          <Button variant="outline" size="icon" onClick={handleShare} title="Share">
            <Share2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  )
}

function AddToCartButton({ item }: { item: any }) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAdd = () => {
    addItem(item)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000) // Reset after 2s
  }

  return (
    <Button
      variant={isAdded ? "default" : "outline"}
      size="icon"
      onClick={handleAdd}
      className={cn("transition-colors", isAdded && "bg-green-600 hover:bg-green-700 text-white")}
      title="Add to Cart"
    >
      {isAdded ? (
        <span className="text-xs font-bold">Added</span>
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
    </Button>
  )
}
