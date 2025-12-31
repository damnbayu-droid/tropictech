'use client'

import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface PackageCardProps {
  package: {
    id: string
    name: string
    description: string
    price: number
    duration: number
    imageUrl?: string | null
    items: Array<{
      id: string
      quantity: number
      product: {
        name: string
      }
    }>
  }
  onOrder: (packageId: string) => void
}

export default function PackageCard({ package: pkg, onOrder }: PackageCardProps) {
  const { t } = useLanguage()

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        {pkg.imageUrl ? (
          <div className="relative aspect-video w-full mb-3 rounded-lg overflow-hidden bg-muted">
            <Image
              src={pkg.imageUrl}
              alt={pkg.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video w-full mb-3 rounded-lg bg-muted flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
        )}
        <CardTitle className="line-clamp-1">{pkg.name}</CardTitle>
        <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Included Items:</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {pkg.items.map((item) => (
                <li key={item.id} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  <span className="line-clamp-1">
                    {item.product.name} x {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('rentalDuration')}:</span>
              <span className="font-semibold">{pkg.duration} days</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>{t('totalPrice')}:</span>
              <span className="text-primary">Rp {pkg.price.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={() => onOrder(pkg.id)}>
          {t('order')}
        </Button>
      </CardFooter>
    </Card>
  )
}
