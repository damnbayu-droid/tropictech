import dynamic from 'next/dynamic'
import Header from '@/components/header/Header'
import Hero from '@/components/landing/Hero'
import LandingClient from '@/components/landing/LandingClient'

// Dynamically import below-the-fold components
const Products = dynamic(() => import('@/components/landing/Products'))
const Packages = dynamic(() => import('@/components/landing/Packages'))
const Services = dynamic(() => import('@/components/landing/Services'))
const FAQ = dynamic(() => import('@/components/landing/FAQ'))
const AboutUs = dynamic(() => import('@/components/landing/AboutUs'))
const Reviews = dynamic(() => import('@/components/landing/Reviews'))
const Footer = dynamic(() => import('@/components/landing/Footer'))

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <LandingClient>
          <Products />
          <Packages />
        </LandingClient>
        <Services />
        <FAQ />
        <AboutUs />
        <Reviews />
      </main>
      <Footer />

      {/* Enhanced Structured Data for SEO Gold Status */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "RentalBusiness",
              "name": "Tropic Tech - #1 Workstation Rental Bali",
              "description": "Premium workstation and office equipment rental in Bali. High-performance monitors, ergonomic chairs, and desks for digital nomads. 5+ years experience with fast island-wide delivery.",
              "url": "https://tropictechbali.com",
              "telephone": "+6282266574860",
              "email": "tropictechindo@gmail.com",
              "logo": "https://i.ibb.co.com/Pzbsg8mx/2.jpg",
              "image": "https://i.ibb.co.com/Pzbsg8mx/2.jpg",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jl. Tunjungsari No.8",
                "addressLocality": "Badung",
                "addressRegion": "Bali",
                "postalCode": "80361",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -8.6539,
                "longitude": 115.1469
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "09:00",
                  "closes": "18:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Saturday", "Sunday"],
                  "opens": "10:00",
                  "closes": "16:00"
                }
              ],
              "priceRange": "Rp 50,000 - Rp 2,000,000",
              "sameAs": [
                "https://www.instagram.com/tropictechs",
                "https://wa.me/6282266574860"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Workstation & Office Rental Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Monitor Rental (Standard & Ultrawide)"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Ergonomic Office Chair Rental"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Standing Desk & Office Table Rental"
                    }
                  }
                ]
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How do I rent workstation equipment in Bali?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Browse our products on tropictechbali.com, select your duration (daily/weekly/monthly), and place an order. We offer fast delivery across Bali including Canggu, Ubud, and Seminyak."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do you offer ergonomic chairs for rent?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we provide premium ergonomic office chairs from top brands like ErgoChair and Sihoo, specifically designed for long hours of remote work."
                  }
                }
              ]
            }
          ])
        }}
      />
    </div>
  )
}
