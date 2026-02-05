'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/header/Header'
import Hero from '@/components/landing/Hero'

// Dynamically import below-the-fold components
const Products = dynamic(() => import('@/components/landing/Products'))
const Packages = dynamic(() => import('@/components/landing/Packages'))
const Services = dynamic(() => import('@/components/landing/Services'))
const FAQ = dynamic(() => import('@/components/landing/FAQ'), { ssr: false })
const AboutUs = dynamic(() => import('@/components/landing/AboutUs'))
const Reviews = dynamic(() => import('@/components/landing/Reviews'))
const Footer = dynamic(() => import('@/components/landing/Footer'))

// Dynamically import OrderPopup to avoid hydration issues with useAuth
const OrderPopup = dynamic(() => import('@/components/landing/OrderPopup'), {
  ssr: false,
})

interface OrderItem {
  type: 'PRODUCT' | 'PACKAGE'
  id: string
  name: string
  price: number
  duration?: number
}

export default function Home() {
  const [orderItem, setOrderItem] = useState<OrderItem | null>(null)
  const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false)

  const handleProductOrder = (productId: string, duration: number) => {
    // Fetch product details
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        const dailyPrice = data.product.monthlyPrice / 30
        setOrderItem({
          type: 'PRODUCT',
          id: productId,
          name: data.product.name,
          price: dailyPrice * duration,
          duration,
        })
        setIsOrderPopupOpen(true)
      })
      .catch(error => {
        console.error('Failed to fetch product:', error)
      })
  }

  const handlePackageOrder = (packageId: string) => {
    // Fetch package details
    fetch(`/api/packages/${packageId}`)
      .then(res => res.json())
      .then(data => {
        setOrderItem({
          type: 'PACKAGE',
          id: packageId,
          name: data.package.name,
          price: data.package.price,
          duration: data.package.duration,
        })
        setIsOrderPopupOpen(true)
      })
      .catch(error => {
        console.error('Failed to fetch package:', error)
      })
  }

  const handleCloseOrderPopup = () => {
    setIsOrderPopupOpen(false)
    setOrderItem(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Products onOrder={handleProductOrder} />
        <Packages onOrder={handlePackageOrder} />
        <Services />
        <FAQ />
        <AboutUs />
        <Reviews />
      </main>
      <Footer />

      {isOrderPopupOpen && orderItem && (
        <OrderPopup
          isOpen={isOrderPopupOpen}
          onClose={handleCloseOrderPopup}
          item={orderItem}
        />
      )}

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Tropic Tech - PT Tropic Tech International",
            "description": "Professional workstation and office equipment rental in Bali. Serving digital nomads and remote workers for 5+ years.",
            "url": "https://tropictechbali.com",
            "telephone": "+6282266574860",
            "email": "tropictechindo@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Jl. Tunjungsari No.8",
              "addressLocality": "Bali",
              "addressCountry": "Indonesia"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": -8.409518,
              "longitude": 115.188919
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "09:00",
              "closes": "18:00"
            },
            "priceRange": "Rp 75,000 - Rp 2,000,000 / day",
            "image": "https://i.ibb.co.com/Pzbsg8mx/2.jpg",
            "sameAs": [
              "https://www.instagram.com/tropictechs",
              "https://wa.me/6282266574860"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "100+",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />
    </div>
  )
}
