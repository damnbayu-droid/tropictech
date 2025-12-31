import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      item,
      currency,
      paymentMethod,
      deliveryAddress,
      notes,
      guestInfo,
    } = body

    // Get user info if logged in
    let userId = null
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = await verifyToken(token)
      if (payload) {
        userId = payload.userId
      }
    }

    // Calculate order number
    const orderCount = await db.order.count()
    const orderNumber = `ORD-${Date.now()}-${(orderCount + 1).toString().padStart(4, '0')}`

    // Calculate dates
    const duration = item.duration || 30
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000)

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId,
        guestName: guestInfo?.name,
        guestEmail: guestInfo?.email,
        guestWhatsapp: guestInfo?.whatsapp,
        status: 'PENDING',
        paymentMethod,
        currency,
        totalAmount: item.price,
        startDate,
        endDate,
        deliveryAddress,
        notes,
        rentalItems: {
          create: [
            {
              itemType: item.type,
              name: item.name,
              quantity: 1,
              unitPrice: item.price,
              totalPrice: item.price,
              productId: item.type === 'PRODUCT' ? item.id : null,
              packageId: item.type === 'PACKAGE' ? item.id : null,
            },
          ],
        },
      },
    })

    // Generate invoice number
    const invoiceCount = await db.invoice.count()
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(invoiceCount + 1).toString().padStart(6, '0')}`

    // Calculate subtotal and tax (10% tax rate)
    const subtotal = item.price
    const tax = subtotal * 0.1
    const total = subtotal + tax

    // Create invoice
    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        userId,
        subtotal,
        tax,
        total,
        currency,
        paid: false,
      },
    })

    return NextResponse.json({ order, invoice, message: 'Order created successfully' })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
