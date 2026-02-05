import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, generateToken } from '@/lib/auth/utils'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { username, password, fullName, email, whatsapp } = body

        // Validation
        if (!username || !password || !fullName || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const hashedPassword = await hashPassword(password)

        const user = await db.user.create({
            data: {
                username,
                password: hashedPassword,
                fullName,
                email,
                whatsapp,
                role: 'WORKER',
            },
        })

        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json({ user: userWithoutPassword })
    } catch (error) {
        console.error('Error creating worker:', error)
        return NextResponse.json({ error: 'Failed to create worker' }, { status: 500 })
    }
}
