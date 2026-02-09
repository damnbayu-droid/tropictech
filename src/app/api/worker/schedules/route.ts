import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Get worker's schedules/jobs
 */
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Extract worker ID from JWT token
        const workerId = 'worker-id' // Replace with actual JWT verification

        const schedules = await db.workerSchedule.findMany({
            where: { workerId },
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                whatsapp: true,
                                baliAddress: true
                            }
                        },
                        rentalItems: {
                            include: {
                                product: true,
                                rentalPackage: true
                            }
                        }
                    }
                },
                assignedByUser: {
                    select: {
                        fullName: true
                    }
                }
            },
            orderBy: {
                scheduledDate: 'desc'
            }
        })

        return NextResponse.json({ schedules })
    } catch (error) {
        console.error('Get worker schedules error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch schedules' },
            { status: 500 }
        )
    }
}
