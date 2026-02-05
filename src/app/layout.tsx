import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/components/theme-provider";

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
  title: "Tropic Tech | #1 Workstation & Office Rental Bali",
  description: "Rent premium workstations, ergonomic chairs, monitors, and desks in Bali. 5+ years experience serving digital nomads and remote workers. Daily, weekly, and monthly rentals with fast island-wide delivery.",
  keywords: ["Workstation Rental Bali", "Rent Office Chair Bali", "Monitor Rental Bali", "Tropic Tech Bali", "Canggu Coworking Equipment", "Ubud Desktop Rental", "Remote Work Bali", "Desk Rental Bali", "Digital Nomad Bali", "Ergonomic office equipment rental Indonesia"],
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
    title: "Tropic Tech - Rent Workstation in Bali",
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
      <head>
        <link rel="preconnect" href="https://i.ibb.co.com" />
        <link rel="dns-prefetch" href="https://i.ibb.co.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
