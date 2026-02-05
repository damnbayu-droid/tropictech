import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const packages = await db.rentalPackage.findMany({
      include: {
        rentalPackageItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    const formatted = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      imageUrl: pkg.imageUrl,
      price: Number(pkg.price), // Decimal to number
      duration: pkg.duration,
      items: pkg.rentalPackageItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          name: item.product.name
        }
      }))
    }))

    return NextResponse.json({ packages: formatted })
  } catch (error) {
    console.error('Error fetching packages FULL:', error)
    return NextResponse.json({ error: 'Failed to fetch packages', details: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { items, ...packageData } = json

    // Prepare Prisma data
    const data: any = { ...packageData }

    // Handle items if present
    if (items && Array.isArray(items)) {
      data.rentalPackageItems = {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity || 1
        }))
      }
    }

    const pkg = await db.rentalPackage.create({
      data: data,
    })
    return NextResponse.json({ package: pkg }, { status: 201 })
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
  }
}
