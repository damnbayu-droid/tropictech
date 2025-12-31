import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/utils'
import { generateInvoicePDF } from '@/lib/pdf/invoice'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const invoice = await db.invoice.findUnique({
      where: { id: params.id },
      include: {
        order: {
          include: {
            rentalItems: true,
          },
        },
        user: true,
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Check if user owns this invoice or is admin
    if (invoice.userId !== payload.userId && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Generate PDF
    const pdf = generateInvoicePDF({
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: new Date(invoice.createdAt).toLocaleDateString(),
      customerName: invoice.user?.fullName || invoice.order.guestName || 'Guest',
      customerEmail: invoice.user?.email || invoice.order.guestEmail || '',
      customerWhatsApp: invoice.user?.whatsapp || invoice.order.guestWhatsapp,
      customerAddress: invoice.order.deliveryAddress || undefined,
      items: invoice.order.rentalItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
      currency: invoice.currency,
      orderNumber: invoice.order.orderNumber,
      startDate: new Date(invoice.order.startDate).toLocaleDateString(),
      endDate: new Date(invoice.order.endDate).toLocaleDateString(),
    })

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    // Update invoice with PDF URL (in real app, upload to storage)
    await db.invoice.update({
      where: { id: params.id },
      data: { pdfUrl: `/api/invoices/${params.id}/download` },
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
