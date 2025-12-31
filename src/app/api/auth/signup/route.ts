import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, generateUsername, generatePassword, generateToken } from '@/lib/auth/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fullName,
      email,
      whatsapp,
      baliAddress,
      mapsAddressLink,
      passportPhoto,
    } = body

    if (!fullName || !email || !whatsapp) {
      return NextResponse.json(
        { error: 'Full name, email, and WhatsApp are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Generate username and password
    const username = generateUsername(fullName)
    const password = generatePassword()
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        fullName,
        whatsapp,
        baliAddress,
        mapsAddressLink,
        passportPhoto,
        role: 'USER',
      },
    })

    // Generate token
    const token = await generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      credentials: {
        username,
        password,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
