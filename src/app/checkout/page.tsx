'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Trash2, ArrowLeft, Globe, CreditCard, Smartphone, Bitcoin, Terminal, QrCode, Landmark, Banknote } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/header/Header'
import Footer from '@/components/landing/Footer'
import { toast } from 'sonner'

const paymentMethods = [
    { id: 'WISE', name: 'Wise', icon: <Globe className="h-6 w-6" />, desc: 'International transfer' },
    { id: 'STRIPE', name: 'Stripe', icon: <CreditCard className="h-6 w-6" />, desc: 'Secure card payment' },
    { id: 'PAYPAL', name: 'PayPal', icon: <CreditCard className="h-6 w-6" />, desc: 'Fast & easy' },
    { id: 'APPLE_PAY', name: 'Apple Pay', icon: <Smartphone className="h-6 w-6" />, desc: 'Apple device payment' },
    { id: 'VISA_MASTERCARD', name: 'Visa/Mastercard', icon: <CreditCard className="h-6 w-6" />, desc: 'Credit/Debit Card' },
    { id: 'CRYPTO', name: 'Crypto', icon: <Bitcoin className="h-6 w-6" />, desc: 'BTC, ETH, USDT' },
    { id: 'EDC', name: 'EDC Machine', icon: <Terminal className="h-6 w-6" />, desc: 'Swipe on delivery' },
    { id: 'QRIS', name: 'QRIS', icon: <QrCode className="h-6 w-6" />, desc: 'Scan to pay' },
    { id: 'BANK_TRANSFER', name: 'Bank Transfer', icon: <Landmark className="h-6 w-6" />, desc: 'Direct bank transfer' },
    { id: 'CASH', name: 'Cash', icon: <Banknote className="h-6 w-6" />, desc: 'Pay on delivery' },
]

export default function CheckoutPage() {
    const { items, removeItem, totalPrice, clearCart } = useCart()
    const { user } = useAuth()
    const { t } = useLanguage()
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: user?.fullName || '',
        email: user?.email || '',
        whatsapp: '',
        address: '',
        linkAddress: '', // Google Maps Link
    })
    const [paymentMethod, setPaymentMethod] = useState('WISE')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleBuy = async () => {
        if (!formData.name || !formData.email || !formData.whatsapp || !formData.address) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Construct message for WhatsApp/Email
        const orderDetails = items.map(item => `- ${item.name} (${item.type}) x${item.quantity}: Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`).join('\n')
        const total = `Rp ${totalPrice.toLocaleString('id-ID')}`

        console.log('Order Placed:', {
            items,
            total,
            customer: formData,
            payment: paymentMethod
        })

        toast.success('Order placed successfully! Redirecting...')
        clearCart()
        setTimeout(() => {
            router.push('/')
        }, 2000)
        setIsSubmitting(false)
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <Button onClick={() => router.push('/')}>Back to Home</Button>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-24 md:py-32">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent" onClick={() => router.push('/')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>

                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Form & Payment */}
                    <div className="space-y-8">

                        {/* Customer Details */}
                        <div className="bg-card border rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">Details</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp">Whatsapp</Label>
                                        <Input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="+62..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Delivery Address</Label>
                                    <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Villa address, street, etc." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="linkAddress">Google Maps Link (Optional)</Label>
                                    <Input id="linkAddress" name="linkAddress" value={formData.linkAddress} onChange={handleInputChange} placeholder="https://maps.google.com/..." />
                                </div>
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="bg-card border rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {paymentMethods.map((method) => (
                                    <div key={method.id} className="relative">
                                        <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                                        <Label
                                            htmlFor={method.id}
                                            className="flex flex-col items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all h-full"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="text-primary">{method.icon}</div>
                                                <span className="font-semibold">{method.name}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{method.desc}</span>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:pl-8">
                        <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-semibold mb-6">Order Review</h2>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                                        {item.image ? (
                                            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0 text-2xl">📦</div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Quantity: {item.quantity}
                                            </p>
                                            <p className="text-sm font-semibold mt-1">
                                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-2">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t">
                                    <span>Total</span>
                                    <span className="text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Button className="w-full text-lg py-6" onClick={handleBuy} disabled={isSubmitting}>
                                    {isSubmitting ? 'Processing...' : 'Pay Now'}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    By clicking "Pay Now", you agree to our terms and conditions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
