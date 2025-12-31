import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/utils'

export async function POST(
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

    const { days } = await request.json()

    const order = await db.order.findFirst({
      where: {
        id: params.id,
        userId: payload.userId,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Extend the end date
    const newEndDate = new Date(
      order.endDate.getTime() + (days || 7) * 24 * 60 * 60 * 1000
    )

    const updatedOrder = await db.order.update({
      where: { id: params.id },
      data: {
        endDate: newEndDate,
      },
    })

    return NextResponse.json({ order: updatedOrder, message: 'Rental extended successfully' })
  } catch (error) {
    console.error('Error extending rental:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
