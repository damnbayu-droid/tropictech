"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Order {
    id: string
    user: string
    email: string
    period: string
    status: string
    itemCount: number
    totalAmount: number
}

interface OrdersClientProps {
    initialOrders: Order[]
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'default'
            case 'COMPLETED': return 'secondary'
            case 'CANCELLED': return 'destructive'
            case 'PENDING': return 'outline'
            default: return 'outline'
        }
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Rental Period</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialOrders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        initialOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{order.user}</span>
                                        <span className="text-xs text-muted-foreground">{order.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{order.period}</TableCell>
                                <TableCell>{order.itemCount}</TableCell>
                                <TableCell>Rp {order.totalAmount.toLocaleString('id-ID')}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusColor(order.status) as any}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
