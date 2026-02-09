import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createInvoiceForOrder, getInvoiceRecipients } from '@/lib/invoice-utils'
import { sendInvoiceEmail } from '@/lib/email'
import { logActivity } from '@/lib/logger'

/**
 * Confirm payment for an order
 * Creates invoice, sends emails, updates order status
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { paymentMethod, deliveryFeeOverride } = await request.json()
        const orderId = params.id

        // Get admin user from token (you'd normally verify JWT here)
        const adminId = 'admin-user-id' // Replace with actual JWT verification

        // Update order payment status
        const order = await db.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'PAID',
                paymentMethod,
                paymentConfirmedBy: adminId,
                paymentConfirmedAt: new Date(),
                status: 'CONFIRMED'
            },
            include: {
                user: true
            }
        })

        // Create/update invoice
        const invoice = await createInvoiceForOrder(orderId, deliveryFeeOverride)

        // Get all recipients
        const recipients = await getInvoiceRecipients(invoice)

        // Generate shareable invoice link
        const invoiceLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invoice/public/${invoice.shareableToken}`

        // Send email to all recipients
        await sendInvoiceEmail({
            to: recipients,
            invoiceNumber: invoice.invoiceNumber,
            customerName: order.user?.fullName || 'Customer',
            amount: parseFloat(invoice.total.toString()),
            invoiceLink
        })

        // Update invoice email status
        await db.invoice.update({
            where: { id: invoice.id },
            data: {
                emailSent: true,
                emailSentAt: new Date()
            }
        })

        // Log activity
        await logActivity({
            userId: adminId,
            action: 'CONFIRM_PAYMENT',
            entity: 'ORDER',
            details: `Confirmed payment for order ${order.orderNumber}`
        })

        return NextResponse.json({
            success: true,
            order,
            invoice,
            emailsSent: recipients.length
        })
    } catch (error) {
        console.error('Payment confirmation error:', error)
        return NextResponse.json(
            { error: 'Failed to confirm payment' },
            { status: 500 }
        )
    }
}
