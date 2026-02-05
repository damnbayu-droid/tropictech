import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/utils'

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization')
        let userId: string | undefined

        if (authHeader) {
            const token = authHeader.split(' ')[1]
            const payload = await verifyToken(token)
            if (payload) {
                userId = payload.userId
            }
        }

        const body = await request.json()
        const { item, currency, paymentMethod, deliveryAddress, notes, guestInfo } = body

        // Validation
        if (!item || !paymentMethod || !deliveryAddress) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (!userId && !guestInfo) {
            return NextResponse.json({ error: 'Guest info required' }, { status: 400 })
        }

        // Generate Order Number
        const date = new Date()
        const year = date.getFullYear().toString().slice(-2)
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        const orderNumber = `ORD-${year}${month}-${random}`

        // Calculate dates
        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(startDate.getDate() + (item.duration || 30))

        const order = await db.order.create({
            data: {
                orderNumber,
                status: 'PENDING',
                totalAmount: item.price,
                subtotal: item.price, // Added missing subtotal
                paymentMethod,
                // deliveryAddress is not in schema, removing or mapping to notes
                // notes: `${notes || ''}\nAddress: ${deliveryAddress}`, 
                startDate,
                endDate,
                duration: item.duration || 30, // Added duration
                userId: userId as string, // Cast since schema says it's required
                rentalItems: {
                    create: {
                        productId: item.id,
                        quantity: 1,
                    },
                },
            },
        })

        return NextResponse.json({ order })
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }
}
