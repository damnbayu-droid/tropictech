import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/utils'
import { sendInvoiceEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization')
        let userId: string | undefined

        if (authHeader) {
            const token = authHeader.split(' ')[1]
            const payload = await verifyToken(token)
            if (payload) userId = payload.userId
        }

        const body = await request.json()
        const { item, currency, paymentMethod, deliveryAddress, notes, guestInfo } = body

        if (!item || !paymentMethod || !deliveryAddress) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (!userId && !guestInfo) {
            return NextResponse.json({ error: 'Guest info required' }, { status: 400 })
        }

        const date = new Date()
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}`
        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(startDate.getDate() + (item.duration || 30))

        const order = await db.order.create({
            data: {
                orderNumber,
                status: 'PENDING',
                totalAmount: item.price,
                subtotal: item.price,
                paymentMethod,
                startDate,
                endDate,
                duration: item.duration || 30,
                userId: userId as string, // Note: Schema requirement
                rentalItems: { create: { productId: item.id, quantity: 1 } },
            },
        })

        // 1. Generate Invoice
        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`
        const invoice = await db.invoice.create({
            data: {
                invoiceNumber,
                orderId: order.id,
                userId: userId,
                guestName: guestInfo?.fullName,
                guestEmail: guestInfo?.email,
                guestWhatsapp: guestInfo?.whatsapp,
                guestAddress: deliveryAddress,
                total: item.price,
                subtotal: item.price,
                status: 'PENDING',
                currency: currency || 'IDR'
            }
        })

        // 2. Automate Email
        try {
            const recipients: string[] = []
            const customerEmail = userId ? (await db.user.findUnique({ where: { id: userId } }))?.email : guestInfo?.email
            if (customerEmail) recipients.push(customerEmail)

            // Forward to Company
            recipients.push('tropictechindo@gmail.com')

            // Forward to Workers
            const workers = await db.user.findMany({
                where: { role: 'WORKER' },
                select: { email: true }
            })
            workers.forEach(w => recipients.push(w.email))

            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
            await sendInvoiceEmail({
                to: recipients,
                invoiceNumber: invoice.invoiceNumber,
                customerName: guestInfo?.fullName || 'Valued Customer',
                amount: Number(invoice.total),
                invoiceLink: `${baseUrl}/invoice/${invoice.id}`
            })
        } catch (emailError) {
            console.error('Failed to send automation email:', emailError)
        }

        return NextResponse.json({ order, invoice })
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }
}
