'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ShoppingCart, User, Globe, Menu, X, FileText, Trash2, LayoutDashboard, LogOut, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LoginModal } from '@/components/auth/LoginModal'
import { SignupModal } from '@/components/auth/SignupModal'
import { useTheme } from 'next-themes'
import { useCart } from '@/contexts/CartContext'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { language, setLanguage, languageNames, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [globeOpen, setGlobeOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showGlobeTooltip, setShowGlobeTooltip] = useState(false)
  const { theme, setTheme } = useTheme()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()
  const { items, removeItem, itemCount, totalPrice } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)

    // Show educational tooltip after 5 seconds
    const tooltipTimer = setTimeout(() => {
      setShowGlobeTooltip(true)
      // Hide it after 5 seconds of showing
      setTimeout(() => {
        setShowGlobeTooltip(false)
      }, 5000)
    }, 5000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(tooltipTimer)
    }
  }, [])

  const handleProfileClick = () => {
    if (user?.role === 'ADMIN') {
      router.push('/dashboard/admin')
    } else if (user?.role === 'WORKER') {
      router.push('/dashboard/worker')
    } else {
      router.push('/dashboard/user')
    }
  }

  const handleGlobeMouseDown = () => {
    timerRef.current = setTimeout(() => {
      setGlobeOpen(true)
    }, 2000) // 2 seconds
  }

  const handleGlobeMouseUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const handleGlobeClick = (e: React.MouseEvent) => {
    // If modal didn't open (short click), toggle theme
    e.preventDefault()
    if (!globeOpen) {
      setTheme(theme === 'dark' ? 'light' : 'dark')
    }
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-background/25 backdrop-blur-md border-b border-border/10"
            : "bg-transparent border-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-2xl font-bold text-primary">
                Tropic Tech
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {/* Cart Button with Sheet - Visible to all */}
              {mounted ? (
                <>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                            {itemCount}
                          </span>
                        )}
                        <span className="sr-only">Cart</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[350px] sm:w-[500px] flex flex-col">
                      <SheetHeader>
                        <SheetTitle>Your Cart</SheetTitle>
                      </SheetHeader>

                      <div className="flex-1 overflow-y-auto py-4">
                        {items.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                            <p>Your cart is empty</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {items.map((item) => (
                              <div key={item.id} className="flex gap-4 p-3 rounded-lg border bg-card">
                                <div className="flex-1 space-y-1">
                                  <h4 className="font-medium leading-none">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {item.type} • {item.duration ? `${item.duration} Days` : 'Monthly'}
                                  </p>
                                  <p className="text-sm font-semibold">
                                    Rp {item.price.toLocaleString('id-ID')}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {items.length > 0 && (
                        <SheetFooter className="flex-col gap-3 sm:flex-col sm:space-x-0 border-t pt-6">
                          <div className="flex justify-between items-center w-full mb-2">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="text-lg font-bold text-primary">
                              Rp {totalPrice.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <SheetClose asChild>
                            <Button
                              className="w-full"
                              onClick={() => router.push('/checkout')}
                            >
                              Proceed to Checkout
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      )}
                    </SheetContent>
                  </Sheet>

                  {isAuthenticated ? (
                    <>
                      {/* Globe with Tooltip */}
                      <TooltipProvider>
                        <Tooltip open={showGlobeTooltip}>
                          <div className="relative inline-block">
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onMouseDown={handleGlobeMouseDown}
                                onMouseUp={handleGlobeMouseUp}
                                onTouchStart={handleGlobeMouseDown}
                                onTouchEnd={handleGlobeMouseUp}
                                onClick={handleGlobeClick}
                                className="relative transition-all duration-300"
                              >
                                <Globe className="h-5 w-5 transition-transform duration-500 hover:rotate-180" />
                              </Button>
                            </TooltipTrigger>

                            <DropdownMenu open={globeOpen} onOpenChange={setGlobeOpen}>
                              <DropdownMenuTrigger className="absolute inset-0 opacity-0 pointer-events-none" aria-hidden="true" />
                              <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800 animate-in slide-in-from-top-5 fade-in duration-300">
                                {(Object.keys(languageNames) as Array<keyof typeof languageNames>).map((lang) => (
                                  <DropdownMenuItem
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={language === lang ? 'bg-accent' : ''}
                                  >
                                    {languageNames[lang]}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <TooltipContent side="bottom" className="animate-in fade-in slide-in-from-top-2 duration-1000 bg-transparent backdrop-blur-md border-none shadow-none text-foreground">
                            <p className="font-semibold">Click on Change to Dark/White Mode</p>
                            <p className="text-xs">Hold 2 Second for 10 Language Options</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Dashboard Link */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleProfileClick}
                        title="Dashboard"
                        aria-label="Go to Dashboard"
                      >
                        <LayoutDashboard className="h-5 w-5 text-primary" />
                        <span className="sr-only">Dashboard</span>
                      </Button>

                      {/* Logout */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={logout}
                        title="Logout"
                        aria-label="Logout"
                      >
                        <LogOut className="h-5 w-5 text-destructive" />
                        <span className="sr-only">Logout</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" onClick={() => setShowSignupModal(true)}>
                        {t('signUp')}
                      </Button>
                      <Button onClick={() => setShowLoginModal(true)}>
                        {t('login')}
                      </Button>

                      {/* Globe with Tooltip */}
                      <TooltipProvider>
                        <Tooltip open={showGlobeTooltip}>
                          <div className="relative inline-block">
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onMouseDown={handleGlobeMouseDown}
                                onMouseUp={handleGlobeMouseUp}
                                onTouchStart={handleGlobeMouseDown}
                                onTouchEnd={handleGlobeMouseUp}
                                onClick={handleGlobeClick}
                              >
                                <Globe className="h-5 w-5 transition-transform duration-500 hover:rotate-180" />
                              </Button>
                            </TooltipTrigger>

                            <DropdownMenu open={globeOpen} onOpenChange={setGlobeOpen}>
                              <DropdownMenuTrigger className="absolute inset-0 opacity-0 pointer-events-none" aria-hidden="true" />
                              <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800 animate-in slide-in-from-top-5 fade-in duration-300">
                                {(Object.keys(languageNames) as Array<keyof typeof languageNames>).map((lang) => (
                                  <DropdownMenuItem
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={language === lang ? 'bg-accent' : ''}
                                  >
                                    {languageNames[lang]}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <TooltipContent side="bottom" className="animate-in fade-in slide-in-from-top-2 duration-1000 bg-transparent backdrop-blur-md border-none shadow-none text-foreground">
                            <p className="font-semibold">Click on Change to Dark/White Mode</p>
                            <p className="text-xs">Hold 2 Second for 10 Language Options</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  )}
                </>
              ) : (
                /* Static placeholder to avoid layout shift */
                <div className="h-10 w-48 bg-muted/20 animate-pulse rounded-md" />
              )}
            </nav>

            {/* Mobile Menu Button - TODO: Update mobile menu to match */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t bg-background/95 backdrop-blur-md">
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/checkout')}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t('cart')}
                {itemCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Button>

              {isAuthenticated ? (
                <>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleProfileClick}>
                    <User className="h-5 w-5 mr-2" />
                    {t('profile')}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={logout}>
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setShowSignupModal(true)}>
                    {t('signUp')}
                  </Button>
                  <Button className="w-full justify-start" onClick={() => setShowLoginModal(true)}>
                    {t('login')}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false)
          setShowSignupModal(true)
        }}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false)
          setShowLoginModal(true)
        }}
      />
    </>
  )
}
