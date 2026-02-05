import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { type, userId, guestName, guestEmail, guestWhatsapp, amount, items } = body

        const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`

        const invoice = await db.invoice.create({
            data: {
                invoiceNumber,
                userId: type === 'registered' ? userId : null,
                guestName: type === 'guest' ? guestName : null,
                guestEmail: type === 'guest' ? guestEmail : null,
                guestWhatsapp: type === 'guest' ? guestWhatsapp : null,
                total: amount,
                subtotal: amount,
                status: 'PAID', // Manual invoices usually created after payment or for records
                currency: 'IDR',
                // For manual invoices we don't necessarily need an order object, 
                // but components might expect some items.
            }
        })

        return NextResponse.json(invoice)
    } catch (error) {
        console.error("[INVOICE_CREATE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
