import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Get current user's orders
 */
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // TODO: Verify JWT and get actual user ID
        const userId = 'user-id' // Replace with actual JWT verification

        const orders = await db.order.findMany({
            where: { userId },
            include: {
                rentalItems: {
                    include: {
                        product: true,
                        rentalPackage: {
                            include: {
                                rentalPackageItems: {
                                    include: {
                                        product: true
                                    }
                                }
                            }
                        }
                    }
                },
                invoices: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ orders })
    } catch (error) {
        console.error('Get user orders error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}
