"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Filter, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Unit {
    id: string
    unitCode: string
    status: string
    productId: string
    productName: string
    category: string
    purchaseDate: string
}

interface Product {
    id: string
    name: string
}

interface InventoryClientProps {
    initialUnits: Unit[]
    products: Product[]
}

export function InventoryClient({ initialUnits, products }: InventoryClientProps) {
    const router = useRouter()
    const [units, setUnits] = useState(initialUnits) // Use local state for immediate optimistic updates if desired, but router.refresh is safer
    const [isLoading, setIsLoading] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)

    // Filters
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [search, setSearch] = useState("")

    // Add Unit Form
    const [addFormData, setAddFormData] = useState({
        productId: "",
        quantity: "1",
        purchaseDate: new Date().toISOString().split('T')[0]
    })

    const filteredUnits = initialUnits.filter(u => {
        const matchesStatus = statusFilter === "ALL" || u.status === statusFilter
        const matchesSearch = u.unitCode.toLowerCase().includes(search.toLowerCase()) ||
            u.productName.toLowerCase().includes(search.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch('/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addFormData)
            })
            if (!res.ok) throw new Error("Failed")

            toast.success("Units generated successfully")
            setIsAddOpen(false)
            router.refresh()
        } catch {
            toast.error("Failed to generate units")
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            // Optimistic update could go here
            await fetch(`/api/inventory/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            toast.success("Status updated")
            router.refresh()
        } catch {
            toast.error("Update failed")
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return 'default' // primary/black
            case 'IN_USE': return 'secondary' // gray
            case 'DAMAGED': return 'destructive' // red
            default: return 'outline'
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Input
                            placeholder="Search units..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="AVAILABLE">Available</SelectItem>
                            <SelectItem value="IN_USE">In Use</SelectItem>
                            <SelectItem value="DAMAGED">Damaged</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Units
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Inventory Units</DialogTitle>
                            <DialogDescription>
                                Select a product and quantity. Unique unit codes will be generated automatically.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Product</Label>
                                <Select
                                    value={addFormData.productId}
                                    onValueChange={(val) => setAddFormData({ ...addFormData, productId: val })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={addFormData.quantity}
                                    onChange={(e) => setAddFormData({ ...addFormData, quantity: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Purchase Date</Label>
                                <Input
                                    type="date"
                                    value={addFormData.purchaseDate}
                                    onChange={(e) => setAddFormData({ ...addFormData, purchaseDate: e.target.value })}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Generate Units
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Unit Code</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Purchased</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUnits.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No units found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUnits.map((unit) => (
                                <TableRow key={unit.id}>
                                    <TableCell className="font-mono">{unit.unitCode}</TableCell>
                                    <TableCell>{unit.productName}</TableCell>
                                    <TableCell>{unit.category}</TableCell>
                                    <TableCell>{new Date(unit.purchaseDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(unit.status) as any}>
                                            {unit.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Select
                                            value={unit.status}
                                            onValueChange={(val) => handleStatusChange(unit.id, val)}
                                        >
                                            <SelectTrigger className="w-[110px] h-8 ml-auto">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AVAILABLE">Available</SelectItem>
                                                <SelectItem value="IN_USE">In Use</SelectItem>
                                                <SelectItem value="DAMAGED">Damaged</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
