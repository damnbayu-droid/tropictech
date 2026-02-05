
import { db } from "@/lib/db"
import { InventoryClient } from "@/components/admin/inventory/InventoryClient"

export default async function AdminInventoryPage() {
    const [units, products] = await Promise.all([
        db.productUnit.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                product: {
                    select: { name: true, category: true }
                }
            }
        }),
        db.product.findMany({
            select: { id: true, name: true }
        })
    ])

    const formattedUnits = units.map(u => ({
        id: u.id,
        unitCode: u.unitCode,
        status: u.status, // AVAILABLE, IN_USE, DAMAGED
        productId: u.productId,
        productName: u.product.name,
        category: u.product.category,
        purchaseDate: u.purchaseDate.toISOString()
    }))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Inventory Units</h2>
            </div>
            <InventoryClient initialUnits={formattedUnits} products={products} />
        </div>
    )
}
