import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { status } = await request.json()
        const { id } = await params

        const order = await db.order.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json({ order })
    } catch (error) {
        console.error('Error updating order status:', error)
        return NextResponse.json(
            { error: 'Failed to update order status' },
            { status: 500 }
        )
    }
}
