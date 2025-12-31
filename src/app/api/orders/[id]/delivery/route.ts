import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)

    if (!payload || payload.role !== 'WORKER') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { deliveryPhotos, addressConfirmed, notes } = await request.json()

    const order = await db.order.update({
      where: { id: params.id },
      data: {
        deliveryPhotos,
        deliveryConfirmed: addressConfirmed || false,
        workerId: payload.userId,
      },
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error submitting delivery report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
