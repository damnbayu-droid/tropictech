import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      id,
      name,
      description,
      image_url,
      price,
      duration,
      package_items (
        id,
        quantity,
        products (
          name
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const formatted = data?.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    imageUrl: pkg.image_url,
    price: pkg.price,
    duration: pkg.duration,
    items: pkg.package_items.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        name: item.products?.name ?? ''
      }
    }))
  }))

  return NextResponse.json({ packages: formatted ?? [] })
}
