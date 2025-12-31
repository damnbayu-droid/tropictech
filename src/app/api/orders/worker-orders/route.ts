import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/utils'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)

    if (!payload || payload.role !== 'WORKER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const orders = await db.order.findMany({
      where: {
        status: {
          in: ['CONFIRMED', 'ACTIVE'],
        },
      },
      include: {
        rentalItems: true,
      },
      orderBy: { startDate: 'asc' },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching worker orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
