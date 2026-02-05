
import { db } from "@/lib/db"
import { ProductsClient } from "@/components/admin/products/ProductsClient"

export default async function AdminProductsPage() {
    const products = await db.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            // Count references to allow/disallow delete
            _count: {
                select: {
                    rentalItems: true,
                    rentalPackageItems: true,
                    productUnits: true
                }
            }
        }
    })

    const formattedProducts = products.map(p => ({
        ...p,
        price: Number(p.monthlyPrice),
        isDeletable: p._count.rentalItems === 0 && p._count.rentalPackageItems === 0 && p._count.productUnits === 0
    }))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Products</h2>
            </div>
            <ProductsClient initialProducts={formattedProducts} />
        </div>
    )
}
