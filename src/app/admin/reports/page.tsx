import { db } from "@/lib/db"
import { ReportsClient } from "@/components/admin/reports/ReportsClient"

export default async function AdminReportsPage() {
    const [
        outstandingInvoicesRaw,
        paidInvoicesRaw,
        allInvoicesRaw
    ] = await Promise.all([
        db.invoice.findMany({
            where: { status: { in: ['PENDING', 'OVERDUE', 'SENT'] } },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        }),
        db.invoice.findMany({
            where: { status: 'PAID' },
            orderBy: { createdAt: 'desc' }
        }),
        db.invoice.findMany({
            orderBy: { createdAt: 'asc' }
        })
    ])

    const paidInvoices = paidInvoicesRaw.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        total: Number(inv.total),
        tax: Number(inv.tax),
        deliveryFee: Number(inv.deliveryFee),
        subtotal: Number(inv.subtotal),
        createdAt: inv.createdAt?.toISOString() || new Date().toISOString(),
        status: inv.status
    }))

    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.total, 0)
    const totalTax = paidInvoices.reduce((acc, inv) => acc + inv.tax, 0)
    const totalDelivery = paidInvoices.reduce((acc, inv) => acc + inv.deliveryFee, 0)

    const outstandingTotal = outstandingInvoicesRaw.reduce((acc, inv) => acc + Number(inv.total), 0)
    const avgOrder = allInvoicesRaw.length > 0 ? (totalRevenue + outstandingTotal) / allInvoicesRaw.length : 0

    // Mock category data
    const categoryData = [
        { name: 'Monitors', value: 45000000 },
        { name: 'Laptops', value: 32000000 },
        { name: 'Chairs', value: 15000000 },
        { name: 'Accessories', value: 8000000 },
    ]

    // Mock revenue by month
    const revenueByMonth = [
        { name: 'Jan', total: 15000000 },
        { name: 'Feb', total: 22000000 },
        { name: 'Mar', total: 18000000 },
        { name: 'Apr', total: 28000000 },
        { name: 'May', total: 35000000 },
        { name: 'Jun', total: 42000000 },
    ]

    const formattedOutstanding = outstandingInvoicesRaw.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        customerName: inv.user?.fullName || inv.guestName || "Unknown",
        date: inv.createdAt?.toISOString() || new Date().toISOString(),
        total: Number(inv.total),
        status: inv.status
    }))

    return (
        <div className="space-y-8 p-1">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight uppercase">Financial Reports</h1>
                <p className="text-muted-foreground">Standardized Odoo-style financial monitoring and accounting</p>
            </div>

            <ReportsClient
                revenueByMonth={revenueByMonth}
                categoryData={categoryData}
                outstandingInvoices={formattedOutstanding}
                paidInvoices={paidInvoices}
                financialSummary={{
                    totalRevenue,
                    totalTax,
                    totalDelivery,
                    outstanding: outstandingTotal,
                    growth: 12.5,
                    averageOrder: avgOrder
                }}
            />
        </div>
    )
}
