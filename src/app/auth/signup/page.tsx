'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [baliAddress, setBaliAddress] = useState('')
  const [mapsAddressLink, setMapsAddressLink] = useState('')
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPassportPhoto(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('fullName', fullName)
      formData.append('email', email)
      formData.append('whatsapp', whatsapp)
      formData.append('baliAddress', baliAddress)
      formData.append('mapsAddressLink', mapsAddressLink)
      if (passportPhoto) {
        formData.append('passportPhoto', passportPhoto)
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Account created successfully! Please save your credentials.')
        // Show credentials
        alert(`Your account has been created!\n\nUsername: ${data.credentials.username}\nPassword: ${data.credentials.password}\n\nPlease save these credentials for future login.`)
        router.push('/auth/login')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create account')
      }
    } catch (error) {
      toast.error('Failed to create account')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Tropic Tech</CardTitle>
          <CardDescription>{t('signUp')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+62..."
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baliAddress">Bali Address</Label>
              <Textarea
                id="baliAddress"
                value={baliAddress}
                onChange={(e) => setBaliAddress(e.target.value)}
                placeholder="Your address in Bali..."
                rows={2}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mapsAddressLink">Google Maps Address Link</Label>
              <Input
                id="mapsAddressLink"
                type="url"
                value={mapsAddressLink}
                onChange={(e) => setMapsAddressLink(e.target.value)}
                placeholder="https://maps.google.com/..."
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportPhoto">
                Passport Photo
                <span className="text-xs text-muted-foreground ml-2">
                  (Uploading passport speeds up delivery)
                </span>
              </Label>
              <Input
                id="passportPhoto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {passportPhoto && (
                <p className="text-xs text-muted-foreground">
                  Selected: {passportPhoto.name}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : t('signUp')}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/auth/login" className="text-primary hover:underline">
              {t('login')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
