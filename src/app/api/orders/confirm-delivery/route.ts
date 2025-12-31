import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/utils'

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    const confirmed = formData.get('confirmed') === 'true'
    const photos = formData.getAll('photos') as File[]

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // In a real app, you would upload the photos to a storage service
    // For now, we'll just note that photos were uploaded
    const photoUrls = photos.length > 0 ? [`uploaded_${photos.length}_photos`] : []

    const order = await db.order.update({
      where: { id: orderId },
      data: {
        deliveryConfirmed: confirmed,
        deliveryPhotos: photoUrls.join(','),
        workerId: payload.userId,
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({ order, message: 'Delivery confirmed successfully' })
  } catch (error) {
    console.error('Error confirming delivery:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
