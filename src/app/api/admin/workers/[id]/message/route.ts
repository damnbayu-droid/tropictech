import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logActivity } from '@/lib/logger'

/**
 * Send message/notification to worker
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { title, message } = await request.json()
        const adminId = 'admin-id' // Replace with actual admin ID from JWT

        const notification = await db.workerNotification.create({
            data: {
                workerId: params.id,
                fromAdminId: adminId,
                type: 'ADMIN_MESSAGE',
                title,
                message,
                isRead: false
            }
        })

        await logActivity({
            userId: adminId,
            action: 'SEND_MESSAGE',
            entity: 'WORKER_NOTIFICATION',
            details: `Sent message to worker ${params.id}: ${title}`
        })

        return NextResponse.json({ success: true, notification })
    } catch (error) {
        console.error('Send message error:', error)
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        )
    }
}
