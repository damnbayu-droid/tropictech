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

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const orders = await db.order.findMany()
    const count = orders.length
    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

    return NextResponse.json({ count, revenue })
  } catch (error) {
    console.error('Error fetching order stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
