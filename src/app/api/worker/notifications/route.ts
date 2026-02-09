import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Get worker's notifications
 */
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const workerId = 'worker-id' // Replace with actual JWT verification

        const notifications = await db.workerNotification.findMany({
            where: { workerId },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        })

        const unreadCount = notifications.filter(n => !n.isRead).length

        return NextResponse.json({ notifications, unreadCount })
    } catch (error) {
        console.error('Get notifications error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        )
    }
}

/**
 * Mark notification as read
 */
export async function PATCH(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { notificationId } = await request.json()

        await db.workerNotification.update({
            where: { id: notificationId },
            data: { isRead: true }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Mark notification read error:', error)
        return NextResponse.json(
            { error: 'Failed to mark notification as read' },
            { status: 500 }
        )
    }
}
