'use client'

import { useState } from 'react'
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
import { ShoppingCart, User, Globe, Menu, X, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { language, setLanguage, languageNames, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleProfileClick = () => {
    if (user?.role === 'ADMIN') {
      router.push('/dashboard/admin')
    } else if (user?.role === 'WORKER') {
      router.push('/dashboard/worker')
    } else {
      router.push('/dashboard/user')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleProfileClick}
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
                {user?.role === 'USER' && (
                  <Link href="/dashboard/user/cart">
                    <Button variant="ghost" size="icon">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="sr-only">Cart</span>
                    </Button>
                  </Link>
                )}
                {/* Reports - Only for authenticated users */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push('/reports/work-flow')}>
                      Work Flow Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/reports/revenue')}>
                      Revenue Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Language Switcher */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Globe className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
                <Button variant="outline" onClick={logout}>
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/signup">{t('signUp')}</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/login">{t('login')}</Link>
                </Button>
                {/* Language Switcher */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Globe className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu - No Reports dropdown */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <Button variant="ghost" className="w-full justify-start" onClick={handleProfileClick}>
              <User className="h-5 w-5 mr-2" />
              {t('profile')}
            </Button>
            {user?.role === 'USER' && (
              <Link href="/dashboard/user/cart" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t('cart')}
                </Button>
              </Link>
            )}
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Globe className="h-5 w-5 mr-2" />
                  {languageNames[language]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
            <Button variant="outline" className="w-full" onClick={logout}>
              {t('logout')}
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
