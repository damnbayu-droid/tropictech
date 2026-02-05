import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const pkg = await db.rentalPackage.findUnique({
      where: { id },
      include: {
        rentalPackageItems: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ package: pkg })
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const json = await request.json()
    const { items, ...packageData } = json

    // Prepare Prisma update data
    const data: any = { ...packageData }

    // Logic to replace items: Delete all existing, then create new
    if (items && Array.isArray(items)) {
      data.rentalPackageItems = {
        deleteMany: {}, // Clear existing items
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity || 1
        }))
      }
    }

    const pkg = await db.rentalPackage.update({
      where: { id },
      data: data,
    })
    return NextResponse.json({ package: pkg })
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json(
      { error: 'Failed to update package' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.rentalPackage.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Package deleted' })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    )
  }
}
