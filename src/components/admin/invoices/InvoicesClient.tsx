'use client'

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Download,
    Plus,
    Search,
    User,
    UserPlus,
    FileText,
    Link as LinkIcon,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { generateInvoicePDF } from "@/lib/pdf/invoice"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface InvoiceItem {
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number
}

interface Invoice {
    id: string
    invoiceNumber: string
    date: string
    customerName: string
    customerEmail: string
    customerWhatsApp?: string
    total: number
    status: string
    orderNumber: string
    startDate: string
    endDate: string
    items: InvoiceItem[]
    userId?: string
    guestName?: string
    guestEmail?: string
    guestWhatsapp?: string
}

interface InvoicesClientProps {
    initialInvoices: Invoice[]
    users: any[]
}

export function InvoicesClient({ initialInvoices, users }: InvoicesClientProps) {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [invoiceType, setInvoiceType] = useState<"registered" | "guest">("registered")

    // Form State
    const [formData, setFormData] = useState({
        userId: "",
        guestName: "",
        guestEmail: "",
        guestWhatsapp: "",
        amount: "",
        items: "Standard Rental Package",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })

    const filteredInvoices = initialInvoices.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDownload = (invoice: Invoice) => {
        try {
            const pdf = generateInvoicePDF({
                invoiceNumber: invoice.invoiceNumber,
                invoiceDate: new Date(invoice.date).toLocaleDateString(),
                customerName: invoice.customerName,
                customerEmail: invoice.customerEmail,
                customerWhatsApp: invoice.customerWhatsApp,
                orderNumber: invoice.orderNumber?.substring(0, 8) || "MANUAL",
                startDate: new Date(invoice.startDate).toLocaleDateString(),
                endDate: new Date(invoice.endDate).toLocaleDateString(),
                currency: 'Rp',
                subtotal: invoice.total,
                tax: 0,
                total: invoice.total,
                items: invoice.items,
                isRegistered: !!invoice.userId
            } as any)
            pdf.save(`${invoice.invoiceNumber}.pdf`)
            toast.success("Invoice downloaded")
        } catch (error) {
            console.error(error)
            toast.error("Failed to generate PDF")
        }
    }

    const handleShare = (invoice: Invoice) => {
        const link = `${window.location.origin}/invoice/${invoice.id}`
        navigator.clipboard.writeText(link)
        toast.success("Short link copied to clipboard")
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch('/api/admin/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: invoiceType,
                    ...formData,
                    amount: parseFloat(formData.amount)
                })
            })

            if (!res.ok) throw new Error("Failed to create")

            toast.success("Manual invoice created")
            setIsCreateOpen(false)
            router.refresh()
        } catch (error) {
            toast.error("Failed to create invoice")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search invoices..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="font-bold gap-2">
                    <Plus className="h-4 w-4" /> CREATE MANUAL INVOICE
                </Button>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden text-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInvoices.map((inv) => (
                            <TableRow key={inv.id}>
                                <TableCell className="font-mono font-bold text-primary">{inv.invoiceNumber}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold flex items-center gap-1.5">
                                            {inv.userId ? <User className="h-3 w-3 text-blue-500" /> : <UserPlus className="h-3 w-3 text-orange-500" />}
                                            {inv.customerName}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">{inv.customerEmail}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={inv.status === 'PAID' ? 'default' : 'outline'} className="text-[10px] font-bold">
                                        {inv.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-black">Rp {inv.total.toLocaleString('id-ID')}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShare(inv)}>
                                            <LinkIcon className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(inv)}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Manual Invoice</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={onSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                            <Button
                                type="button"
                                variant={invoiceType === 'registered' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setInvoiceType('registered')}
                                className="text-xs font-bold"
                            >Registered User</Button>
                            <Button
                                type="button"
                                variant={invoiceType === 'guest' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setInvoiceType('guest')}
                                className="text-xs font-bold"
                            >Guest / New</Button>
                        </div>

                        {invoiceType === 'registered' ? (
                            <div className="space-y-2">
                                <Label>Select Registered User</Label>
                                <Select value={formData.userId} onValueChange={(v) => setFormData({ ...formData, userId: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chose user..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map(u => (
                                            <SelectItem key={u.id} value={u.id}>{u.fullName || u.username} ({u.email})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label>Full Name</Label>
                                    <Input placeholder="Guest Name" value={formData.guestName} onChange={e => setFormData({ ...formData, guestName: e.target.value })} required />
                                </div>
                                <div className="space-y-1">
                                    <Label>Email</Label>
                                    <Input type="email" placeholder="Email Address" value={formData.guestEmail} onChange={e => setFormData({ ...formData, guestEmail: e.target.value })} required />
                                </div>
                                <div className="space-y-1">
                                    <Label>WhatsApp</Label>
                                    <Input placeholder="+62..." value={formData.guestWhatsapp} onChange={e => setFormData({ ...formData, guestWhatsapp: e.target.value })} />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Rental Item/Service Name</Label>
                            <Input value={formData.items} onChange={e => setFormData({ ...formData, items: e.target.value })} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Total Amount (IDR)</Label>
                                <Input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Currency</Label>
                                <Input value="IDR" disabled />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" className="w-full font-bold uppercase" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                GENERATE INVOICE
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
