'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, CreditCard, Wallet } from "lucide-react"

interface StatCardsProps {
    stats: {
        totalUsers: number
        verifiedUsers: number
        totalTransactions: number
        totalRevenue: number
    }
}

export function StatCards({ stats }: StatCardsProps) {
    const cardData = [
        {
            title: "Total User",
            value: stats.totalUsers,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            title: "Total Account Verify",
            value: stats.verifiedUsers,
            icon: UserCheck,
            color: "text-green-600",
            bg: "bg-green-100 dark:bg-green-900/20"
        },
        {
            title: "Total Transaksi",
            value: stats.totalTransactions,
            icon: CreditCard,
            color: "text-purple-600",
            bg: "bg-purple-100 dark:bg-purple-900/20"
        },
        {
            title: "Total Revenue",
            value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`,
            icon: Wallet,
            color: "text-orange-600",
            bg: "bg-orange-100 dark:bg-orange-900/20"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cardData.map((card, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <div className={`p-2 rounded-full ${card.bg}`}>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
