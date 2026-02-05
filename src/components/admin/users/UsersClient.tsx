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
import { Button } from "@/components/ui/button"
import {
    Eye,
    MessageSquare,
    Search,
    MoreHorizontal,
    UserCircle,
    Package
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UsersClientProps {
    users: any[]
}

export function UsersClient({ users }: UsersClientProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [isRentalsOpen, setIsRentalsOpen] = useState(false)
    const [isMessageOpen, setIsMessageOpen] = useState(false)

    const filteredUsers = users.filter(user =>
        (user.fullName?.toLowerCase() || user.username.toLowerCase()).includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.whatsapp.includes(searchTerm)
    )

    const getUserStatus = (user: any) => {
        const hasActiveOrder = user.orders.some((o: any) => o.status === 'ACTIVE')
        return hasActiveOrder ? 'Active Rent' : 'Not Renting'
    }

    const handleViewRentals = (user: any) => {
        setSelectedUser(user)
        setIsRentalsOpen(true)
    }

    const handleSendMessage = (user: any) => {
        setSelectedUser(user)
        setIsMessageOpen(true)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[250px]">User</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{(user.fullName || user.username).charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{user.fullName || user.username}</span>
                                                <span className="text-[10px] text-muted-foreground">ID: {user.id.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-xs space-y-1">
                                            <span className="flex items-center gap-1.5"><UserCircle className="h-3 w-3 opacity-50" /> {user.email}</span>
                                            <span className="flex items-center gap-1.5 font-medium text-primary"><MessageSquare className="h-3 w-3" /> {user.whatsapp}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={getUserStatus(user) === 'Active Rent' ? 'default' : 'outline'}
                                            className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider",
                                                getUserStatus(user) === 'Active Rent' ? "bg-green-600 hover:bg-green-700" : ""
                                            )}
                                        >
                                            {getUserStatus(user)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 gap-2 border-primary/20 hover:border-primary group"
                                                onClick={() => handleViewRentals(user)}
                                            >
                                                <Package className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                                                <span className="hidden sm:inline">Rent Stuff</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 gap-2 group"
                                                onClick={() => handleSendMessage(user)}
                                            >
                                                <MessageSquare className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                                                <span className="hidden sm:inline">Message</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Rentals Dialog */}
            <Dialog open={isRentalsOpen} onOpenChange={setIsRentalsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Rented Items: {selectedUser?.fullName || selectedUser?.username}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {selectedUser?.orders.length === 0 ? (
                            <p className="text-center text-muted-foreground py-10">This user hasn't rented anything yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {selectedUser?.orders.map((order: any) => (
                                    <div key={order.id} className="p-4 border rounded-xl space-y-3 bg-muted/20">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black uppercase tracking-widest text-primary">Order {order.orderNumber}</span>
                                            <Badge variant="outline">{order.status}</Badge>
                                        </div>
                                        <div className="space-y-2">
                                            {order.rentalItems?.map((item: any) => (
                                                <div key={item.id} className="flex justify-between text-sm items-center">
                                                    <span className="font-medium text-foreground">
                                                        {item.product?.name || item.rentalPackage?.name}
                                                        <span className="text-muted-foreground ml-2">x {item.quantity}</span>
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Until {new Date(order.endDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Message Dialog */}
            <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Internal Message to {selectedUser?.fullName || selectedUser?.username}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 text-center">
                        <div className="h-32 flex flex-col items-center justify-center bg-muted rounded-xl border border-dashed">
                            <MessageSquare className="h-10 w-10 text-muted-foreground opacity-20 mb-2" />
                            <p className="text-sm text-muted-foreground">Supabase Internal Messaging Interface</p>
                            <p className="text-[10px] text-muted-foreground font-mono mt-1">user_id: {selectedUser?.id}</p>
                        </div>
                        <Input placeholder="Type your message here..." className="mt-4" />
                        <Button className="w-full font-bold">SEND MESSAGE</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
