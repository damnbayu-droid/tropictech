import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tropictechbali.com'),
  title: "Tropic Tech - Workstation Rental in Bali | 5+ Years Experience",
  description: "Rent high-quality workstations, desks, monitors, chairs & office equipment in Bali. 5+ years serving digital nomads & remote workers. Fast delivery & flexible terms. Daily, weekly & monthly rates available.",
  keywords: ["Tropic Tech", "Bali", "Workstation", "Rental", "Digital Nomads", "Remote Work", "Office Equipment", "Desks", "Monitors", "Chairs", "Bali Rentals", "Coworking", "Office Furniture Rental", "Computer Rental Bali", "Workstation Rental Bali", "Laptop Stand Rental", "Ergonomic Chair Rental", "Monitor Rental Bali"],
  authors: [{ name: "PT Tropic Tech International" }],
  creator: "Tropic Tech",
  publisher: "PT Tropic Tech International",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Tropic Tech - Workstation Rental in Bali",
    description: "Professional workstation rental in Bali. 5+ years experience serving digital nomads and remote workers with fast delivery.",
    url: "https://tropictechbali.com",
    siteName: "Tropic Tech",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://i.ibb.co.com/Pzbsg8mx/2.jpg",
        width: 1200,
        height: 630,
        alt: "Tropic Tech Workstation Rental",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tropic Tech - Workstation Rental in Bali",
    description: "Professional workstation rental in Bali. 5+ years experience serving digital nomads.",
    images: ["https://i.ibb.co.com/Pzbsg8mx/2.jpg"],
    creator: "@tropictechs",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://tropictechbali.com",
    languages: {
      'en': 'https://tropictechbali.com/en',
      'id': 'https://tropictechbali.com/id',
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
