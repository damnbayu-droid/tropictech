import dynamic from 'next/dynamic'
import Header from '@/components/header/Header'
import Hero from '@/components/landing/Hero'
import LandingClient from '@/components/landing/LandingClient'

// Dynamically import below-the-fold components
const Products = dynamic(() => import('@/components/landing/Products'))
const Packages = dynamic(() => import('@/components/landing/Packages'))
const Services = dynamic(() => import('@/components/landing/Services'))
const FAQ = dynamic(() => import('@/components/landing/FAQ'), { ssr: false })
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
          {({ handleProductOrder, handlePackageOrder }) => (
            <>
              <Products onOrder={handleProductOrder} />
              <Packages onOrder={handlePackageOrder} />
            </>
          )}
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
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RentalBusiness",
            "name": "Tropic Tech - Bali Workstation Rental",
            "description": "Professional high-performance workstation and office equipment rental in Bali. Serving digital nomads, remote workers, and businesses since 2020.",
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
              "latitude": -8.409518,
              "longitude": 115.188919
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
                "dayOfWeek": "Saturday",
                "opens": "10:00",
                "closes": "16:00"
              }
            ],
            "priceRange": "$$",
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
                    "name": "Monitor Rental"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Ergonomic Chair Rental"
                  }
                }
              ]
            }
          })
        }}
      />
    </div>
  )
}
