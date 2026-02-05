import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const orders = await db.order.findMany({
            include: {
                user: {
                    select: { fullName: true, email: true }
                },
                rentalItems: true,
            },
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json({ orders })
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}
