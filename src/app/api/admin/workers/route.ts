import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, hashPassword } from '@/lib/auth/utils'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const hashedPassword = await hashPassword(body.password)

    const worker = await db.user.create({
      data: {
        username: body.username,
        password: hashedPassword,
        email: body.email,
        fullName: body.fullName,
        whatsapp: body.whatsapp,
        role: 'WORKER',
      },
    })

    return NextResponse.json({ worker, message: 'Worker account created successfully' })
  } catch (error) {
    console.error('Error creating worker:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
